// 沿用 web 的規則,元件庫不用另外養一套
// next 的 no-html-link-for-pages 要知道 pages 在哪,指回 web
import web from "../../apps/web/eslint.config.mjs";

export default [...web, { settings: { next: { rootDir: "../../apps/web" } } }];
