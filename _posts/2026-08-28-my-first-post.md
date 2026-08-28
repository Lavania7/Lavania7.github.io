---
layout: post
title: "第一次理解 MOSFET"
date: 2026-08-28 18:00:00 +0800
categories: electronics
tags:
  - MOSFET
  - electronics
  - power
---

# 第一次理解 MOSFET

以前我把 MOSFET 理解成一个简单的电子开关。

但真正开始分析寄生参数之后，我发现：

> MOSFET 并不是一个理想开关。

它至少包含：

- Rds(on)
- Cgs
- Cgd
- Cds
- body diode
- parasitic inductance

这些东西最终都会影响开关速度、EMI、振铃和功耗。

## 结论

真正的工程设计不是选择一个“理想 MOSFET”，而是在实际约束下选择一个合适的器件。