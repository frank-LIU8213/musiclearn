
# Spec: 和弦织网 (Chord Weaver)

## Objective

构建一个纯前端的交互式和弦学习与创作工具，让音乐初学者通过可视化、可弹奏、可编辑的方式，理解和弦的构成、过渡逻辑和在音乐中的作用。

### 用户故事

- 作为想写歌的键盘初学者，我想要选择一个"忧伤"情绪的和弦进行模板，听到它的声音，然后试着把其中一个和弦替换成七和弦，从而找到我想要的色彩。
- 作为自学乐理的人，我想要看到 C 大调和弦过渡到 Am 时，每个音具体是怎么移动的，从而理解 voice leading 规则。
- 作为和弦新手，我想要悬浮在一个陌生符号（如 Cmaj7/F#dim）上时，立刻看到它在钢琴上的位置和构成音。

### 成功标准

1. 用户可以在虚拟钢琴上点击任意琴键，听到对应音高。
2. 选择内置模板后，钢琴键盘和五线谱实时同步显示当前和弦。
3. 和弦切换时，声部流动动画正确展示每个音的移动路径（保留/级进/跳进）。
4. 点击进行中的任意一级，可打开替换菜单并试听新和弦。
5. 悬浮和弦符号，弹出层显示构成音、名称含义和情绪色彩。
6. 在 MacBook Air (2020) 和 iPhone 13 上，音频延迟 < 50ms，动画帧率 > 30fps。
7. 构建产物可部署到 Vercel，无任何服务端依赖。
8. 核心乐理逻辑的单元测试覆盖率 >= 80%。

---

## Tech Stack

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 构建工具 | Vite | ^5.0 | 快速开发服务器和优化构建 |
| 框架 | React | ^18.2 | UI 框架 |
| 语言 | TypeScript | ^5.3 | 类型安全 |
| 样式 | Tailwind CSS | ^3.4 | 原子化 CSS，快速 UI 搭建 |
| 音频 | Tone.js | ^14.8 | Web Audio 封装，和弦合成与播放 |
| 乐谱 | VexFlow | ^4.2 | 五线谱渲染 |
| 动画 | Framer Motion | ^11.0 | UI 过渡动画 |
| 测试 | Vitest | ^1.0 | 单元/集成测试 |
| 测试 | React Testing Library | ^14.2 | 组件测试 |
| 测试 | jsdom | ^24.0 | 浏览器环境模拟 |
| 代码质量 | ESLint | ^8.56 | 代码检查 |
| 代码质量 | Prettier | ^3.2 | 代码格式化 |
| 类型检查 | TypeScript Compiler | ^5.3 | 编译期类型检查 |
| 部署 | Vercel | - | 静态站点托管 |

---

## Commands

```bash
# 安装依赖
npm install

# 开发服务器（本地 http://localhost:5173）
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 预览生产构建
npm run preview

# 运行所有测试（watch 模式）
npm run test

# 运行测试一次（CI 用）
npm run test:run

# 代码检查
npm run lint

# 代码自动修复
npm run lint:fix

# 代码格式化
npm run format

# 类型检查（不编译）
npm run typecheck
```

---

## Project Structure

