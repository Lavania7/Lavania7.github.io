---
layout: post
title: "Control Frequency, Computation Time and Stability"
date: 2026-10-23
domain: engineering
categories: [engineering]
projx: [Stellaris]
activity: [restrictions, architecture]
tags: [control, real-time, embedded]
description: "把控制周期、计算时间和稳定性要求放进同一份设计约束。"
---

这是一篇测试文章

提高控制频率通常意味着更短的任务周期，但控制计算、采样和输出更新仍要在周期内完成。频率选择因此既是控制问题，也是执行平台的调度问题。

## 时间预算

先列出采样、状态估计、控制计算和输出的最坏执行时间，再考虑中断和其他任务可能造成的延迟。平均执行时间低于周期，并不意味着每次更新都能准时完成。

## 模型预算

控制律的离散实现需要和选定周期一起评估。采样变慢、输出延迟或数值误差都可能改变设计假设；不能只凭处理器还留有空闲时间，就认定频率合适。

## 验证顺序

先用明确的周期和延迟假设做仿真，再到目标硬件上记录执行时间与抖动。若两者不一致，应回到模型或实现，而不是单独调高频率。
