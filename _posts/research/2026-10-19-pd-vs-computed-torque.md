---
layout: post
title: "Comparing PD and Computed Torque Control"
date: 2026-10-19
domain: research
categories: [research]
subject: [nonlinear-control, computed-torque-control, 2dof-manipulator]
activity: [experiment, exploration]
tags: [robotics, control, simulation]
description: "为 PD 与计算力矩控制设计公平的二维机械臂对照实验。"
---

这是一篇测试文章

比较两种控制方法，不能只展示各自最好看的一条轨迹。参考路径、初始状态、采样周期和执行器限制应保持一致，才能把差异归因于控制方法及其参数。

## 对照条件

先确定模型参数与参数误差范围，再给两种控制器相同的任务。调参规则要预先说明，避免一种方法得到更多调试机会。

## 记录指标

除跟踪误差外，还可以记录控制输入幅度、能量使用和计算时间。若控制输入超过执行器限制，应按相同规则处理，并单独报告饱和发生的次数。

## 解释结果

实验应覆盖标称模型和有偏差的模型。若某种方法在一个条件下表现更好，结论应限定在该条件内。本文是实验方案，尚无可报告的对照测量结果。
