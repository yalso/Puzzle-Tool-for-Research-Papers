export type LangKey = 'en' | 'zh'
export type TranslationRecord = Record<LangKey, string>
export type Translations = Record<string, TranslationRecord>

export const translations: Translations = {
  'site.title': {
    en: 'Scientific Paper Collage Tool',
    zh: '科研论文拼图工具',
  },
  
  mainTitle: { en: 'Scientific Paper Collage Tool', zh: '科研论文拼图工具' },
  subTitle:  { en: 'Intelligent layout, precise control, professional typesetting of figures.', zh: '智能布局、精准控制，专业排版您的实验图' },
  panelTitle3: { en: '3. Edit Content', zh: '3. 编辑内容' },
  saveError:  { en: 'Failed to save. Storage may be full.', zh: '保存失败，存储空间可能已满。' },

  // 1. 布局
  'layout.title':   { en: '1. Layout', zh: '1. 布局设置' },
  'layout.columns': { en: 'Columns', zh: '列数' },
  'layout.rows':    { en: 'Rows', zh: '行数' },
  'layout.generate':{ en: 'Generate Grid', zh: '生成网格' },
  'layout.clear':   { en: 'Clear Images', zh: '清空图片' },

  // 2. 样式
  'style.title':      { en: '2. Style & Safety', zh: '2. 样式与安全' },
  'style.pageMargin': { en: 'Page Margin (px)', zh: '页边距 (px)' },
  'style.columnGap':  { en: 'Column Gap (px)', zh: '列间距 (px)' },
  'style.rowGap':     { en: 'Row Gap (px)', zh: '行间距 (px)' },
  'style.footerGap':  { en: 'Caption Gap (px)', zh: '脚注间距 (px)' },
  'style.fontSize':   { en: 'Caption Font (px)', zh: '脚注字号 (px)' },
  'style.bgColor':    { en: 'Background Color', zh: '背景颜色' },
  'style.watermark':  { en: 'Watermark (empty = none)', zh: '水印文字 (留空则无)' },
  'style.showBorder': { en: 'Show image border (auto-hidden on export)', zh: '显示图片边框（导出时自动隐藏）' },

  // 4. 导出
  'export.title':     { en: '4. Export', zh: '4. 导出文件' },
  'export.filename':  { en: 'Enter file name…(default: collage)', zh: '输入文件名…(默认：collage)' },
  'export.download':  { en: 'Download', zh: '下载文件' },
  'export.generating':{ en: 'Generating file, please wait...', zh: '正在生成文件，请稍候...' },

  // 5. 历史
  'history.title':    { en: '5. History', zh: '5. 历史记录' },
  'history.namePH':   { en: 'Custom name (optional, e.g., S3-Layout A/with scale)', zh: '自定义名称（可选，例如：S3-排版A/带刻度）' },
  'history.save':     { en: 'Save current layout', zh: '保存当前排版' },
  'history.empty':    { en: 'No records', zh: '暂无记录' },
  'common.load':      { en: 'Load', zh: '加载' },
  'common.delete':    { en: 'Delete', zh: '删除' },

  // 画布/脚注/图片格
  'canvas.noGrid': { en: 'Set rows/columns above and click “Generate Grid”.', zh: '请在上方设置行列数并点击“生成网格”。' },
  'footer.placeholder': { en: 'Caption for column {i}', zh: '第 {i} 列脚注' },
  'cell.uploadPrompt': { en: 'Click to upload/replace', zh: '点击上传/替换' },

  // 工具层
  'layer.add.left':   { en: 'Add column on the left', zh: '从左侧增加一列' },
  'layer.add.right':  { en: 'Add column on the right', zh: '从右侧增加一列' },
  'layer.add.up':     { en: 'Add row above', zh: '从上方增加一行' },
  'layer.add.down':   { en: 'Add row below', zh: '从下方增加一行' },
  'layer.delete.col': { en: 'Delete this column', zh: '删除该列' },
  'layer.delete.row': { en: 'Delete this row', zh: '删除该行' },
  'layer.drag.row':   { en: 'Drag to swap rows', zh: '拖动交换行' },
  'layer.drag.col':   { en: 'Drag to swap columns', zh: '拖动交换列' },
  
    // 工具栏（主题 & 语言切换）
  'toolbar.theme.toLight':   { en: 'Switch to light', zh: '切换到亮色' },
  'toolbar.theme.toDark':    { en: 'Switch to dark',  zh: '切换到暗色' },
  'toolbar.theme.lightShort':{ en: 'Light',           zh: '亮' },
  'toolbar.theme.darkShort': { en: 'Dark',            zh: '暗' },

};

export default translations
