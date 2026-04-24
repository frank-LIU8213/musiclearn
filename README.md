# 和弦织网 (Chord Weaver)

一个交互式的和弦学习与创作工具，帮助音乐初学者直观理解和弦的构成、过渡和变化。

## 功能特性

- **虚拟钢琴键盘**：可视化显示和弦在键盘上的位置，支持点击弹奏
- **五线谱同步**：实时显示当前和弦的音符在五线谱上的位置
- **和弦进行模板**：内置 6 种经典和弦进行模板（流行、爵士、布鲁斯等）
- **和弦替换器**：点击任意位置，探索和弦的近亲变体并实时试听
- **声部流动动画**：可视化展示和弦之间每个音的移动路径
- **符号解码器**：悬浮在和弦符号上，查看中文名称、构成音和情绪色彩

## 技术栈

- React 19 + TypeScript
- Tailwind CSS
- Tone.js（音频合成）
- VexFlow（五线谱渲染）
- Vitest（测试）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test:run

# 构建生产版本
npm run build
```

## 部署

本项目配置为部署到 Vercel：

```bash
vercel --prod
```

## 项目结构

```
src/
  components/    # React 组件
  hooks/         # 自定义 Hooks
  lib/           # 核心逻辑（乐理引擎、音频引擎）
  types/         # TypeScript 类型定义
  data/          # 静态数据（模板、和弦库）
tests/           # 测试文件
```

## 许可证

MIT