```
musiclearn/
├── public/
│   └── soundfonts/              # 可选： Salamander 钢琴 SoundFont
├── src/
│   ├── components/              # React 组件（按功能域分组）
│   │   ├── piano/
│   │   │   ├── PianoKeyboard.tsx      # 虚拟钢琴键盘
│   │   │   ├── PianoKey.tsx           # 单个琴键
│   │   │   └── index.ts
│   │   ├── staff/
│   │   │   ├── StaffDisplay.tsx       # 五线谱容器
│   │   │   ├── ChordNotation.tsx      # 和弦符号显示
│   │   │   └── index.ts
│   │   ├── progression/
│   │   │   ├── ProgressionPlayer.tsx  # 和弦进行播放器
│   │   │   ├── ProgressionSlot.tsx    # 进行中的单个位置
│   │   │   ├── ChordReplacer.tsx      # 和弦替换菜单
│   │   │   └── index.ts
│   │   ├── animation/
│   │   │   ├── VoiceLeadingCanvas.tsx # 声部流动动画（Canvas）
│   │   │   └── index.ts
│   │   └── ui/                  # 通用 UI 组件
│   │       ├── Button.tsx
│   │       ├── Tooltip.tsx
│   │       ├── Slider.tsx
│   │       └── index.ts
│   ├── hooks/                   # 自定义 React Hooks
│   │   ├── useAudioContext.ts   # 音频上下文管理
│   │   ├── useChordPlayback.ts  # 和弦播放控制
│   │   └── useProgression.ts    # 和弦进行状态
│   ├── lib/                     # 核心逻辑（无 React 依赖，可独立测试）
│   │   ├── music-theory/        # 乐理计算引擎
│   │   │   ├── note.ts          # 音符定义与操作
│   │   │   ├── chord.ts         # 和弦定义、构建、识别
│   │   │   ├── scale.ts         # 音阶定义
│   │   │   ├── progression.ts   # 和弦进行规则
│   │   │   └── voice-leading.ts # 声部进行计算
│   │   ├── audio-engine/        # 音频引擎封装
│   │   │   ├── synth.ts         # Tone.js 合成器封装
│   │   │   └── player.ts        # 播放控制（和弦、进行）
│   │   └── animation/           # 动画工具
│   │       └── voice-leading-path.ts  # 声部路径计算
│   ├── types/                   # 全局 TypeScript 类型
│   │   └── index.ts
│   ├── data/                    # 静态数据
│   │   ├── progressions.ts      # 内置和弦进行模板
│   │   └── chord-variants.ts    # 和弦变体库
│   ├── App.tsx                  # 根组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式 + Tailwind 指令
├── tests/
│   ├── unit/                    # 单元测试
│   │   ├── music-theory/        # 乐理引擎测试
│   │   └── audio-engine/        # 音频引擎测试
│   └── integration/             # 集成测试
│       └── progression-flow.test.tsx
├── docs/
│   ├── ideas/
│   │   └── chord-learning-website.md
│   └── spec.md                  # 本文件
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── .prettierrc
├── package.json
└── README.md
```

---

## Code Style

### 基础规范

- **Prettier**：默认配置，行宽 100，单引号，末尾逗号 `es5`
- **ESLint**：`eslint:recommended` + `@typescript-eslint/recommended` + `react-hooks/recommended`
- **TypeScript**：`strict: true`，不允许隐式 `any`

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件 | PascalCase | `PianoKeyboard`, `ChordReplacer` |
| 函数/变量 | camelCase | `playChord`, `activeNotes` |
| 常量 | SCREAMING_SNAKE_CASE | `MIDDLE_C_MIDI = 60` |
| 类型/接口 | PascalCase | `ChordDef`, `NoteName` |
| 文件 | PascalCase（组件）/ camelCase（逻辑） | `PianoKeyboard.tsx`, `voice-leading.ts` |
| Hook | camelCase，前缀 `use` | `useAudioContext` |

### 代码示例

```typescript
// src/lib/music-theory/chord.ts

export interface ChordDef {
  symbol: string;
  root: NoteName;
  quality: ChordQuality;
  notes: NoteName[];      // 从根音开始的音程关系，如 ['C4', 'E4', 'G4']
  intervals: Interval[];  // 音程定义，如 ['P1', 'M3', 'P5']
}

/**
 * 根据根音和品质构建和弦定义
 */
export function buildChord(root: NoteName, quality: ChordQuality): ChordDef {
  const intervals = INTERVAL_MAP[quality];
  const notes = intervals.map((interval) => transposeNote(root, interval));

  return {
    symbol: `${root}${quality}`,
    root,
    quality,
    notes,
    intervals,
  };
}

/**
 * 获取给定和弦的所有"近亲"变体（用于替换菜单）
 */
export function getChordVariants(chord: ChordDef): ChordDef[] {
  const variants = VARIANT_MAP[chord.quality] ?? [];
  return variants.map((quality) => buildChord(chord.root, quality));
}
```

### 组件编写规范

```typescript
// src/components/piano/PianoKeyboard.tsx

import { memo, useCallback } from 'react';
import { PianoKey } from './PianoKey';
import type { NoteName } from '../../types';

interface PianoKeyboardProps {
  activeNotes: NoteName[];
  onKeyPress: (note: NoteName) => void;
  range?: [NoteName, NoteName];
}

export const PianoKeyboard = memo(function PianoKeyboard({
  activeNotes,
  onKeyPress,
  range = ['C3', 'B4'],
}: PianoKeyboardProps) {
  const keys = generateKeyRange(range);

  const handleKeyClick = useCallback(
    (note: NoteName) => {
      onKeyPress(note);
    },
    [onKeyPress]
  );

  return (
    <div className="flex relative select-none">
      {keys.map((key) => (
        <PianoKey
          key={key.note}
          note={key.note}
          isBlack={key.isBlack}
          isActive={activeNotes.includes(key.note)}
          onClick={handleKeyClick}
        />
      ))}
    </div>
  );
});
```

