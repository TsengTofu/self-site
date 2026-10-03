"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Maximize2, Music, Pause, Play, SkipForward, Square, X } from "lucide-react";
import { songCover, songs } from "@/data/music";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";
import { useModalFocus } from "@self-site/ui/use-modal-focus";
import { MusicDisc } from "@/components/music-disc";
import { EqBars } from "@/components/eq-bars";
import { BAR_BUTTON } from "@/components/overlays/full-page";

/**
 * YouTube 嵌入網址:nocookie 網域、手機不跳全螢幕、播完不推薦別台的影片
 * 關掉控制列、鍵盤、全螢幕鈕、資訊卡,讓畫面只剩影片;
 * enablejsapi 讓我們自己的按鈕可以用 postMessage 叫它暫停/繼續
 */
const embedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&enablejsapi=1`;

/** 對 YouTube iframe 下指令(pauseVideo / playVideo),不用另外載 YouTube 的 API 腳本 */
function sendCommand(iframe: HTMLIFrameElement | null, func: "pauseVideo" | "playVideo") {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

/** mini 卡片上的小圓鈕 */
const MINI_BUTTON =
  "grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white";

/**
 * 音樂播放器,三種樣子:
 * - 沒在播:桌機左下角一顆小膠囊(手機改從右上選單開),點播放鍵直接播第一首
 * - mini:左下角(手機在 dock 上方)一張看得到影片的小卡片,可以換下一首、展開、停止
 * - expanded:點耳機或音響打開的全頁「我在聽什麼」
 *
 * YouTube 政策要求嵌入的播放器要看得到、至少 200×200,
 * 所以 mini 也把影片放出來(356×200),不再藏成 1px 只放聲音
 *
 * iframe 永不 remount 是這個元件最重要的規則:
 * - root 與 panel 永遠是同一個 <div>,展開/收合只換 className
 * - panel 內的四個 slot(header / 影片容器 / 歌曲清單 / mini 控制列)順序固定,
 *   只用條件渲染決定有沒有內容,不會互相搬動位置
 */
export function MusicPlayer() {
  const playerMode = useSceneStore((s) => s.playerMode);
  const currentSongId = useSceneStore((s) => s.currentSongId);
  const expandPlayer = useSceneStore((s) => s.expandPlayer);
  const minimizePlayer = useSceneStore((s) => s.minimizePlayer);
  const closePlayer = useSceneStore((s) => s.closePlayer);
  const playSong = useSceneStore((s) => s.playSong);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // 記「哪一首被暫停」:換歌時自然就不是暫停狀態,不用另外重設
  const [pausedSongId, setPausedSongId] = useState<string | null>(null);

  const song = songs.find((s) => s.id === currentSongId) ?? null;
  const expanded = playerMode === "expanded";
  const canPlay = Boolean(song?.youtubeVideoId);
  const playing = canPlay && pausedSongId !== currentSongId;

  const togglePause = () => {
    if (playing) {
      sendCommand(iframeRef.current, "pauseVideo");
      setPausedSongId(currentSongId);
    } else {
      sendCommand(iframeRef.current, "playVideo");
      setPausedSongId(null);
    }
  };
  const PauseIcon = playing ? Pause : Play;

  /** 回到房間 / Esc 共用:有歌播放中 → 收合成 mini;沒歌 → 直接關閉 */
  const dismiss = () => {
    if (currentSongId) minimizePlayer();
    else closePlayer();
  };

  const playNext = () => {
    const i = songs.findIndex((s) => s.id === currentSongId);
    playSong(songs[(i + 1) % songs.length]!.id);
  };

  // 展開時才啟用焦點圈:Tab 循環、Esc 呼叫 dismiss
  useModalFocus(expanded, panelRef, dismiss);

  // 收合成 mini 時從下面彈上來;展開是全頁,用 CSS 的 cover-in-now 淡入
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (playerMode === "mini" && panelRef.current) {
        gsap.from(panelRef.current, { y: 80, opacity: 0, duration: 0.5, ease: "back.out(1.6)" });
      }
    },
    { dependencies: [playerMode], scope: rootRef },
  );

  // 沒在播:桌機左下角的小膠囊;關閉 = 卸載 iframe = 停止播放
  if (playerMode === "hidden") return <IdlePill />;

  return (
    <div
      ref={rootRef}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label={expanded ? "我在聽什麼" : "迷你播放器"}
      className={
        expanded
          ? "cover-in-now fixed inset-0 z-50 flex flex-col bg-cream text-ink"
          : "fixed inset-x-3 bottom-[5.5rem] z-40 md:inset-x-auto md:bottom-5 md:left-5"
      }
    >
      {/* 全頁時:手機是上下排(頂部列 → 影片 → 清單),桌機是頂部列 + 左影片右清單
          mini 時:上面影片、下面一列控制 */}
      <div
        ref={panelRef}
        className={
          expanded
            ? "flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)]"
            : "overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-2xl backdrop-blur md:w-[356px]"
        }
      >
        {/* slot 1:header(只在展開時顯示) */}
        {expanded && (
          <header className="flex shrink-0 items-center gap-3 border-b border-ink-soft/10 bg-cream/95 px-4 py-3 md:col-span-2 md:px-10">
            {/* 手機寬度不夠,頂部列不放光碟(mini 卡片上看得到) */}
            <span className="hidden sm:block">
              <MusicDisc image={song ? songCover(song) : null} coverColor={song?.coverColor} size={11} spinning={playing} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold tracking-[0.35em] text-ink-dim">MUSIC</p>
              <h2 className="whitespace-nowrap text-lg font-bold md:text-xl">我在聽什麼</h2>
              <p className="hidden text-xs text-ink-soft sm:block">
                {song ? "回到房間後，影片會縮到左下角繼續播" : "戴上耳機，聽聽我的世界"}
              </p>
            </div>
            {canPlay && (
              // 手機寬度不夠,暫停和停止只留圖示,文字給讀屏
              <button type="button" onClick={togglePause} aria-label={playing ? "暫停" : "繼續播放"} className={BAR_BUTTON}>
                <PauseIcon className="size-3.5 fill-current" aria-hidden />
                <span className="hidden sm:inline">{playing ? "暫停" : "繼續播放"}</span>
              </button>
            )}
            {song && (
              <button type="button" onClick={closePlayer} aria-label="停止" className={BAR_BUTTON}>
                <Square className="size-3.5 fill-current" aria-hidden />
                <span className="hidden sm:inline">停止</span>
              </button>
            )}
            <button type="button" onClick={dismiss} className={BAR_BUTTON}>
              <X className="size-4" aria-hidden />
              回到房間
            </button>
          </header>
        )}

        {/* slot 2:影片容器 —— iframe 永遠的家,展開/收合只換大小,絕不 unmount */}
        <div
          className={
            expanded
              ? "aspect-video w-full shrink-0 bg-[#2a2420] md:m-8 md:mr-4 md:w-auto md:self-start md:overflow-hidden md:rounded-2xl md:shadow-[0_10px_30px_rgba(74,60,48,.18)]"
              : "h-[200px] w-full bg-black"
          }
        >
          {!song ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Music className="size-10 text-white/70" strokeWidth={1.75} aria-hidden />
              <p className="text-sm text-white/80">還沒選歌</p>
              <p className="text-xs text-white/60">在清單挑一首吧</p>
            </div>
          ) : !song.youtubeVideoId ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Music className="size-10 text-white/70" strokeWidth={1.75} aria-hidden />
              <p className="text-sm text-white/80">這首歌還沒接上音源</p>
              <p className="max-w-sm text-xs leading-relaxed text-white/60">
                （站長備忘：到 <code className="rounded bg-white/10 px-1.5 py-0.5">src/data/music.ts</code>{" "}
                填 videoId）
              </p>
            </div>
          ) : (
            // 換歌 = 換 key = 乾淨 reload(不污染瀏覽歷史);切 expanded/mini 完全不碰它
            // 不接受滑鼠,YouTube 的標題列、暫停時的推薦影片就不會跳出來;播放控制交給我們的按鈕
            <iframe
              key={song.id}
              ref={iframeRef}
              className="pointer-events-none h-full w-full"
              src={embedUrl(song.youtubeVideoId)}
              title={`${song.artist} — ${song.title}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* slot 3:歌曲清單(只在展開時顯示) */}
        {expanded && (
          <ul className="min-h-0 flex-1 overflow-y-auto p-3 md:p-8 md:pl-4">
            {songs.map((s) => {
              const isCurrent = s.id === currentSongId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => playSong(s.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/70 ${
                      isCurrent ? "bg-white/80 shadow-sm" : ""
                    }`}
                  >
                    {/* 縮圖:YouTube 影片封面,沒有的話用代表色 */}
                    <span
                      aria-hidden
                      className="h-9 w-16 shrink-0 rounded-md bg-cover bg-center shadow-sm"
                      style={{ backgroundColor: s.coverColor, backgroundImage: songCover(s) ? `url("${songCover(s)}")` : undefined }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{s.title}</p>
                      <p className="truncate text-xs text-ink-dim">{s.artist}</p>
                    </div>
                    {isCurrent && playing && <EqBars />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* slot 4:mini 控制列(只在收合時顯示) */}
        {!expanded && (
          <div className="flex items-center gap-2.5 p-2.5 pr-3">
            <MusicDisc image={song ? songCover(song) : null} coverColor={song?.coverColor} size={12} spinning={playing} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{song?.title ?? "還沒選歌"}</p>
              <p className="truncate text-xs text-white/50">{song?.artist ?? "點耳機或音響挑一首"}</p>
            </div>
            {playing && <EqBars />}
            {canPlay && (
              <button type="button" aria-label={playing ? "暫停" : "繼續播放"} onClick={togglePause} className={MINI_BUTTON}>
                <PauseIcon className="size-4 fill-current" aria-hidden />
              </button>
            )}
            <button type="button" aria-label="下一首" onClick={playNext} className={MINI_BUTTON}>
              <SkipForward className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="展開歌單"
              onClick={(e) => expandPlayer(e.currentTarget.getBoundingClientRect())}
              className={MINI_BUTTON}
            >
              <Maximize2 className="size-4" aria-hidden />
            </button>
            <button type="button" aria-label="停止播放" onClick={closePlayer} className={MINI_BUTTON}>
              <Square className="size-3 fill-current" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 沒在播的時候,桌機左下角的小膠囊:點唱片那塊打開歌單,點播放鍵直接播第一首
 * 手機的底部是 dock,這顆不放,改從右上角選單開關音樂
 */
function IdlePill() {
  const expandPlayer = useSceneStore((s) => s.expandPlayer);
  const startMusic = useStartMusic();

  return (
    <div className="fixed bottom-5 left-5 z-40 hidden items-center gap-1 rounded-full border border-white/10 bg-panel/85 p-1.5 pr-2 shadow-xl backdrop-blur md:flex">
      <button
        type="button"
        onClick={(e) => expandPlayer(e.currentTarget.getBoundingClientRect())}
        className="flex items-center gap-2.5 rounded-full pr-2 text-left transition hover:bg-white/5"
      >
        <MusicDisc image={songCover(songs[0]!)} size={11} />
        <span>
          <span className="block text-sm font-bold text-white">我在聽什麼</span>
          <span className="block text-[11px] text-white/50">點開看歌單</span>
        </span>
      </button>
      <button
        type="button"
        aria-label="播放音樂"
        onClick={startMusic}
        className="grid size-9 place-items-center rounded-full bg-white text-panel transition hover:scale-105 active:scale-95"
      >
        <Play className="size-4 translate-x-px fill-current" aria-hidden />
      </button>
    </div>
  );
}

/** 開始播第一首,播放器縮成 mini(右上選單的音樂開關也用) */
export function useStartMusic() {
  const playSong = useSceneStore((s) => s.playSong);
  const minimizePlayer = useSceneStore((s) => s.minimizePlayer);
  return () => {
    playSong(songs[0]!.id);
    minimizePlayer();
  };
}
