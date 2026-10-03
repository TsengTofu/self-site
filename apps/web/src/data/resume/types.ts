/**
 * 履歷資料的格式(資料契約)
 * 畫面只認這份格式,內容來源可以是專案裡的 JSON,之後也可以換成 API 或 CMS
 * 欄位都是 JSON 能直接表示的型別(字串、數字、布林、陣列、物件),方便串接
 */

export type ResumeLang = "zh" | "en" | "ko";

/** 一條重點:可以帶粗體小標 */
export interface Bullet {
  label?: string;
  text: string;
}

export interface Metric {
  /**
   * 左上角的圖示名稱,對照表在 components/resume/resume-icons.tsx
   * 目前有 timer、rocket、signature、files、layers、merge、tree、meetings;對不到就不放圖示
   */
  icon?: string;
  /** 插圖網址,有填就用插圖取代圖示 */
  image?: string;
  value: string;
  label: string;
}

/** 一段經歷底下的子專案 */
export interface ProjectGroup {
  title: string;
  stack?: string[];
  intro?: string;
  bullets?: Bullet[];
}

export interface Experience {
  id: string;
  /** 重點經歷:一進來就展開;其他的先收合成灰色,點了才打開 */
  featured?: boolean;
  role: string;
  org: string;
  /** 「2025/11」這種年月字串 */
  start: string;
  /** 沒填就是現職 */
  end?: string;
  /** 這份工作的重點技能 */
  stack: string[];
  /** 一句話說明,展開「看完整經歷」才顯示 */
  intro?: string;
  metrics?: Metric[];
  /** 平常就看得到的亮點 */
  highlights: Bullet[];
  bullets?: Bullet[];
  /** 底下的子專案(例如 COMMEET 的四個平台) */
  groups?: ProjectGroup[];
  link?: { label: string; url: string };
}

export interface Skill {
  name: string;
  /** Simple Icons 的 slug(例如 react、typescript),有對照到的會在文字前面放官方 Logo */
  logo?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  items: Skill[];
}

export interface TeachingStat {
  value: string;
  title: string;
  desc: string;
}

export interface Certificate {
  title: string;
  desc?: string;
  date?: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface Profile {
  nameEn: string;
  nameZh: string;
  headline: string;
  summary: string;
  location: string;
  contacts: { email: string; github: LinkItem; medium: LinkItem };
}

export interface Resume {
  profile: Profile;
  /** 新到舊,現職在最上面 */
  experiences: Experience[];
  skills: SkillGroup[];
  teaching: TeachingStat[];
  education: { school: string; dept: string; start: string; end: string };
  /** 證照與活動 */
  certificates: Certificate[];
}