### 关键原则

1. **纯函数优先**：乐理计算（`lib/music-theory/`）必须是纯函数，不依赖 React、不依赖浏览器 API，100% 可测试。
2. **副作用隔离**：所有副作用（音频播放、Canvas 绘制、DOM 操作）集中在 hooks 和组件中，不侵入纯逻辑层。
3. **不可变数据**：状态更新使用不可变模式，复杂状态用 `useReducer` 而非多个 `useState`。
4. **类型安全**：函数返回值必须显式标注类型，不依赖类型推断传播到公共 API。
5. **单一职责**：每个文件只做一件事。组件负责渲染，hooks 负责状态/副作用，lib 负责纯逻辑。

---

## Testing Strategy

### 测试分层

| 层级 | 范围 | 工具 | 目标覆盖率 |
|------|------|------|-----------|
| 单元测试 | `lib/` 纯函数 | Vitest | >= 80% |
| 组件测试 | `components/` 渲染与交互 | Vitest + RTL + jsdom | >= 60% |
| 集成测试 | 用户端到端流程 | Vitest + RTL + jsdom | 关键路径覆盖 |

### 单元测试示例

```typescript
// tests/unit/music-theory/chord.test.ts
import { describe, it, expect } from 'vitest';
import { buildChord, getChordVariants } from '../../../src/lib/music-theory/chord';

describe('buildChord', () => {
  it('构建 C 大三和弦', () => {
    const chord = buildChord('C4', 'maj');
    expect(chord.notes).toEqual(['C4', 'E4', 'G4']);
    expect(chord.intervals).toEqual(['P1', 'M3', 'P5']);
  });

  it('构建 C 小七和弦', () => {
    const chord = buildChord('C4', 'm7');
    expect(chord.notes).toEqual(['C4', 'Eb4', 'G4', 'Bb4']);
  });
});

describe('getChordVariants', () => {
  it('Cmaj 的近亲变体包含 Cmaj7 和 C6', () => {
    const chord = buildChord('C4', 'maj');
    const variants = getChordVariants(chord);
    const symbols = variants.map((v) => v.quality);
    expect(symbols).toContain('maj7');
    expect(symbols).toContain('6');
  });
});
```

### 组件测试示例

```typescript
// tests/unit/components/PianoKeyboard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PianoKeyboard } from '../../../src/components/piano/PianoKeyboard';

describe('PianoKeyboard', () => {
  it('点击琴键触发 onKeyPress', () => {
    const handlePress = vi.fn();
    render(<PianoKeyboard activeNotes={[]} onKeyPress={handlePress} />);

    const c4Key = screen.getByTestId('key-C4');
    fireEvent.click(c4Key);

    expect(handlePress).toHaveBeenCalledWith('C4');
  });

  it('激活的琴键有高亮样式', () => {
    render(<PianoKeyboard activeNotes={['C4']} onKeyPress={vi.fn()} />);

    const c4Key = screen.getByTestId('key-C4');
    expect(c4Key).toHaveClass('bg-blue-400');
  });
});
```

### 集成测试示例

```typescript
// tests/integration/progression-flow.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/App';

describe('和弦进行完整流程', () => {
  it('选择模板 -> 播放 -> 替换和弦', async () => {
    render(<App />);

    // 选择一个模板
    fireEvent.click(screen.getByText('1-5-6-4 流行进行'));

    // 点击播放
    fireEvent.click(screen.getByLabelText('播放'));

    // 等待第一拍
    await waitFor(() => {
      expect(screen.getByTestId('active-chord-slot-0')).toHaveClass('active');
    });

    // 点击第二个位置进行替换
    fireEvent.click(screen.getByTestId('chord-slot-1'));

    // 选择一个变体
    fireEvent.click(screen.getByText('G7'));

    // 验证位置上的和弦已更新
    expect(screen.getByTestId('chord-slot-1')).toHaveTextContent('G7');
  });
});
```

---

## Boundaries

