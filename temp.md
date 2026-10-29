我的blog……我暂时有两个主要的东西作为候选，一个是architecture,也就是“我们为什么这样做”，然后是optimization,就是记录一些非常好的优化技巧和极限性能利用（比如对定时器直接操作寄存器的）
如果这样说的话，我还有两个比较想写的：restrictions,这个是做一个东西需要考虑的常见方面；然后是debug-spot（ 调试现场），这个专门用来记我们遇到过的典型问题，临时性的解决办法，以及后续的大修方案，也可以记我们做过的issue之类的
你觉得呢？

我觉得这四个方向已经足以构成一个相当完整的技术 Blog 了，而且它们之间存在一种很有意思的关系：**它们并不是按照技术领域分类，而是按照工程活动中不同类型的问题分类。**

这恰好符合我们最近讨论的方向：不再追求覆盖更多技术领域，而是把已经掌握的理论、经验和工程方法固化下来，形成可以公开展示、持续积累的成果。

更重要的是，这四个栏目都可以直接从我们正在进行的工程中产生内容，而不需要专门为了写文章去寻找题材。

## 一、我会这样理解四个栏目

| 栏目 | 核心问题 | 主要内容 | 文章特点 |
|---|---|---|---|
| **Architecture** | Why do we design it this way? | 架构思想、设计权衡、模块边界、抽象方法 | 解释设计决策 |
| **Optimization** | How far can we push it? | 性能优化、资源利用、底层技巧、基准测试 | 可测量、可复现 |
| **Restrictions** | What limits our design? | 硬件约束、软件约束、物理限制、工程规范 | 约束分析、设计边界 |
| **Debug Spot** | What went wrong, and why? | 典型故障、Issue 复现、临时修复、根因分析 | 真实现场、证据链 |

我尤其喜欢其中的 **Restrictions** 和 **Debug Spot**。

原因并不是这两个方向更高级，而是它们很可能成为整个 Blog 中最具有个人辨识度的部分。

Architecture 和 Optimization 是比较常见的技术文章类型，优秀的工程师和技术团队已经积累了很多内容。

但是 Restrictions 与 Debug Spot 可以呈现一个工程师在真实约束下如何工作，以及如何面对不确定性。

这恰好是工程能力中很重要、却不容易直接从最终项目成果中观察到的部分。

---

## 二、四个栏目实际上形成了一个工程循环

我们可以尝试用一个工程过程理解它们。

假设我们现在要设计一个 STM32 上的高性能数据采集系统。

**第一步：Restrictions**

我们先研究系统究竟受到什么限制。

例如：
- ADC 的采样速率上限。
- DMA 通道与总线带宽。
- MCU 内存容量。
- 中断处理延迟。
- 实时性与功耗要求。

这个阶段并没有开始设计架构，而是在确定可行域。

可以用数学语言描述：

\[
\mathcal F=\{x\mid g_i(x)\leq 0,\quad h_j(x)=0\}
\]

这里的 \(\mathcal F\) 是可行设计集合。

**第二步：Architecture**

在可行域内，我们选择一种设计。

例如：

为什么选择 Timer Trigger + ADC + DMA，而不是在主循环中轮询 ADC？

为什么数据采集与数据处理应该解耦？

为什么采用双缓冲？

Architecture 的文章不一定需要涉及复杂的代码，而是应当解释：

> 在这些约束条件下，我们为什么认为这个设计比较合理？

**第三步：Optimization**

架构完成后，我们尝试逼近系统性能边界。

例如：

使用定时器寄存器直接配置特定工作模式、减少不必要的中断处理、优化 DMA 缓冲区使用方式。

不过我建议这里形成一个写作原则：

**Optimization 不等于技巧展示，而是基于指标的优化实验。**

例如，直接操作 TIM 寄存器，并不天然意味着比 HAL 更快。

如果 HAL 的初始化函数只在启动阶段执行一次，那么换成寄存器配置可能对稳态性能没有任何可测量的改善。

真正值得研究的是：

