/**
 * 音樂相關資料。
 *
 * TODO(songs): 把每首歌的 youtubeVideoId 換成你想放的 YouTube 影片 ID
 *   (影片網址 v= 後面那串,例如 https://www.youtube.com/watch?v=xxxxxxxxxxx)。
 *   留空會顯示示範模式提示,而不是壞掉的播放器。
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  /** 留空 → 顯示示範模式提示而不是壞掉的播放器 */
  youtubeVideoId: string;
  coverColor: string;
}

export const songs: Song[] = [
  {
    id: "serenade",
    title: "Serenade",
    artist: "BOYNEXTDOOR",
    youtubeVideoId: "",
    coverColor: "#f2c14e",
  },
  {
    id: "song-2",
    title: "第二首歌",
    artist: "某個歌手",
    youtubeVideoId: "",
    coverColor: "#e8a0bf",
  },
  {
    id: "song-3",
    title: "第三首歌",
    artist: "某個歌手",
    youtubeVideoId: "",
    coverColor: "#7c9ef8",
  },
];
