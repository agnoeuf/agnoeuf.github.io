# Agnoeuf Wiki 编辑与贡献指南

欢迎参与 Agnoeuf Wiki 的编写！本指南将帮助你了解如何编辑文档、预览更改以及通过 GitHub CI/CD 发布更新。

## 🛠️ 准备工作

在开始之前，请确保你的电脑上安装了以下工具：

1.  **Git**: 用于版本控制。
2.  **Node.js** (版本 18+): 运行环境。
3.  **pnpm**: 本项目使用 pnpm 管理依赖。
    ```bash
    npm install -g pnpm
    ```
4.  **VS Code** (推荐): 配合 `Markdown All in One` 和 `Vite` 插件体验最佳。

_（注：理论上你可以通过Github 网页端提供的在线编辑器进行编辑，适用于单文件的情形）_

## 🚀 快速开始

1.  **克隆仓库**

    ```bash
    git clone https://github.com/agnoeuf/agnoeuf.github.io.git
    cd agnoeuf.github.io
    ```

2.  **安装依赖**

    ```bash
    pnpm install
    ```

3.  **启动本地预览**
    ```bash
    pnpm docs:dev
    ```
    启动后，访问终端显示的地址 (通常是 `http://localhost:5173`) 即可实时预览修改。

## 📂 项目结构

```text
.
├── blog/                   # 博客文章目录
├── servers/                # 各个服务器的文档
│   ├── creative/          # 创造服文档
│   ├── hub/               # 大厅文档
│   └── survival/          # 生存服文档
├── src/                    # Vue 组件 (如有)
├── .github/workflows/      # CI/CD 配置文件
├── package.json
└── index.md                # 首页
```

## ✍️ 编写文档

本项目基于 [VitePress](https://vitepress.dev/)。

### 1. Markdown 基础

支持所有标准的 Markdown 语法（标题、列表、链接、图片等）。

### 2. VitePress 特有语法

**提示块 (Admonitions)**
用于突出显示信息：

```markdown
::: info
这是一个信息提示。
:::

::: tip
这是一个小贴士。
:::

::: warning
注意：这是一条警告。
:::

::: danger
危险！请小心操作。
:::
```

**图片**
建议将图片放在对应文档同级的 `images` 文件夹中，或统一放在 `public/images` 中（取决于项目配置）。

### 3. Frontmatter

每个 Markdown 文件的开头可以包含元数据配置：

```yaml
---
title: 页面标题
editLink: true
---
```

## 🔄 提交与部署 (CI/CD)

本项目使用 **GitHub Actions** 自动部署到 GitHub Pages。你不需要手动构建。

### 工作流程

1.  **提交更改**
    完成编辑后，提交你的代码：

    ```bash
    git add .
    git commit -m "docs: 更新生存服规则"
    git push
    ```

2.  **自动构建**
    - 推送到 `main` (或 `master`) 分支后，GitHub Actions 会自动触发名为 `gh-pages` 的工作流。
    - 它会执行 `vitepress build` 并将生成的静态文件部署为 `Github Pages页面` 。

3.  **查看结果**
    - 等待几分钟，访问 GitHub Pages 地址（通常是 `https://wiki.agnoeuf.yumemita.moe/`）查看更新。
    - 你可以在 GitHub 仓库的 "Actions" 标签页查看构建进度。

## ⚠️ 注意事项

- **链接检查**: 提交前请检查内部链接是否正确。
- **不要提交构建产物**: 不要手动提交 `.vitepress/dist` 目录下的文件（通常这些文件已被.gitignore忽略）。
- **侧边栏**: 如果添加了新文件，可能需要更新 `.vitepress/config.mts` (或 `.js/.ts`) 中的侧边栏配置以使其显示在导航中。

---

感谢你的贡献！
