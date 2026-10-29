---
layout: post
title: "Investigating USB CDC Packet Loss"
date: 2026-10-22
domain: engineering
categories: [engineering]
projx: [usb-cdc-testbench]
activity: [debug-spot, restrictions]
tags: [usb, cdc, debugging]
description: "用可复现条件、临时缓解和根因证据组织一次丢包调查。"
---

这是一篇测试文章

如果连续发送时观察到数据缺口，第一步是确认缺口出现在哪一段链路，而不是立即修改驱动。本文整理调试现场应保留的证据；尚未把某个具体案例的根因写成既定事实。

## 复现条件

记录主机程序、固件版本、发送速率、单包长度和运行时长。给每段数据编号，可以区分重复、乱序与缺失。只有稳定复现，后续修复才有可靠的比较基线。

## 分层观察

分别检查应用发送队列、设备端缓冲和主机接收记录。暂时减小发送速率若能缓解问题，只说明系统对负载敏感，不能单独证明根因。

## 状态与后续

调试记录应把“已观察到”“当前假设”和“已验证修复”分开。临时方案可以先恢复可用性，但长期方案应在同一复现条件下重新测试，并保存结果。
