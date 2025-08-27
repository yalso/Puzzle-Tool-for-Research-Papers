# Puzzle Tool for Papers (Astro + Vue 3)

> A lightweight, fast figure‑collage editor for academic papers — built with **Astro**, **Vue 3**, and **Tailwind CSS**. Supports stable row/column insert/delete and drag‑swap, bilingual UI, local history, and high‑quality PNG/PDF export.

## 📸 Screenshots

![](https://img.qlqqs.com/b/2025/08/27/68aec482a97df.png)


---

## ✨ Highlights

* **Grid-first editing experience**: generate a rows × columns grid; each cell can hold one image.
* **Fine-grained layout controls**: page margins, column/row gaps, caption gap, caption font size, background color, watermark; optional image borders (auto-hidden on export).
* **Row/column operations with position stability**

  * Drag-swap rows/columns via **hover button**;
  * **Delete** a specified row/column (including its images); captions stay aligned;
  * **Insert** a row/column (above/below or left/right) as **blank** cells;
  * All operations keep other images’ **relative positions unchanged**.
* **Caption naming**: *Column {i} caption*.
* **Image intake**: click a cell to **upload / replace**.
* **Light/Dark theme** toggle; hover handles auto-hide on export/scroll.
* **History**: save & load with **custom names** (images persisted via localStorage + IndexedDB).
* **Export**: high-quality **PNG/PDF** via `html2canvas` + `jsPDF`, with custom filename.
* **i18n**: Chinese/English toggle with no extra libraries.
* **Astro-powered**: SSG by default; interactivity via Vue islands for fast loading and great performance.


## 📦 Tech Stack

- Astro 5 + @astrojs/vue
- Vue 3 (`<script setup>`)
- Tailwind CSS
- html2canvas ・ jsPDF

Links:
- https://astro.build/
- https://docs.astro.build/en/guides/integrations-guide/vue/
- https://vuejs.org/
- https://tailwindcss.com/
- https://github.com/niklasvh/html2canvas
- https://github.com/parallax/jsPDF

## 🚀 Quick Start

**Requirement**: Node.js **18+**

```bash
pnpm install        # 或：npm install / yarn install
pnpm dev run            # 或：npm run dev / yarn dev
```

Open <http://localhost:4321>.

## 🧭 How to Use

1) **Layout** – Set Columns/Rows, click **Generate Grid**. **Clear Images**, empties images without changing the grid.  
2) **Style & Safety** – Tune page margin, gaps (column/row/caption), caption font, background; optional image borders (hidden on export).  
3) **Edit Content** – Click a cell to upload/replace an image. Captions Setting.  
4) **Grid Editing** – Hover near a row/column to reveal button: drag‑swap, delete, insert (above/below, left/right) as empty cells; other images remain fixed relatively.  
5) **History** – Save with a custom name; load/delete entries.  
6) **Export** – Enter filename, export PNG/PDF.

## 🧩 Structure (Brief)

```
src/
├─ pages/
│  └─ index.astro            # Astro entry, mounts the tool
├─ components/collage/
│  ├─ CollageTool.vue        # Top‑level state & panels; tiny i18n t()
│  ├─ CollageCanvas.vue      # Grid render; passes props & t to cells/captions
│  ├─ ImageCell.vue          # Per‑cell upload/paste/preview
│  ├─ FooterCaptions.vue     # Per‑column captions; (i)=>t('footer.placeholder',{i})
│  ├─ LayoutSettingsCard.vue # Columns/Rows + Generate/Clear
│  ├─ StyleSettingsCard.vue  # Page/Gap/Font/Color/Watermark/Border
│  ├─ HistoryPanel.vue       # Save/Load/Delete named layouts
│  ├─ ExportPanel.vue        # Filename & export (PNG/PDF)
│  ├─ DragSwapLayer.vue      # Drag‑swap handles
│  ├─ DeleteLayer.vue        # Delete handles
│  ├─ AddLayer.vue           # Insert handles
│  └─ ToolbarTop.vue         # Theme & language toggles
```


