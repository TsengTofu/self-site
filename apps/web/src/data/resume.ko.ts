import type { Resume } from "./resume";

/**
 * 韓文版履歷(/resume/ko),結構跟 resume.ts 一樣
 * 由中英文版翻譯而來,現職一樣不寫公司名;上線前建議請母語者順過一次
 */
export const resumeKo: Resume = {
  nameEn: "TSENG FU CHUN",
  nameZh: "曾輔君",
  headline: "프론트엔드 엔지니어 | AI 도입 · 프로세스 구축 · 팀 역량 강화",
  location: "대만 타오위안",
  email: "tsengbatty@gmail.com",
  github: { label: "github.com/TsengTofu", url: "https://github.com/TsengTofu" },
  medium: { label: "tsengbatty.medium.com", url: "https://tsengbatty.medium.com/" },

  summary:
    "약 7년 경력의 프론트엔드 엔지니어로(그 전 3년은 그래픽·웹 디자이너), React·TypeScript·Next.js 기반 B2B SaaS를 전문으로 합니다. 기술 부채가 있는 제품에서 구조적인 작업을 해 왔습니다. 가상화를 적용한 5단계 중첩 계층형 테이블, 설정 기반(config-driven) 사이드바와 권한 구조, 계약 서명 플로우와 PDF 파이프라인을 만들었고, 아키텍처 관점의 리팩터링(Semi Design → Shadcn/ui 전환, 전사 업로드 컴포넌트 재작성, Turborepo 서비스 추상화)을 이끌었습니다. 오래 묵은 배포 충돌 문제의 원인을 찾아 해결했으며, 2024년 7월부터 AI를 일상 개발 흐름에 도입해 배포를 자동화했습니다.",

  skills: [
    { id: "framework", label: "프레임워크·언어", items: ["React", "TypeScript", "Next.js(SPA / SSR)", "Vue", "JavaScript"] },
    {
      id: "data",
      label: "상태·폼·데이터",
      items: ["Zustand", "React Hook Form", "TanStack Query", "TanStack Table", "Zod", "REST API 연동"],
    },
    {
      id: "style",
      label: "스타일·디자인 시스템",
      items: ["Shadcn/ui", "Tailwind CSS", "Semi Design", "SCSS Module", "디자인 토큰", "Storybook(탐색 중)"],
    },
    { id: "test", label: "테스트", items: ["Jest", "React Testing Library"] },
    {
      id: "tooling",
      label: "아키텍처·도구",
      items: ["Turborepo(모노레포)", "Git / GitLab CI", "release-it", "Commitizen", "commitlint", "Husky", "GPG 서명", "i18n"],
    },
    {
      id: "ai",
      label: "AI 엔지니어링",
      items: ["Claude Code(skills, sandbox)", "MCP(Notion / Figma / Shadcn UI)", "AI 에이전트 활용 개발·리팩터링", "AI 코드 리뷰"],
    },
    {
      id: "collab",
      label: "협업",
      items: ["직군 간 협업(PM / 디자인 / 백엔드 / QA)", "스펙 정렬", "코드 리뷰 문화", "애자일 / 스크럼", "팀 프로세스 구축"],
    },
    { id: "viz", label: "시각화", items: ["D3", "Vis", "ECharts", "Shadcn Chart"] },
    { id: "lang", label: "언어", items: ["중국어(모국어)", "영어", "한국어(TOPIK 2급)"] },
  ],

  experiences: [
    {
      id: "current",
      role: "프론트엔드 엔지니어(리팩터링)",
      org: "B2B SaaS",
      start: "2025/11",
      stack: ["React", "Next.js", "TypeScript", "Shadcn/ui", "Turborepo", "Claude Code", "MCP"],
      highlights: [
        ["AI 도입", "배포 과정을 단일 명령으로 통합해 일일 배포 시간을 60분에서 10분으로 단축했습니다. AI가 생성한 코드는 반드시 아키텍처 검토를 거치도록 해 태스크당 약 1.5–2일 만에 QA로 전달합니다."],
        ["확산과 거버넌스", "Skill에서 민감한 설정을 분리하고 권한 규칙을 정해 팀원 온보딩을 도왔습니다. 사내 AI 공유회를 6회 진행했고 AI 에이전트 예산도 확보했습니다."],
        ["프로세스 구축", "Sprint, Git 전략, PR 리뷰 제도를 처음부터 도입했습니다. 배포 방식 논쟁에서는 점진적 개선안으로 팀 간 합의를 이끌었고, 운영 서버 충돌의 근본 원인을 찾아 이후 20개 버전을 안정적으로 배포했습니다."],
        ["요구사항과 전달", "PM·디자인·백엔드와 범위를 정리하며 여러 대안을 제시했습니다. 계약 서명 다단계 플로우를 1.5개월 만에 완성하고, 컴포넌트 라이브러리 전환과 전사 업로드 컴포넌트 재작성(약 100개 파일)을 주도했습니다."],
        ["오너십", "2026년 7월부터 프론트엔드 전체를 단독으로 맡아 인수인계 문서를 보완하고, 일정 지연 없이 개발을 이어 가고 있습니다."],
      ],
      intro:
        "리팩터링을 핵심 역할로 합류해 첫 주부터 개발에 참여했습니다. 초기에는 복잡한 기능을 완성하고, 이후 아키텍처 리팩터링과 개발 프로세스 구축을 이끌었으며, 팀 개편 후에는 프론트엔드 전체를 맡았습니다.",
      metrics: [
        { value: "60 → 10분", label: "일일 배포 시간" },
        { value: "1.5–2일", label: "태스크당 QA 전달" },
        { value: "1.5개월", label: "계약 서명 플로우 완성" },
        { value: "약 100개 파일", label: "업로드 컴포넌트 재작성" },
      ],
      bullets: [
        ["계약 서명 플로우", "복잡한 변수 시스템이 얽힌 계약 서명 다단계 플로우(전자 서명, 도장 업로드·자르기, 첨부 파일, PDF 생성·미리보기)를 1.5개월 만에 완성했습니다. AI 에이전트를 활용했고, PM·디자인·백엔드와 반복적인 스펙 회의로 요구사항의 경계를 정리하며 여러 대안을 제시했습니다."],
        ["AI 도입", "2024년 7월부터 일상 개발에 AI를 도입했습니다(두 회사에 걸쳐). Claude Code로 release skill, release-it, GPG 서명, Commitizen 규칙을 하나의 배포 흐름으로 묶어 일일 배포를 약 60분에서 10분으로 줄였고, AI 생성 코드에 아키텍처 검토를 의무화해 태스크당 약 1.5–2일 만에 QA로 전달합니다."],
        ["Skill의 팀 자산화", "Skill의 민감한 설정을 환경 변수로 옮겨 프로젝트 간에 재사용할 수 있게 했고, 이름 접두사로 로컬과 프로젝트 Skill의 우선순위 충돌을 해결했으며, 다른 프론트엔드 개발자의 배포 흐름 온보딩을 도왔습니다. Claude Code 자동 PR 리뷰를 설정하고 Notion MCP(local vs cloud) 인증 문제를 해결했습니다."],
        ["배포 충돌 해결", "운영 서버 배포 때마다 쌓이던 충돌 문제를 분석했습니다. 모든 Merge Request를 Squash로 합치면서 test → prod 이력이 압축되고 merge base가 멈춰 있던 것이 원인이었습니다. 특정 버전을 rebase로 정리한 뒤 일반 merge로 돌아가는 방법과 hotfix/release 브랜치 규칙을 정해, 이후 v1.0.27부터 v1.0.48까지 안정적으로 배포했습니다."],
        ["컴포넌트 라이브러리", "Semi Design에서 Shadcn/ui로의 점진적 전환을 이끌며 디자인 토큰과 컴포넌트 인터페이스를 통일했습니다. 전사 파일 업로드 컴포넌트를 Shadcn 기반으로 재작성했고(도장 업로드·자르기: 1:1 고정, 회전·반전, 커스텀 툴바 포함), 약 100개 파일에 걸친 변경을 디자이너와 여러 차례 회의하며 정리했습니다."],
        ["타임존 규칙", "타임존에 의존하지 않는 캘린더 컴포넌트를 설계하고 전사 날짜·시간 규칙을 정착시켰습니다. 시스템 경계에서만 변환하고, 선호 타임존 값과 순수 날짜 문자열을 구분하며, 계약 시간은 +0으로 저장하고 관리자 화면은 관리자 타임존으로 표시하도록 백엔드와 합의했습니다."],
        ["모노레포 아키텍처", "Turborepo 모노레포에서 서비스 추상화(계정 서비스를 Zustand Provider와 useQuery 캐시로 관리)를 설계했고, PDF 서비스 아키텍처(Next.js App Router, Turborepo, react-pdf / Puppeteer)를 기획하며 SSRF 허용 목록, 타임아웃, 메모리 누수, MQ + Worker 비동기 방식을 검토했습니다(기획 단계)."],
        ["리팩터링 설득", "PM과 디자인을 설득해 프론트엔드 리팩터링을 시작했고, 배포 프로세스 논쟁에서는 한 번에 바꾸기보다 점진적 개선을 주장해 팀 간 합의를 얻었습니다."],
        ["Sprint와 프로세스", "팀이 Sprint를 처음부터 도입하도록 도왔습니다. release를 Sprint 시작점으로 삼는 Git 브랜치 전략, PR 리뷰 제도, 리뷰 완료 시 readyForTest로 표시하고 PM이 배포 시점을 정하는 인계 규칙을 만들었고, GitLab MR 라벨, pre-commit 빌드 검사, 배포 알림 전용 Slack 채널을 도입했습니다."],
        ["코드 리뷰", "프론트엔드 PR을 꾸준히 리뷰했습니다(하루 최대 6건, 누적 100건 이상). 팀원마다 일하는 방식에 맞추면서 집중 시간을 지켰고, 2026년 7월 팀 개편 이후 프론트엔드 개발과 유지보수를 모두 맡아 인수인계 문서를 보완했습니다."],
        ["기능 범위", "임대 현황과 계약 조회(RWD, 트리 선택), 공간 인수·반납, 운영·정산 대시보드(Shadcn Chart, 다중 API, 권한·상태별 UI), 회원 목록 필터, 은행 가상 계좌 연동, 임대 의향 알림과 증빙 발행, 공간 도면 첨부 등을 개발하며 기존 i18n 구조를 유지·확장했습니다."],
        ["공유", "사내 AI 도구 공유회를 6회 진행했고(진행 중, 회당 약 5명) AI 에이전트 예산을 확보했습니다. Medium에 Jest 테스트, Git 워크플로, 데이터 시각화에 관한 글을 씁니다."],
      ],
    },
    {
      id: "commeet",
      role: "프론트엔드 엔지니어",
      org: "COMMEET",
      start: "2019/10",
      end: "2025/10",
      stack: ["Next.js", "TypeScript", "Zustand", "TanStack", "Vue", "D3"],
      highlights: [
        ["경비 정산 플랫폼", "재무·PM과 결재와 리포트 요구사항을 꾸준히 조율했습니다. 5단계 중첩 계층형 테이블을 구현하고, 사이드바를 설정 기반으로 리팩터링(6개 파일 → 설정 파일 1개)했으며, PR 리뷰 프로세스를 정착시켰습니다."],
        ["TRP 데이터 플랫폼", "협업 프로세스, 코딩 스타일, 코드 리뷰를 처음부터 정의하고 개발·배포 문서를 작성했습니다."],
        ["TSMC 시각화 SPA", "고객 담당자와 직접 소통하며 4개월간 주 2회 미팅으로 요구사항부터 전달까지 진행했습니다."],
      ],
      intro:
        "6개의 B2B 플랫폼에 참여하며 UI 구현에서 협업 프로세스와 아키텍처 설계를 이끄는 역할로 성장했고, TRP와 COMMEET 두 플랫폼의 프론트엔드 협업 체계를 처음부터 만들었습니다.",
      metrics: [
        { value: "6개", label: "참여한 B2B 플랫폼" },
        { value: "6개 → 1개", label: "사이드바 변경 범위(파일)" },
        { value: "5단계", label: "중첩 계층형 테이블" },
        { value: "4개월", label: "주 2회 고객 미팅" },
      ],
      groups: [
        {
          title: "COMMEET 경비 정산 플랫폼",
          stack: ["Next.js", "TypeScript", "Zustand", "TanStack Query / Table", "Tailwind CSS", "Koa", "SCSS Module"],
          intro: "가상 카드로 직원 경비를 처리하는 플랫폼으로, 신청·결재, 카드 발급, 예산과 리포트 관리를 다룹니다.",
          bullets: [
            ["계층형 테이블", "부모 ID에 따라 하위 데이터를 동적으로 불러오는 5단계 무한 중첩 테이블을 만들었습니다. 렌더링과 저장 계층을 분리하고 가상화로 DOM 수를 제어해 대량 데이터의 메모리 문제를 해결했으며, 열 고정·너비 조절·그룹 경계 처리를 지원했습니다."],
            ["사이드바 리팩터링", "설정 기반 사이드바 리팩터링(2025/09–11)을 주도했습니다. 전략 패턴으로 메뉴 유형별 설정·데이터 훅·렌더링을 하나의 인터페이스로 묶었고, React Hooks 규칙과의 충돌은 훅의 소유 계층을 다시 나눠 해결했으며, 메뉴 변경 범위를 6개 파일에서 설정 파일 1개로 줄였습니다."],
            ["폼 필드 팩토리", "필드 설정과 레이아웃 로직을 분리해, 새 필드를 추가해도 컴포넌트를 고칠 필요가 없게 했습니다."],
            "복잡한 폼, 결재 플로우, 카드 발급 플로우를 개발하고 Zustand와 TanStack Query / Table을 도입했습니다(처음으로 주도한 기술 선정).",
            "재사용 컴포넌트와 Custom Hook으로 비즈니스 로직을 캡슐화하고 TypeScript로 타입 안정성을 높였습니다.",
            "Jest와 React Testing Library로 컴포넌트 단위 테스트를 작성했습니다.",
            "팀의 Git Pull Request 리뷰 프로세스를 만들었습니다.",
          ],
        },
        {
          title: "TRP 출장 데이터 플랫폼",
          stack: ["Next.js", "ECharts", "Koa", "SCSS Module"],
          intro: "출장·여행 데이터 플랫폼으로, 처음부터 구축에 참여했습니다.",
          bullets: [
            "팀과 함께 협업 프로세스, 코딩 스타일, 코드 리뷰 방식을 처음부터 정의했습니다.",
            "UI 디자이너와 색상 가이드라인 등을 논의하고 플랫폼 컴포넌트 개발과 API 연동을 맡았습니다.",
            "개발 문서, Git·배포 흐름도, 스타일 관리 규칙과 공통 스타일 변수를 작성했습니다.",
          ],
        },
        {
          title: "TSMC 시각화 SPA",
          stack: ["Vue", "D3", "Vis", "JavaScript"],
          intro: "API 문서와 Postman으로 백엔드와 분리 협업했고, 4개월간 주 2회 전화 회의로 요구사항과 프로토타입부터 최종 조정까지 진행했습니다.",
          bullets: ["글 조회·검색·댓글·비밀 메시지(CRUD) 기능을 개발했습니다.", "D3 / Vis로 비즈니스 데이터를 시각화하고 분기 리포트 업로드·관리를 지원했습니다."],
        },
        {
          title: "유지보수 프로젝트",
          intro: "Acer 여행 서비스 플랫폼, Tripsaas, Tripresso 웹사이트(Vue / Backbone)의 퍼블리싱, 기능 개발, 성능 개선과 기존 구조 유지보수.",
        },
      ],
    },
    {
      id: "appworks",
      role: "Web Class 수료생",
      org: "AppWorks School",
      start: "2019/02",
      end: "2019/06",
      stack: ["JavaScript", "React", "REST API"],
      highlights: ["풀스택 부트캠프에서 이커머스 사이트 STYLiSH를 처음부터 구현하며 JavaScript 기초를 다졌습니다."],
      bullets: [
        "STYLiSH를 처음부터 만들며 RESTful API를 연동하고, 웹과 앱에서 같은 기능을 구현했습니다.",
        "동기들과 함께 Prototype, this, closure 등 JavaScript 핵심 개념을 공부했습니다.",
        "React로 웹사이트를 처음부터 만들었습니다.",
      ],
      link: { label: "STYLiSH", url: "https://tsengtofu.github.io/stylish_test/" },
    },
    {
      id: "ashlie",
      role: "웹 디자이너",
      org: "Ashlie Works",
      start: "2015/07",
      end: "2018/09",
      stack: ["HTML", "CSS", "JavaScript", "AJAX", "Photoshop", "Illustrator"],
      highlights: [
        "3M, Samsung 등 브랜드의 비주얼 디자인, EDM, 반응형 퍼블리싱을 맡아 디자인과 프론트엔드 구현을 함께 했습니다.",
        "이 디자인 경험 덕분에 디자이너와 긴밀히 협업하고 디자인 시스템을 실제로 적용할 수 있습니다.",
      ],
      intro: "3M과 Samsung의 비주얼 디자인, EDM, 웹 퍼블리싱을 맡아 디자인과 프론트엔드 구현을 오갔습니다.",
      bullets: [
        "3M 여러 제품군의 EDM을 디자인해 공식 사이트에 삽입했고, 선택 가능한 텍스트 위주로 퍼블리싱해 SEO를 개선했습니다.",
        "회사 공식 웹사이트를 반응형으로 개편했습니다.",
        "Samsung 태블릿 특집 페이지의 탭 전환 인터랙션을 JavaScript로 구현했습니다.",
        "프로젝트당 1–2주 동안 고객과 시안을 주고받으며 피드백으로 디자인을 다듬었습니다.",
      ],
      link: { label: "Ashlie Works", url: "https://www.ashlieworks.com/" },
    },
    {
      id: "maxidea",
      role: "비주얼 플래너",
      org: "Maxidea Creative Strategy",
      start: "2014/07",
      end: "2015/03",
      stack: ["Photoshop", "Illustrator"],
      highlights: ["Adobe 도구로 POSM 진열물, 움직이는 배너, 웹 레이아웃을 디자인하고 일정과 고객 소통을 맡았습니다."],
      bullets: ["Adobe 도구로 POSM 진열물, 움직이는 배너, 웹 레이아웃을 디자인했습니다.", "프로젝트 일정 관리와 고객 소통을 맡았습니다."],
    },
  ],

  teaching: [
    {
      value: "18명",
      title: "프론트엔드 프로젝트 멘토",
      desc: "HexSchool(六角學院)에서 6개월간 멘토로 활동하며 6명씩 3개 팀을 동시에 이끌어 프로젝트 기획과 구현을 지도했습니다.",
    },
    { value: "6회", title: "사내 AI 공유회", desc: "회사에서 AI 도구 공유회를 진행하고 있습니다(진행 중, 회당 약 5명)." },
    { value: "1회", title: "온라인 강의 시강", desc: "프론트엔드 온라인 강의에 초청되어 한 차례 강의했고, 수강생에게 좋은 반응을 얻었습니다." },
    {
      value: "커뮤니티",
      title: "AIPost Future Circle",
      desc: "Cohort 01 멤버로 2단계 AI 검토 파이프라인을 설계하고 AI 도구 활용 경험을 나눴습니다.",
    },
  ],

  education: { school: "단강대학교(淡江大學)", dept: "정보커뮤니케이션학과", start: "2010/09", end: "2014/06" },

  certificates: [
    { title: "Adobe Certified Associate", desc: "Visual Communication using Adobe Photoshop CS3", date: "2012/02" },
    { title: "TOPIK 2급", desc: "한국어능력시험" },
    { title: "2024 WebConf 타이완 자원봉사자", desc: "대만 프론트엔드 컨퍼런스에서 현장 지원과 진행을 도왔습니다.", date: "2024/12" },
  ],
};