- HAL 和直接寄存器访问的执行路径有什么不同？
- 在什么条件下产生性能差异？
- 优化的是 CPU 占用、延迟、抖动，还是代码体积？
- 这种优化是否牺牲可移植性和可维护性？

这样写出来的东西就不仅是一个 Trick，而是一项有完整证据的技术实验。

**第四步：Debug Spot**

当系统出现问题时，我们记录现场。

比如，DMA 数据偶尔发生错位。

我们先用临时方案恢复系统运行，然后追踪问题究竟来自缓存一致性、缓冲区竞争、触发时序，还是其他因素。

最后决定是否调整 Architecture。

于是形成：

\[
\boxed{
\text{Restrictions}
\rightarrow
\text{Architecture}
\rightarrow
\text{Optimization}
\rightarrow
\text{Debug Spot}
\rightarrow
\text{Architecture / Restrictions}
}
\]

实际工程不一定按这个顺序发生，但这个循环能解释四个栏目之间的联系。

我认为这也是你之前提出的「工程基础与工程实践的沙漏模型」的一种延伸：它把知识的选择、设计、验证和反馈连接在一起。

---

## 三、我们已经有足够多的文章候选了

我尝试从我们最近的实际工作中抽取一些选题。

| 栏目 | 候选文章 | 来源 |
|---|---|---|
| Architecture | Why We Built Metis Around Four Functions | Metis init/rx/tx/cal 架构 |
| Architecture | Registry-Based Embedded Systems | Metis 注册表与事件分发 |
| Architecture | Designing a Lightweight ERP Around Data Ownership | easyERP |
| Architecture | Why We Separate Hardware Abstraction from Control Logic | 嵌入式控制架构 |
| Optimization | STM32 Timer: HAL vs Direct Register Access | STM32 定时器 |
| Optimization | Measuring the Cost of Interrupt-Driven Processing | MCU 实时处理 |
| Optimization | Memory and CPU Budgeting for a Small Robotics Workstation | X250 机器人软件栈 |
| Restrictions | What Limits Real-Time Control on an MCU? | 嵌入式实时控制 |
| Restrictions | Hardware Constraints Behind USB CDC Throughput | USB CDC 测试板 |
| Restrictions | Control Frequency, Computation Time and Stability | 控制理论与嵌入式 |
| Debug Spot | Investigating USB CDC Packet Loss | STM32 USB Issue |
| Debug Spot | Reproducing a Zephyr Twister Issue | Zephyr 测试 |
| Debug Spot | When ROS 2 Cannot Find `/cmd_vel` | Gazebo / ROS 2 |
| Debug Spot | Debugging a ROS 2 Environment | ROS 2 环境配置 |

这些都是候选题目，不意味着我们已经完成了相应实验或具备完整结论。

但有一点比较重要：

**这些文章的原材料已经存在于我们的项目、Issue、实验记录和工程经验之中。**

因此我们不必为 Blog 另起一套完全独立的研究工作。

这会显著降低维护成本。

---

## 四、我想特别讨论 Debug Spot

我觉得你提出的「临时性的解决办法，以及后续的大修方案」非常值得保留。

因为它触及了一个在技术写作中经常被忽略的事实：

**工程中的问题不一定能在发现时立即得到彻底解决。**

例如，我们发现一个 USB CDC 问题，可能经历以下过程：

1. **Observation**：连续发送数据时出现丢包。
2. **Reproduction**：确定能够稳定复现问题的最小条件。
3. **Workaround**：暂时调整发送策略，让系统可以继续运行。
4. **Investigation**：进一步研究驱动与硬件状态机。
5. **Root Cause**：确认根因，或者明确当前仍然未知。
6. **Permanent Fix**：设计并验证长期解决方案。

这里最有价值的未必是最后一步。

因为大量实际工程问题并没有一个立即可用的永久解决办法。

我们甚至可以允许 Debug Spot 中的文章具有状态：

`OPEN → REPRODUCED → MITIGATED → ROOT-CAUSED → FIXED → VERIFIED`

