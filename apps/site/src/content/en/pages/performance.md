---
contentSchemaVersion: 1
title: "Performance"
description: "Benchmark results, bundle budgets, and interaction metrics for Solidiom primitives."
keywords: [performance, benchmark, bundle, metrics, throughput]
locale: en
maturity: beta
---

# Performance

Solidiom primitives are designed for minimal overhead and maximum interactivity. This page tracks benchmark results across three dimensions: throughput, bundle size, and real-world interaction metrics.

## Benchmark Methodology

Throughput benchmarks measure operations per second for core primitive operations using `mitata`. Bundle sizes are measured as gzip-compressed output for each package. Interaction metrics are collected via Playwright end-to-end tests.

## Bundle Budgets

Each package has a gzip bundle size budget enforced in CI. Packages exceeding their budget fail the build.

## Interaction Metrics

Playwright-based tests measure Time to First Byte (TTFB), First Input Delay (FID), and Long Tasks for representative component interactions.
