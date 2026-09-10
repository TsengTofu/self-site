import { profile } from "@/data/profile";

/** Gmail 撰寫視窗的連結:收件人固定是我,主旨由呼叫端決定(聯絡 App 與履歷頁共用) */
export const gmailComposeUrl = (subject: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${encodeURIComponent(subject)}`;