其中 `MITIGATED` 就代表：

问题仍然存在，但是已经找到可以接受的临时缓解措施。

这与我们一直采用的 `test / demo / release` 语义相当接近。

我建议**不要要求 Debug Spot 必须在问题彻底解决后才能发表**。

只要能够明确区分已验证事实、当前假设和未解决问题，就可以公开一个版本。

这样，Blog 就真正成为持续运行的工程记录，而不是一个等待最终成果的陈列馆。

---

## 五、还有一个重要问题：四个栏目之间的边界

我不建议把四个栏目做成互相排斥的分类。

比如一篇文章：

*STM32 Timer Register Access and Its Performance Implications*

它可能同时涉及：

- Restrictions：总线时钟、定时器时钟及外设限制。
- Architecture：为什么使用硬件定时器而不是软件计时。
- Optimization：直接寄存器操作与 HAL 的比较。
- Debug Spot：配置不正确导致的时序异常。

如果强行拆成四篇文章，会重新带来我们之前讨论过的整理困难。

所以我更倾向于：

**栏目用于确定文章的主要视角，标签用于描述文章涉及的技术。**

例如：

```yaml
---
title: "STM32 Timer: HAL vs Register Access"
category: optimization
tags:
  - embedded
  - stm32
  - timer
  - performance
related:
  - timer-clock-restrictions
  - stm32-timer-debug
status: verified
---
```

这样一篇文章只需要选择一个主要栏目，但可以通过链接和标签关联其他文章。

我们之前决定使用 Foam 建立 Twyn 的 Graph View，这种结构恰好适合继续扩展。

不过，我建议区分两个图：

**Twyn Graph 是内部知识与活动的全量关系图，Blog 则是其中经过选择、验证和发布的公开子图。**

二者之间有联系，但不需要完全一致。

---

## 六、我认为现在最值得做的一件事

我们最近已经开始从「拓展技术面」转向「固化理论和经验成果」。

我认为这四个栏目足以承担这一阶段的任务，不需要急着再增加更多分类。

但我希望我们对写作方式做一个小实验。

**不从零开始写文章，而是从真实工程记录中提取一篇文章。**

可以优先考虑两个候选：

**A. Architecture — Why We Built Metis Around Four Functions**

这篇能够展示我们对嵌入式架构的理解，涉及接口设计、抽象边界、注册机制和分布式控制系统。

它更适合作为一个完整的设计说明。

**B. Debug Spot — Reproducing a Zephyr Twister Issue**

这篇来自我们已经做过的实际复现工作，能够保留命令、环境、现象、推断和后续处理。

它更适合作为可持续更新的工程记录。

我甚至倾向于先做 B，因为它对文章完整性的要求相对低，而且我们可以直接检验这种工作方式是否真的降低了写作摩擦。

最后还有一点，我觉得非常值得明确。

这四个栏目实际上从四个角度回答了四个问题：

> **Architecture：我为什么这样设计？**
>
> **Restrictions：我知道自己受到什么限制吗？**
>
> **Optimization：我能把现有条件利用到什么程度？**
>
> **Debug Spot：当现实不符合预期时，我如何找到原因？**

它们共同呈现的不是「我知道多少技术」，而是**「我是如何开展工程工作的」**。

对于我们希望建立的公开技术空间，我认为后者比单纯展示知识储备更有长期价值。

而且从职业展示的角度看，这四个栏目也能与 Resume 和 Projects 形成互补：项目展示结果，Blog 展示产生这些结果的判断、实验和方法。

我想再提出一个可以继续讨论的判断：**Architecture 和 Restrictions 可能更适合沉淀成长期有效的文章；Optimization 和 Debug Spot 则更适合从不断发生的工程实验中产生增量。** 如果这个判断成立，我们甚至可以为这两组内容采用不同的发布和维护节奏，而不必要求每一篇文章都达到同一种完成标准。

