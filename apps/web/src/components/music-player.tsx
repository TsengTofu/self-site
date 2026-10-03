"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Music, Square, X } from "lucide-react";
import { songs } from "@/data/music";
import { useSceneStore } from "@/stores/scene-store";
import { prefersReducedMotion } from "@/lib/motion";
import { useModalFocus } from "@self-site/ui/use-modal-focus";
import { VinylDisc } from "@/components/vinyl-disc";
import { EqBars } from "@/components/eq-bars";
import { BAR_BUTTON } from "@/components/overlays/full-page";

/**
 * 整合式音樂播放器 —— 取代舊的兩套獨立功能:歌單 overlay + 左下角背景音樂小播放器。
 * 點耳機 / 音響展開成全頁選歌,回到房間後收合成左下角膠囊,播放不中斷,再點膠囊重新展開。
 *
 * iframe 永不 remount 是這個元件最重要的規則:
 * - root 與 panel 永遠是同一個 <div>,展開/收合只換 className。
 * - panel 內的四個 JSX slot(header / 影片容器 / 歌曲清單 / mini 內容)順序固定,
 *   只用條件渲染決定內容有沒有東西,不會互相搬動位置。
 * - 影片容器永遠 render,收合時只用
 *   `pointer-events-none absolute size-px overflow-hidden opacity-0` 視覺藏起來,
 *   絕對不用 `hidden` / `display:none`(會讓 YouTube iframe 暫停播放)。
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

  const song = songs.find((s) => s.id === currentSongId) ?? null;
  const expanded = playerMode === "expanded";

  /** 回到房間 / Esc 共用:有歌播放中 → 收合成 mini;沒歌 → 直接關閉 */
  const dismiss = () => {
    if (currentSongId) {
      minimizePlayer();
    } else {
      closePlayer();
    }
  };

  // 展開時才啟用焦點圈:Tab 循環、Esc 呼叫 dismiss(語意不變:有歌播放中 → 收合,沒歌 → 關閉)
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

  // 關閉 = 刻意卸載 = 停止播放
  if (playerMode === "hidden") return null;

  return (
    <div
      ref={rootRef}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label={expanded ? "我在聽什麼" : undefined}
      className={
        expanded
          ? "cover-in-now fixed inset-0 z-50 flex flex-col bg-cream text-ink"
          : "fixed bottom-20 left-4 z-40 md:bottom-5 md:left-5"
      }
    >
      {/* 全頁時:手機是上下排(頂部列 → 影片 → 清單),桌機是頂部列 + 左影片右清單 */}
      <div
        ref={panelRef}
        className={
          expanded
            ? "flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:grid-rows-[auto_minmax(0,1fr)]"
            : "flex items-center gap-3 rounded-2xl border border-white/10 bg-panel/90 p-3 pr-4 shadow-2xl backdrop-blur"
        }
      >
        {/* slot 1:header(只在展開時顯示) */}
        {expanded && (
          <header className="flex shrink-0 items-center gap-3 border-b border-ink-soft/10 bg-cream/95 px-4 py-3 md:col-span-2 md:px-10">
            <VinylDisc coverColor={song?.coverColor ?? null} size={11} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold tracking-[0.35em] text-ink-dim">MUSIC</p>
              <h2 className="text-lg font-bold md:text-xl">我在聽什麼</h2>
              <p className="hidden text-xs text-ink-soft sm:block">
                {song ? "回到房間後，音樂會在左下角繼續播" : "戴上耳機，聽聽我的世界"}
              </p>
            </div>
            {song && (
              <button type="button" onClick={closePlayer} className={BAR_BUTTON}>
                <Square className="size-3.5 fill-current" aria-hidden />
                停止播放
              </button>
            )}
            <button type="button" onClick={dismiss} className={BAR_BUTTON}>
              <X className="size-4" aria-hidden />
              回到房間
            </button>
          </header>
        )}

        {/* slot 2:影片容器 —— iframe 永遠的家,收合時只是視覺上藏起來,絕不 unmount */}
        <div
          className={
            expanded
              ? "aspect-video w-full shrink-0 bg-[#2a2420] md:m-8 md:mr-4 md:w-auto md:self-start md:overflow-hidden md:rounded-2xl md:shadow-[0_10px_30px_rgba(74,60,48,.18)]"
              : "pointer-events-none absolute size-px overflow-hidden opacity-0"
          }
        >
          {!song ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Music className="size-10 text-white/70" strokeWidth={1.75} aria-hidden />
              <p className="text-sm text-white/80">還沒選歌</p>
              <p className="text-xs text-white/60">在下面的清單挑一首吧</p>
            </div>
          ) : !song.youtubeVideoId ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Music className="size-10 text-white/70" strokeWidth={1.75} aria-hidden />
              <p className="text-sm text-white/80">這首歌還沒接上音源</p>
              <p className="max-w-sm text-xs leading-relaxed text-white/60">
                （站長備忘：到{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5">src/data/music.ts</code> 填
                videoId）
              </p>
            </div>
          ) : (
            // 換歌 = 換 key = 乾淨 reload(不污染瀏覽歷史);切 expanded/mini 完全不碰它
            <iframe
              key={song.id}
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${song.youtubeVideoId}?autoplay=1`}
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
              const playing = s.id === currentSongId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => playSong(s.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/70 ${
                      playing ? "bg-white/80 shadow-sm" : ""
                    }`}
                  >
                    <span
                      className="size-8 shrink-0 rounded-full"
                      style={{ backgroundColor: s.coverColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{s.title}</p>
                      <p className="truncate text-xs text-ink-dim">{s.artist}</p>
                    </div>
                    {playing && <EqBars />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* slot 4:mini 內容(只在收合時顯示) */}
        {!expanded && (
          <>
            <button
              type="button"
              onClick={(e) => expandPlayer(e.currentTarget.getBoundingClientRect())}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <VinylDisc coverColor={song?.coverColor ?? null} size={12} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{song?.title ?? "還沒選歌"}</p>
                <p className="truncate text-xs text-white/50">
                  {song?.artist ?? "點耳機或音響挑一首"}
                </p>
                {song && !song.youtubeVideoId && (
                  <p className="text-[10px] text-white/60">還沒接上音源（站長備忘：填 videoId）</p>
                )}
              </div>
            </button>
            {song && (
              <span className="pb-0.5">
                <EqBars />
              </span>
            )}
            <button
              type="button"
              aria-label="停止播放"
              onClick={closePlayer}
              className="ml-1 grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs text-white/70 transition hover:bg-white/20"
            >
              <Square className="size-3 fill-current" aria-hidden />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
