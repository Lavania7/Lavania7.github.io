---
layout: post
title: "Lyapunov Analysis of a 2-DOF Manipulator"
date: 2026-10-20
domain: research
categories: [research]
subject: [nonlinear-control, lyapunov-stability, 2dof-manipulator]
activity: [modeling, derivation]
tags: [robotics, control, stability]
description: "整理二维机械臂稳定性分析所需的模型假设、误差定义和证明步骤。"
---

这是一篇测试文章

Lyapunov 分析的价值在于把“控制器看起来能工作”转成可检查的稳定性条件。对二维机械臂而言，证明之前必须先说明动力学模型、控制目标与允许的参数不确定性。

## 定义问题

明确关节位置与速度的参考轨迹，以及跟踪误差的定义。模型中哪些量可测、哪些量需要估计，都应在推导前列出；这些假设会影响后续结论的适用范围。

## 组织推导

先选择非负的候选函数，再沿闭环系统求其变化率。每一步都检查符号、矩阵维度和被省略的项。若只能得到局部条件，就应明确写出局部范围，而不是直接宣称全局稳定。

## 连接实验

仿真可以帮助发现建模或实现错误，但不能替代证明。完成推导后，使用相同的初始条件和参数记录误差曲线，再比较理论预期与数值结果。本文仍是分析提纲，完整公式需与实际模型一起补充。
