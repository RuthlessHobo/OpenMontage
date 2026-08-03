# Web reference: anthem.co.za

Assessment of [anthem.co.za](https://www.anthem.co.za/) captured 2026-08-03, turned into
a reusable prompt for building sites in the same idiom.

| File | What it is |
|---|---|
| [`ANTHEM_STYLE_WEBSITE_PROMPT.md`](ANTHEM_STYLE_WEBSITE_PROMPT.md) | **Start here.** Copy-paste prompt for an AI design/build tool: fill-in brief, master spec, and variation levers for making it *not* a clone. |
| [`anthem-teardown.md`](anthem-teardown.md) | Technical evidence: exact design tokens, the chamfer clip-path, the full GSAP/Lenis/Barba motion catalogue with real code, layout patterns, and a build critique. |
| [`reference-build/`](reference-build/) | A working single-file site built from the prompt alone, for a different brand in a different sector — proof the spec transposes. Open `index.html`; no build step. |

**One-line summary of the style:** cream canvas, one geometric sans in three weights with
section headlines set in Light, 0.65rem gutters so everything reads full-bleed, cut-corner
(chamfered) media, a single custom easing curve reused across every animation, and one loud
accent colour used only at full-panel scale.

Raw source (142KB Webflow CSS, 62KB custom JS, page HTML) is deliberately **not** committed —
it's third-party proprietary code. The teardown quotes the parts that matter and §7 documents
how to re-pull it.
