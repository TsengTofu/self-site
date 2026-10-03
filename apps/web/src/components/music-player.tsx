"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Maximize2, Music, Pause, Play, SkipBack, SkipForward, Square, X } from "lucide-react";
import { songCover, songs } from "@/data/music";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";
import { useModalFocus } from "@self-site/ui/use-modal-focus";
import { MusicDisc } from "@/components/music-disc";
import { EqBars } from "@/components/eq-bars";

/**
 * YouTube 嵌入網址:nocookie 網域、手機不跳全螢幕、播完不推薦別台的影片
 * 關掉控制列、鍵盤、全螢幕鈕、資訊卡,讓畫面只剩影片;
 * enablejsapi 讓我們自己的按鈕可以用 postMessage 叫它暫停/繼續
 */
const embedUrl = (videoId: string) =>
  `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&enablejsapi=1`;

/** 對 YouTube iframe 下指令,不用另外載 YouTube 的 API 腳本 */
function sendCommand(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
}

/**
 * 預設不要字幕:YouTube 會依觀看者自己的偏好自動開字幕,網址參數關不掉,
 * 只能等播放器載入後叫它卸下字幕模組;字幕模組開播後才載入,所以分幾次送
 */
const CAPTIONS_OFF_DELAYS = [800, 2000, 4000];
function hideCaptions(iframe: HTMLIFrameElement | null) {
  CAPTIONS_OFF_DELAYS.forEach((ms) =>
    window.setTimeout(() => {
      sendCommand(iframe, "unloadModule", ["captions"]);
      sendCommand(iframe, "unloadModule", ["cc"]);
    }, ms),
  );
}

/**
 * 請 YouTube 把播放狀態傳回來(一樣不載它的 API 腳本,走 postMessage)
 * 播放器剛載入時可能還沒準備好,所以隔一下再講一次
 */
const LISTEN_DELAYS = [0, 500, 1500, 3000];
function listenToPlayer(iframe: HTMLIFrameElement, id: string) {
  LISTEN_DELAYS.forEach((ms) =>
    window.setTimeout(() => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id, channel: "widget" }),
        "*",
      );
    }, ms),
  );
}

/** 從 YouTube 傳來的訊息讀出播放狀態碼(-1 還沒開始、1 播放中、2 暫停、3 緩衝、5 待播),讀不到回 null */
function readPlayerState(data: unknown): number | null {
  if (typeof data !== "string") return null;
  try {
    const msg = JSON.parse(data);
    const state = msg.event === "onStateChange" ? msg.info : msg.info?.playerState;
    return typeof state === "number" ? state : null;
  } catch {
    return null;
  }
}

/** 卡在「還沒開始」超過這麼久,就當作自動播放被瀏覽器擋下 */
const STUCK_MS = 1500;

/** mini 卡片上的小圓鈕(不加底色,看起來比較輕) */
const MINI_BUTTON =
  "grid size-6 shrink-0 place-items-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white";
/** 全螢幕播放時的圓鈕 */
const ROUND_BUTTON =
  "grid size-10 shrink-0 place-items-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white";

