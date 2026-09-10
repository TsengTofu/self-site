"use client";

/**
 * root layout 本身掛掉時的最後防線(取代 Next 預設的無樣式錯誤頁)
 * 這裡拿不到 app 的 CSS(layout 沒渲染成功),所以樣式全部 inline
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="zh-Hant">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#1b2230",
          color: "#faf4ea",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontSize: 40, margin: 0 }}>🛠️</p>
          <h1 style={{ fontSize: 20, margin: "12px 0 4px" }}>整個房間暫時打不開</h1>
          <p style={{ fontSize: 14, opacity: 0.7, margin: 0 }}>重新整理一下,或稍後再來。</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              padding: "10px 24px",
              borderRadius: 9999,
              border: "1px solid rgba(250,244,234,.3)",
              background: "transparent",
              color: "#faf4ea",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            重新載入
          </button>
        </div>
      </body>
    </html>
  );
}
