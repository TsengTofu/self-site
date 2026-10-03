/**
 * 音樂相關資料:播放器(components/music-player.tsx)的歌單
 * youtubeVideoId = 影片網址 v= 後面那串;留空會顯示示範模式提示,不會壞掉
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
    id: "adios",
    title: "ADIOS!",
    artist: "BOYNEXTDOOR",
    youtubeVideoId: "dTWxjbJZ238",
    coverColor: "#f2c14e",
  },
  {
    id: "boom-boom-boom",
    title: "Boom Boom Boom",
    artist: "BOYNEXTDOOR",
    youtubeVideoId: "ntLoF0LnAwY",
    coverColor: "#e8a0bf",
  },
  {
    id: "viral",
    title: "VIRAL",
    artist: "BOYNEXTDOOR",
    youtubeVideoId: "zGsj0fDHB_s",
    coverColor: "#7c9ef8",
  },
  {
    id: "knock-knock-knock",
    title: "똑똑똑",
    artist: "BOYNEXTDOOR",
    youtubeVideoId: "WxGWMI2B7r8",
    coverColor: "#8fc7a3",
  },
];
