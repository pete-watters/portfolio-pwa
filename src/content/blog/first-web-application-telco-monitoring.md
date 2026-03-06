---
title: "My First Real Web Application: Building a Telco Monitoring Tool in 2012"
description: "Before React, before frameworks, before crypto — I built an internal monitoring tool at The Now Factory using Java, jQuery, HighCharts, and the Google Visualisation API."
pubDate: 2012-06-01
tags: ["code"]
draft: false
---

Before I was building Bitcoin wallets and trading automation tools, I was an Operations Engineer at The Now Factory in Sandyford, Dublin. The company made deep packet inspection probes — hardware that sat on mobile network operator infrastructure, analysing traffic patterns for telecoms companies worldwide.

Around 2012, I built TNFMON DRE: an internal web application for monitoring the performance of these probes deployed at customer sites across the globe. It was a J2EE web application that I designed, built, and documented entirely on my own. I even wrote a 30-page user guide for it, which I recently dug out.

Reading it back now is equal parts nostalgia and cringe. But it also reminds me that the instincts that drive my work today — building tools that replace manual processes, obsessing over data visualisation, making complex information accessible — were already there from the very beginning.

## The Problem

The Now Factory had SourceWorks probes deployed at telecoms operators (OPCOs) around the world. When engineers needed to analyse a probe's performance, the process was painful: they'd have to run a DCV (essentially a diagnostic report) on-site, which was time-consuming and required physical or remote access to the customer's infrastructure. When there was a critical issue, there just wasn't time for this.

Performance data and inventory information were being collected from these probes, but there was no centralised way to view, analyse, or trend. Engineers were manually pulling data into Excel spreadsheets and building reports by hand.

## What I Built

TNFMON DRE (the "DCV Replacement Engine") was a web application with three main modules:

**Statistical Analysis Tool** — The core of the application. Engineers could select a customer site and a date range, and the system would generate interactive performance charts showing NIC speeds, packet drop rates, TDR production, GTP context lifecycle, protocol ratios, and IP fragmentation. All the metrics that mattered for understanding whether a probe was healthy or struggling.

**Customer Inventory** — A centralised view of every probe's configuration: software versions, hardware specs, NIC card details, configuration file backups, scripts and health check outputs. Before this, there was no single place at headquarters where you could look up what was running at a customer site.

**Customer Matrix** — A global view across all customers, with searchable tables, dashboards, geographic coverage maps, revenue-by-customer charts and a motion chart for trending data over time. This was aimed at giving management and sales a bird's-eye view of the entire deployment footprint.

## The Tech Stack (Vintage 2012)

This was before the framework wars. Before React, before Angular even. The stack was:

- **Java Servlets and JSP** for the backend logic and dynamic page generation
- **jQuery and jQuery UI** for all frontend interactivity — accordions, tabs, dialogs, AJAX data loading
- **HighCharts** for all the performance charts — interactive, zoomable, exportable, with up to five Y-axes on a single chart
- **Google Visualisation API** for the inventory tables, the customer dashboard, the geographic map, and a motion chart for trending
- **HTML5 and CSS3** — I was pushing for modern standards at a time when IE still didn't support the canvas tag (HighCharts fell back to VML for IE)
- **JSON** for data interchange between the server and the UI — the charts were driven by JSON strings generated on the server and parsed by JavaScript on the client

No npm. No bundler. No package.json. Just JavaScript files referenced in HTML pages. And it worked.

## The Parts I'm Still Proud Of

**The charting.** Each chart was interactive with legend toggling, tooltips, zoom-by-drag, adjustable date ranges, print functionality and image export. The "All in one" view plotted every metric on a single chart with multiple axes, and engineers could toggle individual series on and off to isolate what they cared about. There was also a one-click export that rendered all charts to a single image — replacing what had been a manual, hour-long report-building process.

I wrote a custom HighCharts configuration specifically for this project. The key insight was that once you had a JSON data series for any metric, you could plot it on any chart against any other metric. That extensibility meant new charts could be added without touching the data layer. Compare that to Excel, where engineers were limited to two axes and had to rebuild the workbook every time.

**The search and filtering.** The customer matrix used a jQuery DataTables plugin that let users filter across all fields with a keyword search. Type "H2" and you'd see every site running an H2 probe. Type a country name and you'd get all sites in that region. It sounds basic now, but in 2012, in an enterprise environment where the alternative was scrolling through spreadsheets, this was transformative.

**The Google Visualisation API integration.** The motion chart for customer trends was genuinely ahead of its time — it let users animate data over time, switch between bubble, line, and bar views, and use logarithmic or linear scales. The geographic coverage map showed where probes were deployed worldwide, giving sales a visual tool they'd never had before.

**Server-side validation with AJAX feedback.** Rather than letting users submit a form and wait for a full page reload to discover there was no data, the application checked server-side first and returned an AJAX response. Only valid host/date combinations with actual data would proceed to chart generation. Small thing, but it made the tool feel responsive rather than frustrating.

## What I'd Do Differently Now

Everything about the architecture. Java Servlets and JSP were the right tool in 2012 for someone working in a Java shop, but the entire frontend would be a React SPA today with an API backend. jQuery UI's accordion/tabs pattern is essentially what component composition gives you in any modern framework.

The biggest thing I'd change is the lack of automated testing. The user guide includes a disclaimer that the application hadn't been through system test and likely had bugs. Today, I'd have unit tests, integration tests, and E2E coverage before writing any user documentation. My obsession with testing at every subsequent role — Cypress at Kraken, Cucumber at BAML, Vitest and Playwright at Trust Machines — probably has roots in shipping this project without a safety net.

The data architecture was sound, though. Collecting everything into a central database and making charts a presentation layer over that data is essentially the same pattern I'd use today — just with a REST API and a frontend charting library like Recharts or D3 instead of HighCharts rendered from JSP-generated JSON.

## Why This Project Matters

I was 26 or 27 when I built this. I wasn't a frontend engineer yet — my title was Operations Engineer, and most of my day-to-day was supporting the probes themselves. I built TNFMON because I saw a problem (manual, slow diagnostics) and thought I could fix it with software.

That impulse hasn't changed. At Kraken, I built Coderunner because institutional traders needed automation tools. At Trust Machines, I shipped a mobile wallet because Bitcoin users needed a better experience on their phones. The scale and the technology are completely different, but the pattern is the same: find the painful manual process, build the tool that replaces it, make the data accessible to the people who need it.

Looking back at the user guide from 2012, with its jQuery plugins and its Java Servlets and its disclaimer about untested code, I can see the through-line to everything I've done since. The frameworks change. The instinct to build doesn't.
