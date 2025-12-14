# ExamSprint 📚⏱️

**ExamSprint** 是一个开源的个人备考管理系统，帮助你管理任务、追踪目标、量化学习时间。

[English](#english) | [中文](#中文)

---

## 中文

### ✨ 特性

- 🎯 **倒计时系统** - 考试倒计时 + 里程碑追踪
- ✅ **任务管理** - 创建、编辑、完成任务，支持优先级和标签
- 🍅 **番茄钟** - 25分钟专注 + 5分钟休息，自动记录
- 📊 **目标追踪** - 可视化目标进度
- 📈 **数据统计** - 每日/每周复盘
- 🌙 **主题切换** - 浅色/深色/跟随系统
- 🌐 **双语支持** - 中文 & English

### 🛠️ 技术栈

- **框架**: Nuxt 4 + Vue 3
- **状态管理**: Pinia
- **UI 组件**: Nuxt UI v4 (基于 Radix Vue)
- **样式**: Tailwind CSS v4
- **图表**: ApexCharts
- **图标**: Lucide Icons (via Nuxt Icon)
- **国际化**: @nuxtjs/i18n
- **存储**: LocalStorage

### 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/LouisLau-art/exam-sprint.git
cd exam-sprint

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

访问 http://localhost:3000 查看应用。

### 📁 项目结构

```
exam-sprint/
├── app/
│   ├── components/     # Vue 组件
│   │   ├── countdown/  # 倒计时相关组件
│   │   ├── dashboard/  # 仪表盘组件
│   │   ├── goals/      # 目标管理组件
│   │   ├── layout/     # 布局组件
│   │   ├── pomodoro/   # 番茄钟组件
│   │   ├── tasks/      # 任务管理组件
│   │   └── ui/         # 通用 UI 组件
│   ├── pages/          # 页面路由
│   ├── stores/         # Pinia stores
│   ├── layouts/        # 布局模板
│   └── assets/         # 静态资源
├── i18n/               # 国际化文件
│   └── locales/        # 语言包 (zh-CN, en-US)
├── public/             # 公共资源
└── nuxt.config.ts      # Nuxt 配置
```

### 📸 截图

> TODO: 添加应用截图

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 📄 许可证

MIT License

---

## English

### ✨ Features

- 🎯 **Countdown System** - Exam countdown + milestone tracking
- ✅ **Task Management** - Create, edit, complete tasks with priority and tags
- 🍅 **Pomodoro Timer** - 25min focus + 5min break, auto-recording
- 📊 **Goal Tracking** - Visual goal progress
- 📈 **Statistics** - Daily/weekly review
- 🌙 **Theme Switch** - Light/Dark/System
- 🌐 **Bilingual** - 中文 & English

### 🛠️ Tech Stack

- **Framework**: Nuxt 4 + Vue 3
- **State Management**: Pinia
- **UI Components**: Nuxt UI v4 (based on Radix Vue)
- **Styling**: Tailwind CSS v4
- **Charts**: ApexCharts
- **Icons**: Lucide Icons (via Nuxt Icon)
- **i18n**: @nuxtjs/i18n
- **Storage**: LocalStorage

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/LouisLau-art/exam-sprint.git
cd exam-sprint

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit http://localhost:3000 to see the app.

### 📄 License

MIT License
