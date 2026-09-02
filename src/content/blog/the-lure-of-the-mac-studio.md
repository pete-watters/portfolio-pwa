---
title: "The Lure of the Mac Studio"
description: "Why 512 GB of unified memory won't make local models fast, and what my measurements said to fix instead."
pubDate: 2026-09-02
tags: ["local-models", "ai", "benchmarking"]
---

The Mac Studio configurator goes up to 512 GB of unified memory. If you run local models, you've priced one. The pitch writes itself: a frontier-class open model on your desk, no API bill, no source code leaving the machine.

I run local models daily on smaller machines, and the more I measured, the less I wanted the Studio. The reason comes down to two numbers that get treated as one.

## Two numbers, two jobs

RAM decides whether a model runs. The weights sit resident in memory the whole time the model is loaded — a 27B at a good 4-bit quantisation costs about 19 GB, a 9B at 8-bit about 10 GB, plus a KV cache that grows with context. Unified memory is why Macs are attractive at all: the GPU addresses the whole pool, so "does it fit" is the only question RAM answers.

Bandwidth decides how fast it runs. To generate each token, the chip streams essentially all the active weights through the GPU. Tokens per second is memory bandwidth divided by model bytes. A bigger memory ceiling changes nothing about that division.

## The decode maths

| Machine | Bandwidth | Model | Ceiling |
| --- | --- | --- | --- |
| M4 Pro Mac mini | 273 GB/s | 27B (~19 GB) | ~14 tok/s |
| M3 Ultra Studio | 819 GB/s | 27B (~19 GB) | ~40 tok/s |
| M3 Ultra Studio | 819 GB/s | ~200 GB model | ~4 tok/s |

Capacity scales far faster than bandwidth. The Ultra has three times the mini's bandwidth, not ten. Load the 200 GB model the configurator tempted you with and your ceiling is four tokens a second. The model fits. Then it crawls.

The demos that beat this maths are mixture-of-experts models, where only the active experts stream per token. That softens the division for a handful of models. It doesn't repeal it for dense ones.

## Prefill is the other half

Generation is bandwidth-bound. Reading your prompt — prefill — is compute-bound, and it's where agentic work spends its time. My local jobs are prompt-heavy: inject the house rules and an exemplar, get back a commit message or a short review. Big prompt, small output.

Ultra chips carry a lot of bandwidth and modest compute next to a datacenter GPU, so a long prompt into a huge dense model takes minutes before the first token appears. Apple's newer laptop chips run the other way: the M5 generation multiplies prefill throughput while bandwidth barely moves. For prompt-heavy work that's the right trade, and it comes in machines with a fraction of the Studio's memory.

## What actually fixed quality

The Studio's real pitch is quality — a bigger model must review code better. The quality problems I actually had were never parameter-count problems.

The convention failures came from quantisation format. `Q4_K_M` — the default on every Ollama tag you pull by name — was the culprit in both size classes. I scored each build on whether five runs of the same real task came back free of convention violations:

| Model | Quantisation | Clean runs | Resident |
| --- | --- | --- | --- |
| 27B | `Q4_K_M` (default) | 1 / 5 | 19.29 GB |
| 27B | `nvfp4` | 5 / 5 | 19.18 GB |
| 9B | `Q4_K_M` (default) | 2 / 5 | 7.22 GB |
| 9B | `q8_0` | 5 / 5 | 10 GB |

The 27B at `nvfp4` is clean and 0.11 GB smaller than the same weights at the default. That's not a trade-off. The default was worse.

The failure mode is why nobody notices. Quantisation error doesn't break the code — it drops one constraint out of seven, so the model writes the type guard correctly and then adds an `as unknown as` cast anyway. Invisible to pass/fail benchmarks, expensive in review.

Size did matter for one class of work: enumeration. Asked to find planted violations in a diff, the 27B named 4.2 of 7 per run over five seeds; the 9B managed 2.2, and got worse when I added an example, because it treated the exemplar as a template and reported only the violation types it had been shown. Review earns the biggest model that fits. Nothing earned a bigger machine.

## The same trap at every price

The Studio isn't the only box sold on its capacity number, and the maths sorts them all into corners. An RTX 4090 has nearly four times the mini's bandwidth and 24 GB of VRAM — a 27B at 4-bit fits until the KV cache grows, then layers spill to system RAM over PCIe and decode drops from fifty tokens a second to single digits. The card wasn't slow. The model stopped fitting.

The Strix Halo mini-PCs run the other way: 128 GB of unified memory on quad-channel LPDDR5X at 256 GB/s — less bandwidth than the Mac mini they undercut on price.

| Box | Memory | Bandwidth | Dense 70B (~40 GB) |
| --- | --- | --- | --- |
| RTX 4090 | 24 GB | 1008 GB/s | doesn't fit |
| Strix Halo, 128 GB | ~100 GB usable | 256 GB/s | ~6 tok/s |
| M3 Ultra Studio | up to 512 GB | 819 GB/s | ~20 tok/s |

One corner has the bandwidth without the capacity, one has the capacity without the bandwidth and the third charges for both. Sparse mixture-of-experts models are the exception again — a 120B MoE streaming 5 GB of active experts per token runs fine at 256 GB/s. For dense models the division holds everywhere.

## When the Studio makes sense

Buy it for bandwidth, knowingly. Three times the mini's bandwidth takes the 27B from 14 tokens a second to 40, and that's real. A dense 70B resident around the clock, serving several machines, is a workload an Ultra genuinely fits.

The 512 GB number is the lure, and it's capacity for models you'd wait on at four tokens a second. RAM gets a model running. Bandwidth decides whether you'll use it.