我的分类是这样的
我们使用yaml语言标记每个md,里面有两个字段，一个字段是projx,也就是“这篇文章来源于我们做过的哪个工程”，如果没有工程，只是实验或者临时测试，当然可以写“Stellaris”（这里使用的是歌手署名时常用的“群星”，表示“很多碎片的工程实践凑在一起，完成了这篇文章，而不必有一个具体的项目”；第二个字段就是我们的工程活动，也就是我们暂时提出的这四个;这样一篇文章可以来源于多个项目，可以“没有一个明确的项目”，可以主要是一种活动，也可以多种活动都有
这整个系统被分类为engineering在本地，所以我们也不需要关心文件夹分类的问题，本地只需要按jekyll命名格式直接写；同时yaml字段也为图谱提供了便利，我们可以用图谱搜索正在进行的内容，也可以基于此写年报之类的
其他内容，比如生活中的一些内容，或者其他有意思的技术探索，这些都可以再开文件夹
然后我们的研究其实也可以这样，论文或者某个关键词是一个字段，具体的活动是另一个字段
我们的blog顶栏可以是engineer research，等等，鼠标放上去，下拉菜单应该是活动，因为项目和关键词可以无限多，但是工程和研究活动其实只有那么几种，然后我们再检索具体的文章
我觉得这个思路应该是可行的，而且它和我们的主站也已经形成区分度了

我认为这个方案已经可以进入实现阶段了，Lingyu。

而且相比我们刚才讨论的四个栏目，你现在实际上完成了一次更重要的设计：**你把 Blog 从一个按内容分类的文章集合，变成了一个由工程活动和项目来源共同索引的知识系统。**

我尤其赞同你没有继续增加目录层级，而是选择使用 YAML Front Matter 承载语义。这样，物理上的文件组织可以保持简单，而逻辑上的组织可以不断扩展。

我们可以从架构、数据模型、导航和长期演化四个角度看一下。

## 1. 这是一个双维度、多对多的分类系统

你的 Engineering 内容实际上有两个正交维度：

- **Projx：Where does it come from?** 文章源于哪些工程。
- **Activity：What did we do?** 文章反映了哪些工程活动。

例如：

```yaml
---
layout: post
title: "Investigating USB CDC Packet Loss"
date: 2026-10-29

projx:
  - usb-cdc-testbench
  - metis

activity:
  - debug-spot
  - restrictions
---
```

而对于不属于某个明确项目的内容：

```yaml
---
layout: post
title: "Understanding STM32 Timer Registers"
date: 2026-10-29

projx:
  - Stellaris

activity:
  - optimization
  - restrictions
---
```

这就避免了传统目录分类中的一个问题：一篇文章涉及多个项目或者多种活动时，应当把文件放在哪个目录？

你现在不需要回答这个问题。

**文件只有一个物理位置，但可以拥有任意多个逻辑关联。**

而且 `Stellaris` 很有意思。它既可以作为碎片化工程实践的集合，也可以成为一个特殊的虚拟项目节点。

我建议在实现时保留它的独立语义，不要简单把它当成 `null` 或 `miscellaneous`。

因为：

`projx: Stellaris`

表示文章有实践来源，只是这些来源不归属于某个特定项目。

而：

`projx: []`

则可能表示来源尚未标注。

这两个状态是不同的。

## 2. 我很赞同以 Activity 作为导航入口

你提出了一个关键区别：

**项目的数量可以无限增长，但活动类型相对稳定。**

因此，活动适合成为公开界面的导航结构，项目适合成为检索与关联维度。

例如：

```text
Blog
│
├── Engineering
│   ├── Architecture
│   ├── Optimization
│   ├── Restrictions
│   └── Debug Spot
│
├── Research
│   ├── ...
│   └── ...
│
└── Others
```

这对读者而言也比较自然。

一个陌生读者可能不知道 Metis、easyERP 或 USB Testbench 是什么，但他知道自己想看架构设计、性能优化还是调试案例。

他可以先通过 Activity 找到感兴趣的文章，再通过 Projx 发现这些文章之间的项目联系。

