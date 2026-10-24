
## AGENTS.md

本文件面向 AI 编码助手。开始任何修改前，请先完整阅读本文件。

这是一个需要部署在cloudflare pagers上面的项目，主要是一个前端项目，使用了vue3和pinia。

### 项目介绍
一个**纯前端**的在线试题测试应用。用户打开页面即可答题、交卷、查看成绩与解析。
**没有后端、没有数据库、没有用户登录**。所有数据留在浏览器本地。

- 技术栈：Vue 3 + TypeScript + Vite + Pinia + Vue Router（hash 模式）
- 包管理器：pnpm（禁止使用 npm / yarn，不要生成 package-lock.json）
- 部署目标：任意静态托管（GitHub Pages / Vercel / Netlify）

### 项目目标

本项目要实现的核心能力，按优先级排序：

1. **答题**：支持单选、多选、判断三种题型，可上一题/下一题跳转。
2. **进度追踪**：顶部显示进度，答题卡用三态（未答 / 已答 / 已标记）展示每题状态。
3. **交卷评分**：交卷后在**前端**完成评分，展示总分、得分、逐题对错与解析。
4. **进度持久化**：刷新或关闭页面后，已答内容、标记、当前题号不丢失。
5. **重新答题**：结果页提供入口，可清空进度重新开始。

**非目标（明确不做）**：
- 不做后端 API、不做数据库、不做账号体系。
- 不做题库在线编辑器（题库是静态 JSON，由开发者维护）。
- 不做多人排行、在线对战。
- 不引入 UI 组件库（如 Element Plus），样式手写，保持依赖精简。


### 项目目录结构
```
krogle/                          # 项目根目录
├── public/                      # 不经过构建处理的静态资源
│   └── data/
│       └── questions.json       # 题库数据（运行时 fetch 加载）
├── src/                         # 源码目录
│   ├── components/              # 可复用组件
│   │   ├── question-types/      # 按题型拆分的题目子组件
│   │   │   ├── SingleChoice.vue
│   │   │   ├── MultipleChoice.vue
│   │   │   └── JudgeQuestion.vue
│   │   ├── QuizHeader.vue       # 顶部进度条 / 题号 / 计时
│   │   ├── QuizPlayer.vue       # 题目播放器（动态组件工厂）
│   │   ├── QuizNav.vue          # 上一题 / 下一题 / 标记按钮
│   │   └── AnswerSheet.vue      # 答题卡（题号网格）
│   ├── views/                   # 路由级页面组件
│   │   ├── QuizView.vue         # 答题页
│   │   └── ResultView.vue       # 成绩与解析页
│   ├── stores/                  # Pinia 状态仓库
│   │   └── quiz.ts
│   ├── router/                  # Vue Router 配置
│   │   └── index.ts
│   ├── types/                   # TypeScript 类型定义
│   │   └── quiz.ts
│   ├── utils/                   # 纯函数工具
│   │   └── scoring.ts
│   ├── composables/             # 可复用组合式函数
│   │   └── useQuizLoader.ts
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 应用入口
├── index.html                   # HTML 模板入口
├── package.json
├── tsconfig.json                # 应用代码的 TS 配置
├── tsconfig.node.json           # Node 端（vite.config.ts）的 TS 配置
├── vite.config.ts               # Vite 构建配置
└── env.d.ts                     # 环境类型声明（.vue 模块等）

```

### 试题设计规范

题库文件位于 `public/data/questions.json`，是一个 `Question[]` 数组。
每道题必须符合 `src/types/quiz.ts` 中的 `Question` 接口：

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `string` | 是 | 全局唯一且稳定，格式建议 `q-001`。**禁止用数组索引代替** |
| `type` | `'single' \| 'multiple' \| 'judge'` | 是 | 题型 |
| `stem` | `string` | 是 | 题干，纯文本，不含 HTML |
| `options` | `string[]` | 单选/多选必填 | 选项内容，不含 "A." 前缀（前缀由组件渲染） |
| `answer` | `string \| string[]` | 是 | 单选/判断为 `'A'`；多选为 `['A','C']` |
| `score` | `number` | 否 | 默认 1 分 |
| `analysis` | `string` | 否 | 答案解析，结果页展示 |

### 题型约定

**单选题（single）**
- 选项 4 个，答案唯一，`answer` 为单个字母字符串。
- 选项字母由索引生成：`String.fromCharCode(65 + index)`，即 A/B/C/D。

**多选题（multiple）**
- 选项 4~5 个，答案至少 2 个，`answer` 为**升序排列**的字母数组。
- 评分规则：**完全匹配才得分**（不考虑部分给分），比较前双方都排序。

**判断题（judge）**
- 不写 `options` 字段，组件固定渲染「正确 / 错误」。
- `answer` 为 `'A'`（正确）或 `'B'`（错误）。

### 题库内容要求

- 每套题库 10~20 题，覆盖三种题型，单选占比最高。
- 题干清晰、无歧义；每道题必须提供 `analysis`。
- 题库是**静态数据**，不由用户编辑，不通过网络提交。

根据这个目录结构给我完善这个项目
### Git
通过 Git 进行版本控制，建议在项目根目录下初始化 Git 仓库，并创建 `.gitignore` 文件，忽略 `node_modules/`、`dist/` 等不需要提交的文件夹。


