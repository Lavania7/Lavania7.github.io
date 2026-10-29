---
layout: post
title: "STM32 Timer: HAL vs Direct Register Access"
date: 2026-10-26
domain: engineering
categories: [engineering]
projx: [Stellaris]
activity: [optimization, restrictions]
tags: [stm32, timer, performance]
description: "先定义性能指标，再评估 HAL 与直接寄存器访问的差异。"
---

这是一篇测试文章

直接写定时器寄存器看起来更接近硬件，但是否构成优化，取决于被修改的代码是否处在需要优化的执行路径上。若配置只在启动时运行一次，它可能几乎不影响稳态采样性能。

## 先定义比较对象

把初始化时间、周期内 CPU 占用、触发抖动和代码体积分开记录。两种实现应使用相同的时钟、定时器模式和测量方法，否则数字之间没有可比性。

## 再分析约束

寄存器方案需要明确芯片型号、时钟树与可移植性要求。HAL 方案需要确认实际调用路径，而不是把库的全部开销都算进热路径。性能差异以测量结果为准。

## 结论如何写

在获得数据之前，这篇文章只提出实验设计。完成实验后，应同时写出收益、误差范围，以及维护复杂度的变化；没有可测量收益也应如实记录。