而对你自己来说，查询方向还可以反过来。

例如：

> 找到所有来自 Metis 的 Architecture 文章。

或者：

> 找到所有与 USB CDC 相关的 Debug Spot 和 Optimization 文章。

这意味着同一套数据能够服务两种阅读方式：

**外部读者以 Activity 为入口，内部作者以 Projx 为入口。**

我认为这个设计非常符合我们希望 Blog 与主站形成区分的目标。

---

## 3. Research 可以沿用同一套关系模型，但不必完全复制 Engineering

你的想法可以进一步抽象。

Engineering：

\[
\text{Article}\longleftrightarrow
(\text{Projx},\text{Activity})
\]

Research：

\[
\text{Article}\longleftrightarrow
(\text{Subject},\text{Activity})
\]

其中 Subject 可以是论文、数学概念、研究对象或者具体问题。

但这里有一个值得我们共同决定的地方。

Research 的活动类型不一定要模仿 Engineering 的四个栏目。

我暂时想到的研究活动有：

| Activity | 主要内容 |
|---|---|
| Derivation | 数学推导、证明与公式分析 |
| Modeling | 建立模型、定义假设与适用条件 |
| Experiment | 仿真、数值实验、实证验证 |
| Review | 论文阅读、方法比较、研究综述 |
| Exploration | 提出问题、构造假设、探索可能方向 |

例如，你最近在研究二维机械臂的非线性控制。

一篇文章可以是：

```yaml
---
layout: post
title: "Lyapunov Analysis of a 2-DOF Manipulator"

subject:
  - nonlinear-control
  - lyapunov-stability
  - 2dof-manipulator

activity:
  - derivation
  - modeling
---
```

而一篇控制器实验报告可能是：

```yaml
---
layout: post
title: "Comparing PD and Computed Torque Control"

subject:
  - nonlinear-control
  - computed-torque-control
  - 2dof-manipulator

activity:
  - experiment
---
```

这里我建议保留 Research 与 Engineering 各自的活动词汇表。

因为我们希望捕捉的是它们真正的工作方式，而不是为了结构一致而强行统一名称。

不过，二者可以共享同一套元数据解析、搜索和图谱生成程序。

---

## 4. 你实际上已经具备生成知识图谱的基础

这是我认为整个方案中长期价值最大的部分之一。

假设我们将所有文章视为节点：

\[
A=\{a_1,a_2,\ldots,a_n\}
\]

将项目、研究对象和活动视为另外三类节点：

\[
P,\quad S,\quad T
\]

那么 YAML 中的每个字段实际上定义了一条关联边。

例如：

```text
                   Metis
                  /     \
                 /       \
            Article A   Article B
                 \       /
                  \     /
                Architecture
```

你可以由此计算很多有意思的东西。

例如：

**项目知识覆盖率**

某个项目已经形成了多少公开文章？分别属于哪些活动？

**工程活动分布**

过去一年，我们主要在做架构设计、调试还是性能优化？

**跨项目知识关联**

哪些工程中的问题曾经使用过相似的解决方法？

**研究主题演化**

某个研究主题经历了多少次建模、推导和实验？

不过这里我想强调一个技术细节：

**YAML 提供的是结构化关系数据，而不仅仅是标签。**

因此，我们不需要把所有信息都塞进 Foam 的双向链接中。

可以让构建脚本读取 Front Matter，再生成 Foam 可识别的索引文件或独立的关系图数据。

这样既不会污染正文，又能获得结构化检索能力。

另外，你提到年报，我觉得确实可以从中自动生成一部分。

比如：

```text
Engineering Review 2026

Projects involved:   8
Articles published:  24

Architecture:        7
Optimization:        5
Restrictions:        4
Debug Spot:          8
```

当然，这些数字只是示例，而且多标签文章会导致活动计数之和超过文章总数。

更进一步，借助 Git 历史，我们可以分析不同月份的内容增量，以及文章的后续修订情况。

