---
layout: post
title: "Hardware Constraints Behind USB CDC Throughput"
date: 2026-10-24
domain: engineering
categories: [engineering]
projx: [usb-cdc-testbench]
activity: [restrictions]
tags: [usb, cdc, throughput]
description: "在优化 USB CDC 吞吐前，先列出主机、设备和缓冲链路的约束。"
---

这是一篇测试文章

USB CDC 的吞吐表现不是单一函数决定的。主机发送方式、设备端缓冲、任务调度和应用处理都可能改变观测结果。讨论上限前，应先画出从发送端到消费端的完整链路。

## 约束清单

记录设备型号、端点配置、缓冲区大小、发送批量和主机测试程序。数据是否被应用及时取走，也必须与传输本身分开观察。

## 测量边界

吞吐测试至少需要说明统计时间、有效载荷大小和丢包判定方式。只报告平均速率，无法解释突发写入时是否发生队列积压。

## 设计判断

获得链路数据后，再决定优先调整缓冲、调度或应用处理。本文是约束分析框架，具体瓶颈与数值有待测试板记录补充。
