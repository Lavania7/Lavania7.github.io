---
layout: post
title: "Measuring the Cost of Interrupt-Driven Processing"
date: 2026-10-25
domain: engineering
categories: [engineering]
projx: [Stellaris]
activity: [optimization]
tags: [embedded, interrupts, measurement]
description: "把中断入口、处理逻辑和调度影响分开测量，避免混淆优化目标。"
---

这是一篇测试文章

讨论中断开销时，先要明确“成本”指什么：一次处理的执行时间、主循环被打断的时间，还是连续事件下的最大延迟。不同指标可能导向不同优化。

## 建立基线

先记录空处理函数的行为，再逐步加入数据搬运和计算逻辑。每一步保持输入频率和编译配置一致，才能看出增加的代码造成了什么变化。

## 关注尾部情况

平均时间不足以描述实时风险。还要记录最长处理时间、事件堆积和任务完成时间的变化，并说明测量工具可能引入的误差。

## 形成决策

若瓶颈来自处理逻辑，可以尝试缩短中断内工作；若来自事件频率，应重新评估批处理或硬件外设的使用。本文不预设哪种方案更快，结论留给同一环境下的对照实验。
