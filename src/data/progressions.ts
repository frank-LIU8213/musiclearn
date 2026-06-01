import type { ProgressionTemplate } from '../types';

export const DEFAULT_TEMPLATES: ProgressionTemplate[] = [
  {
    id: 'pop-1564',
    name: '1-5-6-4 流行进行',
    moods: ['明亮', '流行'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['I', 'V', 'vi', 'IV'],
    defaultBpm: 120,
    explanation:
      '流行音乐的"万能公式"，构建了过去30年无数金曲的骨架。\n\n【乐理原流】\n基于主(Tonic) - 属(Dominant) - 关系小调(Submediant) - 下属(Subdominant) 的功能循环。\n- I 级（主）建立稳定感，给予听众"家"的感觉。\n- 紧接 V 级（属）带来强烈的不稳定与离心力，制造半终止的悬念。\n- 本该解决回 I，却走向了 vi 级（阻碍终止式），营造极具反差的忧伤失落感。\n- 最后以 IV 级（下属）作为缓冲平滑过渡，为回到主和弦铺平道路。\n\n【听觉心理】\n起承转合完美闭环。它不断给人期望又延迟满足，制造了一种"永不停歇"的循环推动力。',
    exampleSongs: ["Let It Be - The Beatles", "Someone Like You - Adele", "I'm Yours - Jason Mraz"],
  },
  {
    id: 'canon-15634125',
    name: 'Pachelbel 卡农进行',
    moods: ['优雅', '古典', '神圣'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'ii', 'V'],
    defaultBpm: 76,
    explanation:
      '源自帕海贝尔的《D大调卡农》，是音乐史上最伟大的循环范式之一。\n\n【乐理原流】\n采用了典型的"下行五度"扩展逻辑。\n- 前半段 I - V - vi - iii 形成一个不断下沉的低音线条（C-B-A-G），这种平滑的阶梯式下行能带给人极度的安稳感。\n- 后半段通过 IV - I 回归稳态，随后衔接 ii - V 形成一个标准的"二五终止"，为重新回到开头制造了极其顺滑的导向力。\n\n【听觉心理】\n具备一种肃穆、神圣且充满数学美感的平衡。相比 1-5-6-4，它多出的 ii 级和弦让结束段落听起来更加精致和有专业感。',
    exampleSongs: ['Canon in D - Pachelbel', 'Memories - Maroon 5', '下雨天 - 南拳妈妈'],
  },
  {
    id: 'royal-4536',
    name: '4-5-3-6 王道进行',
    moods: ['动漫', '热血', '情感'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['IV', 'V', 'iii', 'vi'],
    defaultBpm: 130,
    explanation:
      'ACG与日系流行乐(J-Pop)的统治性进行，被称为"王道进行"。\n\n【乐理原流】\n这是一组充满强烈驱动力的"功能性替代"组合。\n- 从 IV 级开启，拒绝了 I 级的温和感，直接寻求向外的推力。\n- V 级与接下来的 iii 级构成了一种"不完全解决"，iii 级作为 I 级的代理，让色彩瞬间变暗。\n- 最终解决到 vi 级，形成一种"虽然回到了主功能的代理，但情绪却困在小调"的幽结感。\n\n【听觉心理】\n热血、充满希望却又带着一丝少年宫式的忧伤。它极度适合快节奏、高密度的旋律，是追求"张力最大化"的首选。',
    exampleSongs: ['红莲の弓矢 - Linked Horizon', 'Lemon - 米津玄师', '打上花火'],
  },
  {
    id: 'jazz-251',
    name: '2-5-1 爵士终止',
    moods: ['经典', '爵士'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['ii', 'V', 'I'],
    defaultBpm: 100,
    explanation:
      '爵士乐的灵魂核心，被认为是西方调性音乐中最具解决感的进行式。\n\n【乐理原流】\n这是标准的"下属 -> 属 -> 主"功能进行的最强变体。\n- ii 级作为"前属和弦"(Pre-dominant)，根音到 V 是纯四度上行，拥有极强的运动感。\n- V 级（尤指属七和弦）包含了三全音，极度刺耳与不稳定。\n- I 级主和弦完美释放了所有的张力。\n\n【听觉心理】\n仿佛是一次起跑、冲刺到冲线的完美过程。五度下行（二到五，五到一）的根音运动最符合人耳的自然听感规律，带来极强的确定性。',
    exampleSongs: ['Autumn Leaves', 'All the Things You Are', 'Fly Me to the Moon'],
  },
  {
    id: 'spanish-6543',
    name: '6-5-4-3 弗拉门戈',
    moods: ['异域', '热情', '神秘'],
    key: 'E3',
    scaleType: 'major',
    numerals: ['vi', 'V', 'IV', 'III'],
    defaultBpm: 110,
    explanation:
      '著名的"安达卢西亚终止"(Andalusian Cadence)，充满西班牙式的野性与神秘感。\n\n【乐理原流】\n- 这本质上是一个在自然小调下的纯阶梯式下行：i - bVII - bVI - V。\n- 核心在于最后的 III 级大三和弦（它是小调中的属和弦），通过一个调外的变音制造出极强的半音导向感。\n\n【听觉心理】\n带有强烈的异域色彩和不可抗拒的宿命感。它让听众感受到一种"不断下坠但又拒绝落地"的奇妙张力。',
    exampleSongs: ['Sultans of Swing - Dire Straits', 'Smooth - Santana', 'Hit the Road Jack'],
  },
  {
    id: 'pop-456',
    name: '4-5-6 感性进行',
    moods: ['伤感', '释怀', '辽阔'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['IV', 'V', 'vi'],
    defaultBpm: 92,
    explanation:
      '现代抒情流行乐中最常用的副歌/段落装饰进行。\n\n【乐理原流】\n- 抛弃了 I 级的稳定回归，追求永无止境的向上攀爬感。\n- IV 到 V 的一步之遥积累了势能，但最后并未解决到 I，而是跌入 vi 级的怀抱（假终止）。\n\n【听觉心理】\n"还没爱够就结束了"的遗憾感。它非常适合用来铺垫副歌，制造一种开阔、深情且略带无奈的氛围。',
    exampleSongs: ['后来 - 刘若英', '勇气 - 梁静茹', '告白气球'],
  },
  {
    id: 'modern-6415',
    name: '6-4-1-5 现代流行',
    moods: ['动感', '现代'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['vi', 'IV', 'I', 'V'],
    defaultBpm: 128,
    explanation:
      '21世纪最为泛滥且洗脑的流行进行，可看作 1-5-6-4 的"情绪反转"版本。\n\n【乐理原流】\n从小调开始的循环：\n- vi 级（关系小主和弦）带来悲凉或深沉的开局。\n- IV 级向上提振情绪，增加光泽。\n- I 级大调主和弦确认了隐藏在背后的积极内核。\n- V 级将这种力量再次带入高潮，并迫使其不得不回转到 vi 级。\n\n【听觉心理】\n"在悲伤中跳舞"的史诗感。它让人在忧郁中感受到力量爆发，常见于电音EDM、摇滚和充满能量的现代舞曲。',
    exampleSongs: ['Closer - The Chainsmokers', 'Complicated - Avril Lavigne', 'Numb - Linkin Park'],
  },
  {
    id: 'oldie-1645',
    name: '1-6-4-5 老歌',
    moods: ['怀旧', '抒情'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['I', 'vi', 'IV', 'V'],
    defaultBpm: 90,
    explanation:
      '俗称"50年代大进行"（50s Progression）或"Doo-Wop 进行"，代表了一个时代的浪漫记忆。\n\n【乐理原流】\n- I 到 vi 是一次典型的平滑替换（共享两个共同音），带来了"甜蜜过渡到忧虑"的色彩变化。\n- IV 级继续深化柔情，并作为强力的前属和弦。\n- V 级完成经典的属-主回归期待。\n\n【听觉心理】\n非常温柔与怀旧。它赋予了它一种"摇篮曲"般的缓慢摇摆感，是无数美式抒情金曲的标配。',
    exampleSongs: ['Stand By Me - Ben E. King', 'Unchained Melody', 'Every Breath You Take - The Police'],
  },
  {
    id: 'blues-145',
    name: '1-4-5 布鲁斯',
    moods: ['蓝调', '摇滚'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['I', 'IV', 'V'],
    defaultBpm: 100,
    explanation:
      '西方现代流行乐鼻祖，12小节布鲁斯(12-Bar Blues)的极简浓缩骨架。\n\n【乐理原流】\n仅使用调内最重要的三个正三和弦，构建主(T)-下属(S)-属(D) 最基础的关系。\n- I 级确定调性基调。\n- IV 级打破平静，向外扩张（色彩稍偏暗）。\n- V 级推向最高潮，制造必须回归 I 级的强烈势能。\n\n【听觉心理】\n这三个和弦组合粗犷而极具张力，常配合属七和弦或者蓝调音阶，带来"粗糙、律动、极具侵略性"的根源音乐感。',
    exampleSongs: ['Johnny B. Goode - Chuck Berry', 'Twist and Shout - The Beatles', 'La Bamba'],
  },
  {
    id: 'jazz-3625',
    name: '3-6-2-5 爵士进阶',
    moods: ['优雅', '爵士'],
    key: 'C4',
    scaleType: 'major',
    numerals: ['iii', 'vi', 'ii', 'V'],
    defaultBpm: 110,
    explanation:
      '五度圈在调内和弦上的完美接力，爵士乐中最常用的转折与连接桥段模式。\n\n【乐理原流】\n- 每一个和弦的根音都在做完全的"五度下行"运动（3->6->2->5）。\n- 这是一条最符合声学物理排布的运动轨迹。iii 级作为 I 级的替身出场，增添了更多的小调色彩与模糊感。\n\n【听觉心理】\n听感极其丝滑流动，如同音乐在自然下坡滚动一般顺理成章。极具智力感和优雅成熟的氛围。',
    exampleSongs: ['I Got Rhythm (bridge)', 'Cherokee', 'Giant Steps (前两小节)'],
  },
];