---

# 论文拼图工具（Astro + Vue 3）

> 一个轻量、快速的学术图片拼图编辑器，基于 **Astro**、**Vue 3** 和 **Tailwind CSS** 构建。支持行/列稳定的增删与拖拽交换，支持中英切换与本地历史记录保存，提供 PNG / PDF 高质量导出。

---

## ✨ 亮点

* **网格优先的编辑体验**：生成「行 × 列」网格，每个单元格可放一张图片。
* **精细布局控制**：页边距、列/行间距、脚注间距、脚注字号、背景色、水印文字；图片边框可选（导出时自动隐藏）。
* **行/列操作并保持位置稳定**
  * 悬浮按钮 **拖拽交换** 行/列； 
  * **删除** 指定行/列（包含其中图片），脚注保持对齐；
  * **插入** 行/列（上/下或左/右），插入为空白单元；
  * 所有操作都保证其他图片 **相对位置不变**。
* **脚注命名**第 {i} 列脚注。 
* **图片导入**：点击单元格可上传  / 替换。
* **亮/暗主题** 切换；在导出或滚动时悬浮句柄自动隐藏。
* **历史记录**：支持自定义名称保存与加载（localStorage + IndexedDB 持久化图片）。
* **导出**：基于 `html2canvas` + `jsPDF` 的高质量 **PNG/PDF**，可自定义文件名。
* **i18n**：无需额外库的中英切换。
* **Astro 驱动**：默认 SSG，交互由 Vue 提供，加载快、性能好。

## 📦 技术栈

- Astro 5 + @astrojs/vue
- Vue 3（`<script setup>`）
- Tailwind CSS
- html2canvas ・ jsPDF

链接：
- https://astro.build/
- https://docs.astro.build/en/guides/integrations-guide/vue/
- https://vuejs.org/
- https://tailwindcss.com/
- https://github.com/niklasvh/html2canvas
- https://github.com/parallax/jsPDF

## 🚀 快速开始

**环境要求**：Node.js **18+**

```bash
pnpm install        # 或：npm install / yarn install
pnpm dev run            # 或：npm run dev / yarn dev
```

打开：<http://localhost:4321>

## 🧭 使用方法

1）**布局** —— 设置列数/行数，点击 **生成网格**。**清空图片** 清空图片但保留网格。  
2）**样式与安全** —— 调整页边距、列/行/脚注间距、脚注字号、背景色；可选图片边框（导出隐藏）；  
3）**内容编辑** —— 点击单元格上传/替换图片；脚注设置。  
4）**网格编辑** —— 悬停行/列显示按钮：拖拽交换、删除、插入（上/下/左/右），其他图片相对位置保持不变。  
5）**历史记录** —— 以自定义名称保存当前排版；加载/删除条目。  
6）**导出** —— 输入文件名导出 PNG/PDF。

## 🧩 目录结构（简）

```
src/
├─ pages/
│  └─ index.astro            # Astro 入口
├─ components/collage/
│  ├─ CollageTool.vue        # 顶层状态与面板；轻量 i18n t()
│  ├─ CollageCanvas.vue      # 网格渲染；向单元与脚注传递 props 与 t
│  ├─ ImageCell.vue          # 单元格上传/粘贴/预览
│  ├─ FooterCaptions.vue     # 脚注；(i)=>t('footer.placeholder',{i})
│  ├─ LayoutSettingsCard.vue # 生成/清空网格
│  ├─ StyleSettingsCard.vue  # 页/间距/字体/颜色/边框
│  ├─ HistoryPanel.vue       # 保存/加载/删除拼图
│  ├─ ExportPanel.vue        # 拼图导出（PNG/PDF）
│  ├─ DragSwapLayer.vue      # 拖拽交换按钮
│  ├─ DeleteLayer.vue        # 删除按钮
│  ├─ AddLayer.vue           # 新增按钮
│  └─ ToolbarTop.vue         # 白/黑模式与语言切换
```

