"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CloseButton } from "@self-site/ui/close-button";
import { songs } from "@/data/music";
import { useSceneStore } from "@/stores/scene-store";

/**
 * 整合式音樂播放器 —— 取代舊的兩套獨立功能:歌單 overlay + 左下角背景音樂小播放器。
 * 點耳機 / 音響展開選歌,縮小鍵收合成左下角膠囊,播放不中斷,再點膠囊重新展開。
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
  const playerOrigin = useSceneStore((s) => s.playerOrigin);
  const expandPlayer = useSceneStore((s) => s.expandPlayer);
  const minimizePlayer = useSceneStore((s) => s.minimizePlayer);
  const closePlayer = useSceneStore((s) => s.closePlayer);
  const playSong = useSceneStore((s) => s.playSong);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const song = songs.find((s) => s.id === currentSongId) ?? null;
  const expanded = playerMode === "expanded";

  /** 縮小鍵 / backdrop / Esc 共用:有歌播放中 → 收合成 mini;沒歌 → 直接關閉 */
  const dismiss = () => {
    if (currentSongId) {
      minimizePlayer();
    } else {
      closePlayer();
    }
  };

  // Esc 只在展開時生效
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, currentSongId]);

  // 只動 transform/opacity,展開/收合各自的進場動畫
  useGSAP(
    () => {
      if (expanded) {
        const backdrop = rootRef.current?.querySelector("[data-player-backdrop]");
        if (backdrop) {
          gsap.from(backdrop, { opacity: 0, duration: 0.35, ease: "power2.out" });
        }
        if (!panelRef.current) return;
        if (playerOrigin) {
          // 比照 overlay-shell.tsx:從觸發物件的位置飛出來
          const rect = panelRef.current.getBoundingClientRect();
          const dx = playerOrigin.left + playerOrigin.width / 2 - (rect.left + rect.width / 2);
          const dy = playerOrigin.top + playerOrigin.height / 2 - (rect.top + rect.height / 2);
          gsap.from(panelRef.current, {
            x: dx,
            y: dy,
            scale: 0.2,
            opacity: 0,
            duration: 0.65,
            ease: "back.out(1.3)",
          });
        } else {
          gsap.from(panelRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 24,
            duration: 0.45,
            ease: "power3.out",
          });
        }
      } else if (playerMode === "mini" && panelRef.current) {
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
      aria-label={expanded ? "音樂播放器" : undefined}
      className={
        expanded
          ? "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          : "fixed bottom-20 left-4 z-40 md:bottom-5 md:left-5"
      }
    >
      {expanded && (
        <div
          data-player-backdrop
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={dismiss}
        />
      )}

      <div
        ref={panelRef}
        className={
          expanded
            ? "relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#1c1d26] shadow-2xl"
            : "flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1c1d26]/90 p-3 pr-4 shadow-2xl backdrop-blur"
        }
      >
        {/* slot 1:header(只在展開時顯示) */}
        {expanded && (
          <header className="flex items-center gap-3 border-b border-white/10 p-4">
            <span
              className={`grid size-11 shrink-0 animate-spin-slow place-items-center rounded-full text-xl ${
                song ? "" : "bg-gradient-to-br from-[#e8a0bf] to-[#7c9ef8]"
              }`}
              style={
                song
                  ? { background: `radial-gradient(circle, ${song.coverColor} 28%, #20242f 30%)` }
                  : undefined
              }
            >
              {song ? <span className="size-2.5 rounded-full bg-[#20242f]" /> : "🎧"}
            </span>
            <div className="flex-1">
              <h2 className="font-bold text-white">我最近在聽</h2>
              <p className="text-xs text-white/50">戴上耳機,聽聽我的世界</p>
            </div>
            <button
              type="button"
              aria-label="縮小播放器"
              onClick={dismiss}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-lg text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              —
            </button>
            <CloseButton onClick={closePlayer} />
          </header>
        )}

        {/* slot 2:影片容器 —— iframe 永遠的家,收合時只是視覺上藏起來,絕不 unmount */}
        <div
          className={
            expanded
              ? "aspect-video w-full bg-black/40"
              : "pointer-events-none absolute size-px overflow-hidden opacity-0"
          }
        >
          {!song ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="text-4xl">🎵</span>
              <p className="text-sm text-white/80">還沒選歌</p>
              <p className="text-xs text-white/45">在下面的清單挑一首吧</p>
            </div>
          ) : !song.youtubeVideoId ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="text-4xl">🎵</span>
              <p className="text-sm text-white/80">示範模式</p>
              <p className="max-w-sm text-xs leading-relaxed text-white/45">
                到 <code className="rounded bg-white/10 px-1.5 py-0.5">src/data/music.ts</code> 幫「{song.title}
                」填上 YouTube 影片 ID(網址 <code className="rounded bg-white/10 px-1">v=</code> 後面那串),
                這裡就會變成真正的播放器。
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
          <ul className="max-h-[40dvh] overflow-y-auto p-2">
            {songs.map((s) => {
              const playing = s.id === currentSongId;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => playSong(s.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5 ${
                      playing ? "bg-white/10" : ""
                    }`}
                  >
                    <span
                      className="size-8 shrink-0 rounded-full"
                      style={{ backgroundColor: s.coverColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{s.title}</p>
                      <p className="truncate text-xs text-white/50">{s.artist}</p>
                    </div>
                    {playing && (
                      <span className="flex items-end gap-0.5" aria-hidden>
                        {[0, 0.25, 0.5].map((delay) => (
                          <span
                            key={delay}
                            className="eq-bar w-1 rounded-full bg-[#e8a0bf]"
                            style={{ height: 14, animationDelay: `${delay}s` }}
                          />
                        ))}
                      </span>
                    )}
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
              <span
                className={`grid size-12 shrink-0 animate-spin-slow place-items-center rounded-full text-lg shadow-inner ${
                  song ? "" : "bg-gradient-to-br from-[#e8a0bf] to-[#7c9ef8]"
                }`}
                style={
                  song
                    ? { background: `radial-gradient(circle, ${song.coverColor} 28%, #20242f 30%)` }
                    : undefined
                }
              >
                <span className="size-2.5 rounded-full bg-[#20242f]" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{song?.title ?? "還沒選歌"}</p>
                <p className="truncate text-xs text-white/50">{song?.artist ?? "點耳機或音響挑一首"}</p>
                {song && !song.youtubeVideoId && (
                  <p className="text-[10px] text-white/30">示範模式 — 到 data/music.ts 填 videoId</p>
                )}
              </div>
            </button>
            {song && (
              <span className="flex items-end gap-0.5 pb-0.5" aria-hidden>
                {[0, 0.25, 0.5].map((delay) => (
                  <span
                    key={delay}
                    className="eq-bar w-1 rounded-full bg-[#e8a0bf]"
                    style={{ height: 14, animationDelay: `${delay}s` }}
                  />
                ))}
              </span>
            )}
            <button
              type="button"
              aria-label="停止播放"
              onClick={closePlayer}
              className="ml-1 grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs text-white/70 transition hover:bg-white/20"
            >
              ■
            </button>
          </>
        )}
      </div>
    </div>
  );
}