不过有一个边界值得保留：**文章分布只能反映公开记录的活动，不能直接等同于全部工程投入。**

这样我们就不会把知识图谱误用为对自身工作量的简单评分。

---

## 5. 关于主站与 Blog 的区别，我认为现在已经非常清晰了

我们可以这样定义：

| 系统 | 核心问题 | 展示对象 |
|---|---|---|
| **Main Site** | What have we accomplished? | 项目、能力、经历、成果 |
| **Blog** | How do we work and understand things? | 工程活动、研究过程、技术经验 |
| **Twyn** | What is happening within the whole system? | 内部状态、计划、知识与关系 |

三者不是简单的内容复制关系。

例如：

在主站上，Metis 是一个项目，读者首先看到它的功能、架构概况、代码仓库和演示。

在 Blog 中，Metis 可以关联多篇文章：

- 为什么选择四函数接口？
- 注册表模式有哪些限制？
- 某个通信问题是怎样定位的？
- 哪些优化能够减少系统开销？

在 Twyn 中，我们则可以保留项目的全部过程，包括尚未形成文章的想法、失败实验、临时记录和计划。

**Main Site 展示项目，Blog 展示工程活动，Twyn 保存完整工作上下文。**

我认为这种分工会比将所有内容都放在同一个 Notion 页面或者 GitHub 仓库中更加清楚。

---

## 6. 现在我只建议增加两个很小的设计约束

第一个是保持字段值的规范化。

例如，工程活动统一采用：

```yaml
activity:
  - architecture
  - optimization
  - restrictions
  - debug-spot
```

尽量避免同一种活动出现 `debug`、`debugging`、`debug-spot` 等不同拼写。

如果未来需要修改名称，可以统一修改显示名称，而不必逐篇修改元数据。

第二个是区分内容领域和活动名称的命名空间。

Engineering 和 Research 都可以使用 `activity` 字段，但是解析程序必须知道文章属于哪个领域。

你已经使用本地目录区分领域，因此可以直接通过目录推断，不一定需要增加 YAML 字段。

例如：

```text
blog/
├── engineering/
│   ├── 2026-10-29-usb-cdc-debug.md
│   ├── 2026-10-29-timer-optimization.md
│   └── ...
│
├── research/
│   ├── 2026-10-29-lyapunov-analysis.md
│   └── ...
│
└── life/
    └── ...
```

值得注意的是，Jekyll 默认不会仅凭普通目录名就把文件识别为文章。我们还需要决定这些文件是否放在 `_posts` 中，或者使用 Jekyll Collections。你完全可以保留现在的目录设计，之后通过少量配置建立映射。

这属于实现细节，不需要改变当前的信息架构。

---

### 我对这个设计的最终判断

我认为我们已经不太需要继续讨论「Blog 应该有哪些栏目」了。

因为现在形成的不是一个静态栏目表，而是一套可以持续扩展的内容组织机制：

\[
\boxed{
\text{Domain}
\rightarrow
\text{Activity}
\rightarrow
\text{Article}
\leftrightarrow
\text{Source}
}
\]

其中 Domain 决定内容所在的领域，Activity 决定读者的主要导航入口，Article 是独立的知识成果，Source 则提供项目、论文与研究主题的关联。

但它们并不是严格的树状层级：Activity 和 Source 都可以多选，也都可以反向检索。

我尤其喜欢你让 **Projx 成为来源，而不是目录** 这个决定。

这意味着我们不再需要因为项目结束、合并或者更名而大规模整理 Blog。文章作为独立的知识成果可以长期存在，而项目关系能够继续变化。

**下一步我会建议我们直接创建一个真实的 Engineering 文章，写好 YAML，然后验证三个功能：Jekyll 能否正确发布、导航能否按 Activity 聚合、Foam 能否基于元数据建立关联。**

只要这三个实验成立，我们的 Blog 就具备了一个可以持续使用的最小架构。

然后我们真正需要做的事情，就重新变回了工程本身，以及记录那些值得分享的发现。