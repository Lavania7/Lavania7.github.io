---
layout: post
title: "Why We Built Metis Around Four Functions"
date: 2026-10-28
domain: engineering
categories: [engineering]
projx: [metis]
activity: [architecture]
tags: [embedded, interfaces, metis]
description: "以 init、rx、tx、cal 四类职责为线索，整理 Metis 接口的设计问题。"
---

这是一篇测试文章

Metis 的四函数接口可以从职责边界来理解：`init` 建立运行条件，`rx` 接收输入，`tx` 输出结果，`cal` 承载计算。这个划分是讨论架构的起点；具体调用顺序和模块约束仍需以项目实现为准。

## 为什么按职责划分

当采集、计算和发送写在同一条流程里，测试时很难单独替换某一环节。把职责拆开后，可以分别讨论输入从哪里来、计算何时执行、输出由谁负责。接口数量少，也让新模块需要回答的问题更明确。

## 仍需确认的边界

四个名称本身不能保证架构清晰。还需要确定 `init` 是否允许重复调用，`rx` 与 `tx` 是同步还是异步，`cal` 是否可以修改输入，以及错误怎样向上层传播。这些约束应写成契约，并用实际模块验证。

## 下一步

选取一个现有模块，画出四个函数的数据流与生命周期，再检查是否有职责无法自然归入其中。若出现例外，应记录原因，而不是为了保持接口整齐而隐藏复杂度。
