/**
 * 背包裡的書 — 近期讀過、喜歡到想推薦的書(內容已定稿;資料庫化後改由 DB 供應)。
 */
export interface Book {
  title: string;
  author: string;
  note: string; // 為什麼推薦
  cover: string; // 書封色
}

export const books: Book[] = [
  {
    title: "原子習慣",
    author: "James Clear",
    note: "把「變好」拆成可以每天執行的最小單位,工程師的迭代思維放到人生上。",
    cover: "#e9b44c",
  },
  {
    title: "克拉拉與太陽",
    author: "石黑一雄",
    note: "用 AI 的眼睛看人類的愛,溫柔又刺人。",
    cover: "#9db4d0",
  },
  {
    title: "軟體架構原理:工程方法",
    author: "Mark Richards & Neal Ford",
    note: "「沒有最好的架構,只有取捨」— 做 monorepo 決策時讀它特別有感。",
    cover: "#b56b75",
  },
  {
    title: "也許你該找人聊聊",
    author: "Lori Gottlieb",
    note: "心理師自己也需要心理師。誠實面對情緒這件事,和誠實面對技術債一樣重要。",
    cover: "#88a1db",
  },
];