### Always（必须遵守）

- 提交前运行 `npm run lint` 和 `npm run typecheck`，确保零错误。
- 所有 `lib/` 目录下的纯函数必须配单元测试。
- 组件 props 必须有 TypeScript 接口定义。
- 音频播放必须在用户首次交互后才初始化（遵守浏览器自动播放策略）。
- `any` 类型必须使用 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 并附注释说明原因。

### Ask First（先问再动）

- 添加新的 npm 依赖（可能引入体积/许可证/维护问题）。
- 修改项目目录结构或文件命名约定。
- 修改 `vite.config.ts`、`tsconfig.json` 或构建配置。
- 引入全局状态管理库（当前用 React Context + useReducer 足够）。
- 修改已有的乐理数据模型（`ChordDef`、`NoteName` 等）。
- 添加需要后端支持的功能（如用户账户、云端保存）。

### Never（绝对禁止）

- 提交 API 密钥、环境变量或其他敏感信息到版本控制。
- 修改 `node_modules/` 或 vendor 目录内容。
- 直接跳过失败的测试（要么修复，要么标记 skip 并说明原因）。
- 在乐理计算函数中引入随机性或非确定性行为。
- 在组件渲染阶段执行副作用（如直接调用 `playChord`）。
- 使用 `console.log` 提交到主分支（开发调试除外）。

---

## Implementation Plan

### Phase A: 基础骨架（第 1-2 天）

**目标**：可运行的空壳项目，开发环境就绪。

1. **项目初始化**：Vite 模板 + 所有依赖安装 + 配置文件调整
2. **目录结构搭建**：按 Project Structure 创建所有目录和空文件
3. **类型系统定义**：`types/index.ts` —— 音符、和弦、进行等核心类型
4. **基础 UI 框架**：Tailwind 配置、全局样式、布局框架（侧边栏 + 主区域）
5. **验证**：`npm run dev` 正常运行，`npm run test` 零失败（空测试套件）

### Phase B: 核心引擎（第 3-4 天）

**目标**：乐理计算和音频播放可独立工作。

6. **乐理引擎 —— 音符与和弦**：`lib/music-theory/note.ts` + `chord.ts`，支持构建常见三和弦、七和弦
7. **乐理引擎 —— 音阶与进行**：`lib/music-theory/scale.ts` + `progression.ts`，支持从数字级数生成和弦
8. **音频引擎**：`lib/audio-engine/synth.ts` + `player.ts`，Tone.js 封装，支持单音、和弦、进行播放
9. **验证**：单元测试覆盖 note/chord/scale/progression，可独立运行音频播放

### Phase C: 核心可视化（第 5-7 天）

**目标**：用户能看见和听见和弦。

10. **虚拟钢琴键盘**：`PianoKeyboard` + `PianoKey`，支持点击高亮、黑白键布局
11. **五线谱组件**：`StaffDisplay` + `ChordNotation`，VexFlow 集成，与钢琴状态同步
12. **和弦进行播放器**：`ProgressionPlayer` + `ProgressionSlot`，模板选择、播放控制、速度调节
13. **验证**：选择一个模板后，钢琴和五线谱正确显示每个和弦，点击播放可听到完整进行

### Phase D: 交互增强（第 8-10 天）

**目标**：用户能修改、探索、理解和弦。

14. **和弦替换器**：`ChordReplacer`，点击进行位置弹出变体菜单，试听替换
15. **声部流动动画**：`VoiceLeadingCanvas`，Canvas 绘制两和弦间的声部移动路径
16. **符号解码器**：悬浮 Tooltip，显示和弦构成音、名称含义、情绪色彩
17. **验证**：集成测试覆盖"选择模板 → 播放 → 替换和弦"完整流程

### Phase E: 整合与发布（第 11-12 天）

**目标**：打磨体验，部署上线。

18. **UI 打磨**：响应式布局、深色模式支持、过渡动画、错误边界
19. **性能优化**：音频预加载、Canvas 帧率优化、代码分割
20. **构建与部署**：Vercel 配置、README 完善、构建产物验证
21. **最终验证**：在目标设备上手动测试，确认延迟和帧率达标

### 依赖关系图

```
Phase A (骨架)
    │
    ▼
Phase B (引擎) ──→ 乐理引擎 & 音频引擎可并行开发
    │
    ▼
Phase C (可视化) ──→ 钢琴 & 五线谱可并行；依赖 Phase B
    │
    ▼
Phase D (交互) ──→ 替换器 & 动画可并行；依赖 Phase C
    │
    ▼
Phase E (发布)
```