/**
 * 音樂播放器,兩種樣子(沒在播就什麼都不顯示):
 * - expanded:點耳機或音響打開,整個螢幕都是影片,底下一條播放控制和選歌
 * - mini:回到房間後縮在左下角(手機在 dock 上方)的小卡片,可以暫停、換歌、展開、停止
 *
 * YouTube 政策要求嵌入的播放器要看得到、至少 200×200,也不能蓋東西在影片上,
 * 所以 mini 的影片框是 216×200(影片上下會有黑邊),控制鈕都放在影片框外面
 *
 * 手機瀏覽器(尤其 iPhone)不讓網頁替 iframe 自動播有聲音的影片,一定要使用者親手點影片,
 * 所以會聽 YouTube 回報的播放狀態,卡住時開放點影片,並提示「點一下影片開始播放」
 *
 * iframe 永不 remount 是這個元件最重要的規則:
 * - root 與 panel 永遠是同一個 <div>,展開/收合只換 className
 * - panel 內的四個 slot(header / 影片容器 / 底部控制列 / mini 控制列)順序固定,
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
  // YouTube 回報的真實狀態,一樣記上是哪一首,換歌後舊的自然失效
  const [ytState, setYtState] = useState<{ songId: string; state: number } | null>(null);
  // 自動播放被擋下、卡在還沒開始的那一首
  const [stuckSongId, setStuckSongId] = useState<string | null>(null);

  const song = songs.find((s) => s.id === currentSongId) ?? null;
  const expanded = playerMode === "expanded";
  const canPlay = Boolean(song?.youtubeVideoId);
  const knownState = ytState?.songId === currentSongId ? ytState.state : null;
  // 被擋下,或不是我們按的暫停(例如鎖定畫面的控制),都要使用者點影片
  const needsTap =
    canPlay &&
    (stuckSongId === currentSongId || (knownState === 2 && pausedSongId !== currentSongId));
  // 開播後以 YouTube 回報的為準;還沒開播前先樂觀當作在播,免得載入時跳一下
  const started = knownState !== null && knownState !== -1 && knownState !== 5;
  const playing =
    canPlay &&
    !needsTap &&
    (started ? knownState === 1 || knownState === 3 : pausedSongId !== currentSongId);

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

  /** 換到前一首(-1)或下一首(1),頭尾相接 */
  const skip = (step: 1 | -1) => {
    const i = songs.findIndex((s) => s.id === currentSongId);
    playSong(songs[(i + step + songs.length) % songs.length]!.id);
  };

  // 聽 YouTube 回報的狀態;同一個狀態重複回報不算,才不會一直重新計時
  useEffect(() => {
    if (!canPlay || !currentSongId) return;
    const songId = currentSongId;
    let last: number | null = null;
    let stuckTimer: number | undefined;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      const state = readPlayerState(e.data);
      if (state === null || state === last) return;
      last = state;
      setYtState({ songId, state });
      window.clearTimeout(stuckTimer);
      if (state === -1 || state === 5) {
        stuckTimer = window.setTimeout(() => setStuckSongId(songId), STUCK_MS);
      } else {
        setStuckSongId(null);
      }
      // 字幕模組開播才載入,手機點了才播的話,載入時的那幾次早就送完了,所以開播時再關一次
      if (state === 1) hideCaptions(iframeRef.current);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(stuckTimer);
    };
  }, [canPlay, currentSongId]);

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

  // 沒在播就什麼都不顯示;關閉 = 卸載 iframe = 停止播放
  if (playerMode === "hidden") return null;

  const tapHint = (className: string, text: string) => (
    <p className={`truncate font-medium text-[#f6c98f] ${className}`}>{text}</p>
  );

  return (
    <div
      ref={rootRef}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label={expanded ? "我在聽什麼" : "迷你播放器"}
      className={
        expanded
          ? "cover-in-now fixed inset-0 z-50 flex flex-col bg-[#0e0c0b] text-white"
          : "fixed bottom-[5.5rem] left-3 z-40 md:bottom-5 md:left-5"
      }
    >
      {/* 全螢幕:頂部列 → 影片(佔滿剩下的高度)→ 底部控制列
          mini:上面影片、下面一列歌名與小圓鈕 */}
      <div
        ref={panelRef}
        className={
          expanded
            ? "flex min-h-0 flex-1 flex-col"
            : "w-[232px] overflow-hidden rounded-[22px] border border-white/10 bg-panel/95 p-2 shadow-2xl backdrop-blur"
        }
      >
        {/* slot 1:頂部列(只在展開時顯示) */}
        {expanded && (
          <header className="flex shrink-0 items-center gap-3 px-4 py-3 md:px-8">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold tracking-[0.35em] text-white/45">MUSIC</p>
              <h2 className="text-base font-bold md:text-lg">我在聽什麼</h2>
            </div>
            <span className="hidden text-xs text-white/40 lg:inline">按 Esc 也能關閉</span>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium transition hover:bg-white/20 active:scale-95"
            >
              <X className="size-4" aria-hidden />
              回到房間
            </button>
          </header>
        )}

        {/* slot 2:影片容器 —— iframe 永遠的家,展開/收合只換大小,絕不 unmount
            全螢幕時影片自己會依比例置中、多的地方留黑 */}
        <div
          className={
            expanded
              ? "min-h-0 flex-1 bg-black"
              : "h-[200px] w-full overflow-hidden rounded-[14px] bg-black"
          }
        >
          {!song ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Music className="size-8 text-white/60" strokeWidth={1.75} aria-hidden />
              <p className="text-sm text-white/75">還沒選歌</p>
            </div>
          ) : !song.youtubeVideoId ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <Music className="size-8 text-white/60" strokeWidth={1.75} aria-hidden />
              <p className="text-sm text-white/75">這首歌還沒接上音源</p>
              <p className="max-w-sm text-xs leading-relaxed text-white/55">
                （站長備忘：到{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5">src/data/music.ts</code> 填
                videoId）
              </p>
            </div>
          ) : (
            // 換歌 = 換 key = 乾淨 reload(不污染瀏覽歷史);切 expanded/mini 完全不碰它
            // 平常不接受滑鼠,YouTube 的標題列、暫停時的推薦影片就不會跳出來;播放控制交給我們的按鈕
            // 只有自動播放被擋下時開放點影片,播起來就再關掉
            <iframe
              key={song.id}
              ref={iframeRef}
              onLoad={(e) => {
                listenToPlayer(e.currentTarget, song.id);
                hideCaptions(e.currentTarget);
              }}
              className={`h-full w-full ${needsTap ? "" : "pointer-events-none"}`}
              src={embedUrl(song.youtubeVideoId)}
              title={`${song.artist} — ${song.title}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* slot 3:底部控制列(只在展開時顯示)—— 左邊正在播與控制鈕,右邊橫排選歌 */}
        {expanded && (
          <div className="shrink-0 border-t border-white/10 px-4 py-3 md:flex md:items-center md:gap-8 md:px-8">
            <div className="flex items-center gap-3 md:shrink-0">
              <MusicDisc
                image={song ? songCover(song) : null}
                coverColor={song?.coverColor}
                size={11}
                spinning={playing}
              />
              <div className="min-w-0 flex-1 md:w-44 md:flex-none">
                <p className="truncate text-sm font-bold">{song?.title ?? "還沒選歌"}</p>
                {needsTap ? (
                  tapHint("text-xs", "點一下影片開始播放")
                ) : (
                  <p className="truncate text-xs text-white/50">
                    {song?.artist ?? "從右邊挑一首吧"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  aria-label="上一首"
                  onClick={() => skip(-1)}
                  className={ROUND_BUTTON}
                >
                  <SkipBack className="size-[18px] fill-current" aria-hidden />
                </button>
                {canPlay && (
                  <button
                    type="button"
                    aria-label={playing ? "暫停" : "繼續播放"}
                    onClick={togglePause}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#0e0c0b] transition hover:scale-105 active:scale-95"
                  >
                    <PauseIcon className="size-[18px] fill-current" aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="下一首"
                  onClick={() => skip(1)}
                  className={ROUND_BUTTON}
                >
                  <SkipForward className="size-[18px] fill-current" aria-hidden />
                </button>
                {song && (
                  <button
                    type="button"
                    aria-label="停止播放"
                    onClick={closePlayer}
                    className={ROUND_BUTTON}
                  >
                    <Square className="size-3.5 fill-current" aria-hidden />
                  </button>
                )}
              </div>
            </div>

            {/* 選歌:橫向一排,放不下時左右滑 */}
            <ul className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 [scrollbar-width:none] md:mx-0 md:mt-0 md:min-w-0 md:flex-1 md:px-0">
              {songs.map((s) => {
                const isCurrent = s.id === currentSongId;
                const cover = songCover(s);
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => playSong(s.id)}
                      aria-current={isCurrent ? "true" : undefined}
                      className={`flex items-center gap-2.5 rounded-xl p-1.5 pr-3 text-left transition hover:bg-white/10 ${
                        isCurrent ? "bg-white/15" : ""
                      }`}
                    >
                      {/* 縮圖:YouTube 影片封面,沒有的話用代表色 */}
                      <span
                        aria-hidden
                        className="h-8 w-14 shrink-0 rounded-md bg-cover bg-center"
                        style={{
                          backgroundColor: s.coverColor,
                          backgroundImage: cover ? `url("${cover}")` : undefined,
                        }}
                      />
                      <span className="min-w-0">
                        <span className="block max-w-32 truncate text-xs font-medium">
                          {s.title}
                        </span>
                        <span className="block max-w-32 truncate text-[10px] text-white/45">
                          {s.artist}
                        </span>
                      </span>
                      {isCurrent && playing && <EqBars height={10} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* slot 4:mini 控制列(只在收合時顯示) */}
        {!expanded && (
          <div className="flex items-center gap-0.5 px-1 pt-2">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[13px] font-bold leading-tight text-white">
                <span className="truncate">{song?.title ?? "還沒選歌"}</span>
                {playing && <EqBars height={9} />}
              </p>
              {needsTap ? (
                tapHint("text-[11px]", "點影片開始播放")
              ) : (
                <p className="truncate text-[11px] text-white/45">{song?.artist}</p>
              )}
            </div>
            {canPlay && (
              <button
                type="button"
                aria-label={playing ? "暫停" : "繼續播放"}
                onClick={togglePause}
                className={MINI_BUTTON}
              >
                <PauseIcon className="size-3.5 fill-current" aria-hidden />
              </button>
            )}
            <button
              type="button"
              aria-label="下一首"
              onClick={() => skip(1)}
              className={MINI_BUTTON}
            >
              <SkipForward className="size-3.5 fill-current" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="展開播放器"
              onClick={(e) => expandPlayer(e.currentTarget.getBoundingClientRect())}
              className={MINI_BUTTON}
            >
              <Maximize2 className="size-3.5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="停止播放"
              onClick={closePlayer}
              className={MINI_BUTTON}
            >
              <Square className="size-3 fill-current" aria-hidden />
            </button>
          </div>
        )}
      </div>
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