---

## Task Breakdown

### Phase A: 基础骨架

- [ ] **A1: 初始化项目**
  - Acceptance: `npm run dev` 启动成功，页面显示 Vite 默认欢迎页
  - Verify: 浏览器访问 `http://localhost:5173`，无报错
  - Files: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`

- [ ] **A2: 配置工具链**
  - Acceptance: ESLint + Prettier + Tailwind + Vitest 全部配置完毕，`npm run lint && npm run typecheck && npm run test:run` 全部通过
  - Verify: 运行上述三条命令，零错误
  - Files: `eslint.config.js`, `.prettierrc`, `tailwind.config.js`, `postcss.config.js`, `vitest.config.ts`

- [ ] **A3: 搭建目录结构**
  - Acceptance: 所有目录和空文件按 Project Structure 创建完毕
  - Verify: `find src -type f | wc -l` >= 20
  - Files: 所有 `src/` 和 `tests/` 目录下的空文件

- [ ] **A4: 定义核心类型**
  - Acceptance: `types/index.ts` 包含 `NoteName`, `ChordDef`, `ChordQuality`, `ProgressionTemplate`, `VoiceMovement` 等所有核心类型
  - Verify: `npm run typecheck` 通过；IDE 中可正确提示类型
  - Files: `src/types/index.ts`

- [ ] **A5: 基础布局框架**
  - Acceptance: 页面有顶部导航栏 + 左侧控制面板 + 中央主区域的基础布局
  - Verify: 浏览器中可见三栏布局，无样式错乱
  - Files: `src/App.tsx`, `src/index.css`, `src/components/ui/`

### Phase B: 核心引擎

- [ ] **B1: 音符操作库**
  - Acceptance: 支持音符的 MIDI 编号转换、音高加减、八度操作；所有函数有单元测试
  - Verify: `npm run test:run` 中 note 相关测试全部通过
  - Files: `src/lib/music-theory/note.ts`, `tests/unit/music-theory/note.test.ts`

- [ ] **B2: 和弦构建库**
  - Acceptance: 支持构建 maj, min, maj7, min7, dom7, dim, aug, sus4, 6 等至少 9 种品质的和弦
  - Verify: 单元测试覆盖每种品质的和弦音符构成
  - Files: `src/lib/music-theory/chord.ts`, `tests/unit/music-theory/chord.test.ts`

- [ ] **B3: 音阶与进行库**
  - Acceptance: 支持自然大调、自然小调；可从罗马数字级数生成和弦进行
  - Verify: C 大调 I-V-vi-IV 生成 C-G-Am-F
  - Files: `src/lib/music-theory/scale.ts`, `src/lib/music-theory/progression.ts`, 对应测试

- [ ] **B4: 音频合成引擎**
  - Acceptance: Tone.js 封装完成，支持触发单个音符、和弦（多音同时）、带延时的进行播放
  - Verify: 在浏览器控制台手动调用 `playChord(['C4','E4','G4'])` 能听到声音
  - Files: `src/lib/audio-engine/synth.ts`, `src/lib/audio-engine/player.ts`

- [ ] **B5: 音频 Hook 封装**
  - Acceptance: `useAudioContext` 和 `useChordPlayback` Hooks 可用，正确处理浏览器自动播放限制
  - Verify: 首次页面加载不初始化音频；点击任意按钮后初始化成功
  - Files: `src/hooks/useAudioContext.ts`, `src/hooks/useChordPlayback.ts`

### Phase C: 核心可视化

- [ ] **C1: 虚拟钢琴键盘**
  - Acceptance: 显示至少两个八度（C3-B4）的黑白键布局；点击琴键发出对应音高；激活和弦时高亮对应琴键
  - Verify: 手动点击 C4 听到 C4 音；传入 `activeNotes={['C4','E4','G4']}` 时三个键高亮
  - Files: `src/components/piano/PianoKeyboard.tsx`, `src/components/piano/PianoKey.tsx`

- [ ] **C2: 五线谱显示**
  - Acceptance: VexFlow 渲染当前和弦的音符到五线谱上；音符与钢琴键盘状态同步
  - Verify: 传入 C 大三和弦时，五线谱上正确显示 C/E/G 三个音符
  - Files: `src/components/staff/StaffDisplay.tsx`, `src/components/staff/ChordNotation.tsx`

- [ ] **C3: 和弦进行数据**
  - Acceptance: `data/progressions.ts` 包含至少 6 个模板，每个有名称、情绪标签、级数定义
  - Verify: 控制台 `console.log(progressions)` 可见完整数据
  - Files: `src/data/progressions.ts`, `src/data/chord-variants.ts`

- [ ] **C4: 和弦进行播放器**
  - Acceptance: 可选择模板、播放/暂停、调节 BPM、显示当前播放位置；播放时钢琴和五线谱同步更新
  - Verify: 选择 1-5-6-4 模板，点击播放，依次听到 C-G-Am-F，钢琴和五线谱同步高亮
  - Files: `src/components/progression/ProgressionPlayer.tsx`, `src/components/progression/ProgressionSlot.tsx`, `src/hooks/useProgression.ts`

### Phase D: 交互增强

- [ ] **D1: 和弦替换器**
  - Acceptance: 点击进行中的任意位置，弹出该和弦的可替换变体菜单；点击变体后实时替换并播放
  - Verify: 点击 C 和弦位置，选择 Cmaj7，进行变为 Cmaj7-G-Am-F，听到 Cmaj7 声音
  - Files: `src/components/progression/ChordReplacer.tsx`, `src/lib/music-theory/chord.ts` (getChordVariants)

- [ ] **D2: 声部流动动画**
  - Acceptance: 两个和弦切换时，Canvas 上绘制每个音的移动轨迹；保留音静止、级进音平滑滑动、跳进音弧线
  - Verify: C→Am 过渡时，E 音（共同音）保持不动，G→A 平滑上行，C→C 保持不动
  - Files: `src/components/animation/VoiceLeadingCanvas.tsx`, `src/lib/animation/voice-leading-path.ts`

- [ ] **D3: 符号解码器（Tooltip）**
  - Acceptance: 悬浮在任何和弦符号上，弹出层显示：构成音列表、中文名称、情绪色彩描述
  - Verify: 悬浮 Cmaj7，显示 "C大七和弦 | 构成: C E G B | 色彩: 梦幻、开放"
  - Files: `src/components/ui/Tooltip.tsx`, 各组件中集成

- [ ] **D4: 集成测试**
  - Acceptance: 覆盖"选择模板 → 播放 → 替换和弦 → 继续播放"的完整用户流程
  - Verify: `npm run test:run` 中集成测试通过
  - Files: `tests/integration/progression-flow.test.tsx`

### Phase E: 整合与发布

- [ ] **E1: 响应式与深色模式**
  - Acceptance: 在 375px 宽手机和 1440px 桌面显示器上均能正常使用；支持明暗主题切换
  - Verify: Chrome DevTools 设备模拟测试
  - Files: `src/App.tsx`, `src/index.css`, `tailwind.config.js`

- [ ] **E2: 性能优化**
  - Acceptance: 首屏加载 < 2s（4G 模拟）；播放时音频延迟 < 50ms；动画帧率 > 30fps
  - Verify: Lighthouse 性能评分 >= 80；Chrome Performance 面板测量
  - Files: `vite.config.ts` (代码分割), 各组件性能优化

- [ ] **E3: 构建与部署**
  - Acceptance: `npm run build` 生成无错误的静态产物；成功部署到 Vercel；访问线上地址功能正常
  - Verify: Vercel Dashboard 显示部署成功，线上手动测试核心功能
  - Files: `vercel.json`, `README.md`

---

## Open Questions

1. **MIDI 键盘输入**：是否需要支持用户连接真实 MIDI 键盘？（Web MIDI API 可行但增加复杂度，建议 MVP 不做）
2. **音频品质**：MVP 用 Tone.js 合成器，后续是否接入 Salamander SoundFont 提升钢琴音质？
3. **移动端交互**：钢琴键盘在手机上是否需要支持滑动/多点触控？还是仅支持点击？
4. **内容扩展**：模板库和和弦变体库目前 hardcode 在 `data/` 中，未来是否考虑让用户自定义/保存？
5. **国际化**：UI 文案目前全中文，是否考虑英文版本？

---

*Spec 版本: 1.0*
*生成日期: 2026-04-25*
*基于 idea-refine 产出: `docs/ideas/chord-learning-website.md`*
