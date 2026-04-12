"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type PromptSim = { type: "PromptSim"; prompt: string; response: string };
type TipsSim   = { type: "TipsSim";   tips: string[] };
type StepsSim  = { type: "StepsSim";  steps: string[] };
type CodeSim   = { type: "CodeSim";   code: string; label?: string };
type Sim = PromptSim | TipsSim | StepsSim | CodeSim;

interface Lesson {
  id: string;
  title: string;
  concept: string;
  tip: string;
  code: string;
  codeLabel: string;
  sim: Sim;
  quiz: { question: string; options: string[]; answer: number };
}

interface Module {
  id: string;
  icon: string;
  name: string;
  desc: string;
  lessons: Lesson[];
}

// ── Data ─────────────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  {
    id: "prompting",
    icon: "💬",
    name: "Prompting Basics",
    desc: "Write prompts that get precise, reliable finance outputs",
    lessons: [
      {
        id: "pb-1",
        title: "The Context Block",
        concept: "Claude performs dramatically better when you tell it who you are, what your company does, and what you need — before asking the question. This opening 'context block' is the single biggest lever for output quality. Without it, Claude guesses your situation and often gets it wrong.",
        tip: "Always lead with role, company size, industry, and currency. Three sentences of context saves five rounds of back-and-forth.",
        code: `# Bad prompt
"What's a good gross margin for my business?"

# Good prompt with context block
"""
I am the CFO of a UK-based SaaS company with £2M ARR and 15 employees.
We sell HR software to SMBs on annual contracts.
All figures are in GBP.

What is a healthy gross margin for a SaaS business at our stage,
and what are the main levers to improve it?
"""`,
        codeLabel: "Context block example",
        sim: {
          type: "PromptSim",
          prompt: "I am the CFO of a UK SaaS company, £2M ARR, 15 employees, HR software for SMBs, figures in GBP.\n\nWhat is a healthy gross margin at our stage and what are the main levers to improve it?",
          response: "For a UK SaaS business at £2M ARR, a healthy gross margin is typically 70–80%. At your stage, infrastructure costs and customer success headcount are the biggest drivers below that threshold.\n\nKey levers to improve it:\n1. Move from managed hosting to cloud-native (AWS/GCP) to cut server costs\n2. Automate onboarding to reduce CS hours per customer\n3. Shift support to a tiered model — self-serve for SMBs, managed for larger accounts\n4. Review payment processing fees — often 1–2% of revenue at your scale\n\nIf your gross margin is currently below 65%, the most likely culprit is customer success being classified above the gross profit line. Many SaaS CFOs reclassify onboarding costs to S&M to improve the reported margin."
        },
        quiz: { question: "What is the most important element to include at the start of a finance prompt?", options: ["The length of your question", "Your role, company size, and industry context", "The date of the data", "The output format"], answer: 1 },
      },
      {
        id: "pb-2",
        title: "Structured Output",
        concept: "By default Claude writes in prose. For finance work you usually want tables, numbered lists, or specific formats you can paste into a report. Explicitly telling Claude the format you want — and giving an example if needed — consistently produces cleaner, more usable output.",
        tip: "Ask for a markdown table, a numbered list, or 'format as a CFO board summary with bullet points'. Claude will match whatever structure you describe.",
        code: `# Ask for a specific format
"""
Analyse this P&L and return your response as:
1. A 3-bullet executive summary (one sentence each)
2. A markdown table of the top 3 risks with columns:
   Risk | Impact (H/M/L) | Recommended Action
3. One recommended next step for the finance team
"""`,
        codeLabel: "Structured output prompt",
        sim: {
          type: "PromptSim",
          prompt: "Analyse this P&L snippet and return:\n1. A 3-bullet executive summary\n2. A table of top 3 risks: Risk | Impact | Action\n3. One next step\n\nRevenue: £1.2M, COGS: £480K, Gross Profit: £720K (60%), Opex: £650K, EBITDA: £70K (5.8%)",
          response: "**Executive Summary**\n• Revenue of £1.2M delivers a 60% gross margin, in line with mid-market SaaS but below the 70%+ benchmark for efficient operators.\n• EBITDA of £70K (5.8%) leaves minimal buffer — one bad month of churn or an unexpected cost could push the business cash-negative.\n• Opex at £650K is the critical pressure point; at 54% of revenue it is unsustainably high for this revenue level.\n\n| Risk | Impact | Recommended Action |\n|---|---|---|\n| Low EBITDA buffer | High | Identify £50K of discretionary opex to cut immediately |\n| Gross margin below benchmark | Medium | Audit COGS — check if CS costs are misclassified |\n| No revenue growth data | Medium | Request MoM trend before drawing further conclusions |\n\n**Next step:** Run a 13-week cash flow forecast to confirm runway before making any new hires."
        },
        quiz: { question: "What is the best way to get a table in Claude's response?", options: ["Ask Claude to 'be more structured'", "Explicitly ask for a markdown table with named columns", "Use a shorter prompt", "Ask Claude to summarise"], answer: 1 },
      },
      {
        id: "pb-3",
        title: "Role Prompting",
        concept: "Telling Claude to adopt a specific professional role changes the depth and framing of its answers. 'Act as a CFO' produces board-level strategic commentary. 'Act as a financial controller' produces detailed accounting-focused output. 'Act as an investor' produces critical, sceptical analysis. Choose the role that matches the perspective you need.",
        tip: "Combine role prompting with your context block: 'Act as a CFO reviewing this for a board presentation. Our company is...'",
        code: `# Three different roles, same P&L data

# Role 1: CFO perspective
"Act as a CFO preparing for a board meeting.
Review this P&L and flag the top 3 things
the board will ask questions about."

# Role 2: Investor perspective
"Act as a PE investor conducting due diligence.
Identify the red flags in this P&L that would
reduce the valuation multiple."

# Role 3: Controller perspective
"Act as a financial controller doing month-end review.
List the line items that need further explanation
before you would sign off on this P&L."`,
        codeLabel: "Role prompting examples",
        sim: {
          type: "PromptSim",
          prompt: "Act as a PE investor doing due diligence. Identify red flags in this P&L that would reduce the valuation multiple.\n\nRevenue: £3M, Gross Margin: 55%, EBITDA: £180K (6%), Customer Concentration: top 3 clients = 70% of revenue.",
          response: "As a PE investor, here are the red flags that would compress the multiple:\n\n**1. Customer concentration risk (critical)**\n70% of revenue in 3 clients is a deal-breaker for most PE funds without a clawback mechanism. Loss of any single client could wipe out EBITDA entirely. I would price this at a 1–1.5x multiple discount versus a diversified book.\n\n**2. Gross margin at 55% (moderate concern)**\nFor a £3M business this suggests either high COGS (physical product, third-party licensing, or inflated CS costs) or pricing pressure. A 55% gross margin limits the path to 20%+ EBITDA margins at scale.\n\n**3. EBITDA at 6% (high concern)**\nAt £180K EBITDA on £3M revenue, there is almost no buffer. Any growth investment comes from debt or equity. This business is not self-funding its own growth — a significant negative for a buyout scenario.\n\n**Valuation impact:** A comparable diversified SaaS business might trade at 4–5x revenue. This business, with these red flags, I would underwrite at 1.5–2x revenue maximum."
        },
        quiz: { question: "Why does role prompting improve Claude's output?", options: ["It makes Claude use simpler language", "It aligns the perspective, depth and framing to the audience you need", "It forces Claude to use numbers", "It makes responses shorter"], answer: 1 },
      },
      {
        id: "pb-4",
        title: "Chain of Thought",
        concept: "For complex finance problems — valuations, multi-step forecasts, ratio chains — asking Claude to 'think step by step' before giving the answer consistently produces more accurate and auditable outputs. Claude shows its working, which lets you spot errors and understand the logic.",
        tip: "Add 'think step by step and show your working' to any calculation or analytical prompt. For quick summaries, skip it — it adds length without benefit.",
        code: `# Chain of thought prompt
"""
I need to calculate the implied enterprise value
of a business with the following data:

- Revenue: £5M
- EBITDA margin: 18%
- Net debt: £800K
- Comparable SaaS multiples: 3x–5x revenue, 15x–20x EBITDA

Think step by step, show your working at each stage,
then give me a valuation range and your recommended
midpoint with reasoning.
"""`,
        codeLabel: "Chain of thought example",
        sim: {
          type: "PromptSim",
          prompt: "Calculate the implied enterprise value. Revenue: £5M, EBITDA margin: 18%, Net debt: £800K, Comps: 3x–5x revenue, 15x–20x EBITDA. Think step by step and show working.",
          response: "**Step 1: Calculate EBITDA**\nEBITDA = £5M × 18% = £900K\n\n**Step 2: Revenue multiple range**\nLow: £5M × 3x = £15M EV\nHigh: £5M × 5x = £25M EV\nRevenue range: £15M–£25M\n\n**Step 3: EBITDA multiple range**\nLow: £900K × 15x = £13.5M EV\nHigh: £900K × 20x = £18M EV\nEBITDA range: £13.5M–£18M\n\n**Step 4: Equity value (subtract net debt)**\nRevenue range equity: £14.2M–£24.2M\nEBITDA range equity: £12.7M–£17.2M\n\n**Step 5: Recommended midpoint**\nThe EBITDA-based range (£13.5M–£18M EV) is tighter and more reliable at this margin level. Recommended midpoint: £15.75M EV / £14.95M equity value.\n\nThe revenue multiple would only be preferred if EBITDA is suppressed by growth investment — worth checking if that's the case here."
        },
        quiz: { question: "When is 'think step by step' most useful?", options: ["For short summaries", "For complex multi-step calculations and analysis", "For formatting requests", "For all prompts"], answer: 1 },
      },
      {
        id: "pb-5",
        title: "Iterative Prompting",
        concept: "The best finance outputs rarely come from a single prompt. Think of it as a conversation: start broad, get an initial response, then drill down with follow-up prompts. Each follow-up inherits the context of the previous exchange, so you can ask Claude to go deeper, change format, or challenge its own answer.",
        tip: "After getting an initial response, try: 'Now give me the counter-argument', 'Expand on point 2', or 'Turn this into a board-ready paragraph'.",
        code: `# Round 1: Initial analysis
"Analyse this cash flow forecast and summarise the key risks."

# Round 2: Drill down
"You mentioned liquidity risk in week 8.
What are three specific actions to address it?"

# Round 3: Challenge the answer
"Devil's advocate: why might those actions
not work in practice for an SME?"

# Round 4: Finalise
"Combine the risks and actions into a
one-page executive summary I can share with the board."`,
        codeLabel: "Iterative prompting chain",
        sim: {
          type: "TipsSim",
          tips: [
            "Start broad — get the full picture before drilling into specifics",
            "Use 'expand on point X' to go deeper on any section",
            "Ask Claude to challenge its own answer for a balanced view",
            "End with 'make this board-ready' to polish the final output",
            "Each follow-up builds on context — no need to repeat the data",
          ],
        },
        quiz: { question: "What is the main advantage of iterative prompting over a single long prompt?", options: ["It is faster", "Each round refines the output and drills into specific areas", "Claude gives shorter answers", "It uses less tokens"], answer: 1 },
      },
      {
        id: "pb-6",
        title: "Few-Shot Examples",
        concept: "When you need Claude to match a specific style, tone, or format — for example your company's financial commentary template — show it one or two examples of what you want before asking it to produce the real output. This is called few-shot prompting and it's one of the most reliable ways to control output format.",
        tip: "Paste a previous month's commentary as the example, then ask Claude to write this month's in the same style. Works perfectly for board packs and investor updates.",
        code: `# Few-shot prompt structure
"""
Here is an example of our monthly financial commentary format:

EXAMPLE (March):
"March revenue of £420K was 8% above budget, driven by two
enterprise deals closing ahead of schedule. Gross margin
declined 2pp to 68% due to third-party API costs.
EBITDA of £38K was in line with plan."

Now write the same style commentary for April using this data:
- Revenue: £390K (budget: £410K)
- Gross margin: 71%
- EBITDA: £22K (budget: £35K)
- Key event: two sales reps joined mid-month
"""`,
        codeLabel: "Few-shot prompting for commentary",
        sim: {
          type: "PromptSim",
          prompt: "Example commentary (March): 'March revenue of £420K was 8% above budget, driven by two enterprise deals.'\n\nNow write April commentary: Revenue £390K (budget £410K), Gross margin 71%, EBITDA £22K (budget £35K), two new sales reps joined.",
          response: "April revenue of £390K was 5% below budget, reflecting a softer close month as two new sales reps completed onboarding. Gross margin improved 3pp to 71%, partially offsetting the revenue shortfall. EBITDA of £22K was £13K below plan, primarily due to the incremental headcount cost of the new hires. The pipeline additions from the new reps are expected to benefit May and June performance."
        },
        quiz: { question: "What does few-shot prompting mean?", options: ["Using very short prompts", "Providing example outputs so Claude matches your style and format", "Asking Claude to be brief", "Sending multiple prompts at once"], answer: 1 },
      },
      {
        id: "pb-7",
        title: "Constraints and Boundaries",
        concept: "Without constraints, Claude tends to write long comprehensive answers. In finance you often need tight, specific outputs — a 50-word summary, an analysis using only the data you provided, or a recommendation with no more than three options. Adding explicit constraints makes the output immediately usable without editing.",
        tip: "Common useful constraints: 'in under 100 words', 'using only the data I have provided', 'no more than 3 recommendations', 'do not make assumptions — if data is missing, say so'.",
        code: `# Adding constraints to a prompt
"""
I am the FD of a retail business. Below is our Q3 P&L.
Analyse it and provide:
- A summary in EXACTLY 3 bullet points, max 20 words each
- ONLY use the data I have provided — do not make assumptions
- If a number is missing that you need, say so explicitly
- Do not recommend anything that requires more than £10K investment

[P&L data here]
"""`,
        codeLabel: "Constrained prompt example",
        sim: {
          type: "TipsSim",
          tips: [
            "'In under 100 words' — for executive summaries",
            "'Only use the data I have provided' — prevents hallucinated numbers",
            "'Do not make assumptions — flag missing data' — keeps analysis honest",
            "'No more than 3 recommendations' — forces prioritisation",
            "'Format as a single paragraph' — for report copy-paste",
          ],
        },
        quiz: { question: "Why is 'only use the data I have provided' a useful constraint?", options: ["It makes Claude faster", "It prevents Claude from inventing numbers or making unsupported assumptions", "It reduces the response length", "It improves formatting"], answer: 1 },
      },
      {
        id: "pb-8",
        title: "Avoiding Hallucinations",
        concept: "Claude can confidently state incorrect figures if you ask about specific data it doesn't have — especially company-specific numbers, niche industry benchmarks, or recent market data. The solution is to always provide your own data and tell Claude to work from that, rather than asking it to recall facts from memory.",
        tip: "For any prompt involving specific numbers, paste the data directly into the prompt. Never ask 'what was our revenue last year?' — Claude doesn't know. Ask 'given this revenue data: [...], what does it tell us?'",
        code: `# Risk of hallucination
"What is the average EBITDA margin for UK logistics companies?"
# Claude may give a number — but it could be outdated or wrong

# Better approach — ground it with real data
"""
Here is our EBITDA margin for the last 3 years:
2022: 8.2%, 2023: 7.1%, 2024: 9.4%

Based only on this data, identify the trend and
what might explain the 2023 dip.
Do not reference external benchmarks unless I ask.
"""`,
        codeLabel: "Grounding Claude with your data",
        sim: {
          type: "StepsSim",
          steps: [
            "Paste your actual data directly into the prompt",
            "Tell Claude explicitly: 'work only from the data I have provided'",
            "For benchmarks, either paste them yourself or ask Claude to caveat any figures it quotes",
            "If Claude gives a specific number you didn't provide, ask 'what is your source for that figure?'",
            "For current market data, use a web search tool first, then paste the results into the prompt",
          ],
        },
        quiz: { question: "What is the safest way to get accurate financial analysis from Claude?", options: ["Ask Claude to recall industry benchmarks", "Paste your own data and tell Claude to work from it only", "Ask shorter questions", "Use role prompting"], answer: 1 },
      },
      {
        id: "pb-9",
        title: "Prompt Templates",
        concept: "Once you have a prompt that works well — for monthly commentary, variance analysis, or board summaries — save it as a template. A good template has fixed instructions and placeholder slots where you swap in the current data. This makes AI a repeatable part of your finance workflow rather than a one-off experiment.",
        tip: "Store templates in a Notion page, Google Doc, or plain text file. Label them by use case: 'Monthly Board Commentary', 'Variance Analysis', 'Investor Update'.",
        code: `# Monthly board commentary template
TEMPLATE = """
You are a CFO writing a monthly board commentary.
Company: [COMPANY NAME], [INDUSTRY], [CURRENCY]

This month's data:
- Revenue: [ACTUAL] vs budget [BUDGET]
- Gross margin: [ACTUAL]% vs prior month [PRIOR]%
- EBITDA: [ACTUAL] vs budget [BUDGET]
- Key events: [1-2 BULLET POINTS]

Write a 3-paragraph board commentary:
P1: Revenue and headline performance
P2: Margin and cost analysis
P3: Outlook and risks for next month
Tone: professional, direct, no jargon
"""

# Fill in placeholders each month — takes 2 minutes`,
        codeLabel: "Reusable prompt template",
        sim: {
          type: "TipsSim",
          tips: [
            "Build one template per recurring finance task",
            "Use [PLACEHOLDER] notation so you know exactly what to swap",
            "Include format instructions in the template — don't repeat them each month",
            "Version your templates: v1, v2 — update when you find a better approach",
            "Share templates with your team so output style stays consistent",
          ],
        },
        quiz: { question: "What is the main benefit of a prompt template for recurring finance tasks?", options: ["Shorter answers", "Consistent, repeatable outputs without rewriting the prompt each time", "Better formatting", "Faster Claude responses"], answer: 1 },
      },
      {
        id: "pb-10",
        title: "Combining Techniques",
        concept: "The most powerful prompts combine multiple techniques: a context block, a role, structured output instructions, constraints, and grounded data. At first this feels like a lot to write — but a well-constructed prompt consistently gives you a board-ready output on the first try, saving far more time than it costs.",
        tip: "Write the context block and format instructions once, save them as a template. Each time you use it, just swap the data section.",
        code: `# Full combined prompt
"""
CONTEXT: I am the CFO of a UK manufacturing business,
£8M revenue, 45 employees, figures in GBP.

ROLE: Act as a CFO advisor preparing board materials.

DATA:
Revenue: £680K (budget: £720K, prior year: £630K)
Gross margin: 34% (budget: 37%, prior year: 32%)
EBITDA: -£12K (budget: +£28K)

TASK: Analyse this month's performance.

FORMAT:
1. Executive summary: exactly 2 sentences
2. Table: Metric | Actual | Budget | Variance | Comment
3. Top 2 risks for next month
4. One recommended action

CONSTRAINTS:
- Use only the data provided
- Each table comment max 10 words
- Recommended action must be achievable within 30 days
"""`,
        codeLabel: "Full combined prompt",
        sim: {
          type: "PromptSim",
          prompt: "CFO of UK manufacturing, £8M revenue, GBP. Act as CFO advisor.\nRevenue: £680K (budget £720K), GM: 34% (budget 37%), EBITDA: -£12K (budget +£28K).\nReturn: 2-sentence summary, performance table, 2 risks, 1 action.",
          response: "**Executive Summary**\nA £40K revenue shortfall combined with a 3pp gross margin miss resulted in EBITDA swinging £40K below budget to -£12K. Immediate cost control and a close examination of the margin decline are required to avoid a second consecutive miss.\n\n| Metric | Actual | Budget | Variance | Comment |\n|---|---|---|---|---|\n| Revenue | £680K | £720K | -£40K | Volume shortfall, not pricing |\n| Gross Margin | 34% | 37% | -3pp | Input costs or mix shift |\n| EBITDA | -£12K | +£28K | -£40K | Combined revenue and margin impact |\n\n**Top 2 Risks**\n1. If margin is input-cost driven, July will repeat unless contracts are renegotiated\n2. Two consecutive misses will erode board confidence in the FY forecast\n\n**Recommended Action (within 30 days):** Conduct a line-by-line COGS review to isolate whether the margin decline is from material costs, labour, or product mix — this determines whether the fix is commercial or operational."
        },
        quiz: { question: "Which combination produces the most reliable first-draft output?", options: ["Role only", "Context block + role + data + format + constraints", "Long prose question", "Few-shot examples only"], answer: 1 },
      },
    ],
  },
  {
    id: "analysis",
    icon: "📊",
    name: "Financial Analysis",
    desc: "Use Claude to analyse P&Ls, cash flows, and financial reports",
    lessons: [
      {
        id: "fa-1",
        title: "Reading a P&L with Claude",
        concept: "Pasting a P&L into Claude and asking for an analysis is one of the fastest ways to get a structured financial review. Claude can identify trends, flag anomalies, calculate implied ratios, and write commentary — in seconds. The key is to paste clean, structured data and be specific about what you want from the analysis.",
        tip: "Copy your P&L directly from Excel as tab-separated text, or paste it as a simple table. Claude handles both formats well.",
        code: `# P&L analysis prompt
"""
Below is our Q2 P&L. Please:
1. Calculate gross margin, EBITDA margin, and operating leverage
2. Identify the 2 most significant line items driving performance
3. Flag any line items that look unusual or warrant investigation
4. Write a 3-sentence CFO summary

Revenue          £1,240,000
COGS               £496,000
Gross Profit       £744,000
Sales & Marketing  £186,000
R&D                £124,000
G&A                £248,000
EBITDA             £186,000
"""`,
        codeLabel: "P&L analysis prompt",
        sim: {
          type: "PromptSim",
          prompt: "Analyse this P&L: Revenue £1.24M, COGS £496K, GP £744K, S&M £186K, R&D £124K, G&A £248K, EBITDA £186K.\nCalculate margins, identify key drivers, flag anything unusual, write a 3-sentence CFO summary.",
          response: "**Margins**\n• Gross Margin: 60.0% — healthy for SaaS, tight for services\n• EBITDA Margin: 15.0% — solid operational efficiency\n• OpEx ratio: 45% of revenue (S&M 15%, R&D 10%, G&A 20%)\n\n**Key Drivers**\n1. COGS at 40% of revenue is the largest single factor — if this is above prior periods, investigate whether support/infrastructure costs have increased\n2. G&A at 20% of revenue is high — typical benchmark is 10–15%; this warrants a review\n\n**Flag:** G&A at £248K is 2× the R&D spend. For a growth business this is an unusual ratio — either headcount is heavy in admin functions or there are non-recurring costs in the quarter.\n\n**CFO Summary:** Q2 delivered a 15% EBITDA margin on £1.24M revenue, demonstrating solid gross profit conversion. The primary concern is G&A running at 20% of revenue — above benchmark and warranting a detailed breakdown before the board meeting. R&D investment at 10% of revenue is at the lower end for a product business and may need to increase to support the roadmap."
        },
        quiz: { question: "What is the best format to paste P&L data into Claude?", options: ["A photograph of the spreadsheet", "Clean structured text or a simple table", "A PDF attachment", "A verbal description"], answer: 1 },
      },
      {
        id: "fa-2",
        title: "Spotting Red Flags",
        concept: "Claude is effective at acting as a second pair of eyes on financial data — identifying anomalies, inconsistencies, and warning signs that might be missed in a routine review. The key prompt pattern is to ask Claude to approach the data with scepticism, as an auditor or investor would.",
        tip: "Ask Claude to 'approach this as an auditor looking for areas that need further investigation' — this framing produces more critical and useful output than asking for a general analysis.",
        code: `# Red flag audit prompt
"""
Act as an external auditor reviewing this P&L
for our annual audit preparation.

Identify:
1. Any line items with unusual year-on-year movement (>20%)
2. Ratios that sit outside normal industry ranges
3. Items that appear understated or that might be
   hiding costs in another line
4. Questions you would ask management before signing off

Be direct and specific — this is for internal use only.

[Paste P&L here]
"""`,
        codeLabel: "Red flag audit prompt",
        sim: {
          type: "PromptSim",
          prompt: "Act as an external auditor. Flag red flags in: Revenue +2% YoY, COGS +18% YoY, Gross Margin down from 65% to 58%, G&A +35% YoY, EBITDA down from £280K to £95K.",
          response: "**Red Flags Identified:**\n\n1. **COGS +18% vs Revenue +2% (critical)** — A 16pp gap between cost and revenue growth is the most significant signal here. This drove the 7pp gross margin decline. I would want a full COGS bridge: what drove the increase? New headcount? Third-party costs? Lower pricing?\n\n2. **Gross margin 65% → 58% (high concern)** — A 7pp gross margin decline on flat revenue is a structural shift, not a one-off. This needs explaining before it can be signed off.\n\n3. **G&A +35% (moderate concern)** — Growing G&A 17× faster than revenue suggests either new hires, one-off legal/professional fees, or costs being reclassified from another line.\n\n4. **EBITDA £280K → £95K (result of above)** — A 66% EBITDA decline on 2% revenue growth means the business is operationally significantly less efficient than the prior year.\n\n**Questions for management:** (a) COGS bridge from prior year, (b) G&A breakdown by category, (c) Are there any non-recurring items in either line? (d) What is the forward plan to restore gross margin?"
        },
        quiz: { question: "Which auditor framing produces the most critical financial analysis from Claude?", options: ["Act as a cheerleader reviewing performance", "Act as an external auditor looking for areas needing investigation", "Act as a new employee reviewing the business", "Act as a customer"], answer: 1 },
      },
      {
        id: "fa-3",
        title: "Variance Analysis",
        concept: "Budget vs actual variance analysis is one of the most repetitive tasks in finance. Claude can take your actuals and budget, calculate variances, explain likely drivers, and write the management commentary — turning a 2-hour task into 5 minutes. Provide both datasets and ask for a structured variance bridge.",
        tip: "Paste both the budget and actuals side by side. Ask Claude to classify each variance as 'volume', 'price', 'mix', or 'cost' — this mirrors standard FP&A methodology.",
        code: `# Variance analysis prompt
"""
Below are our May actuals vs budget. For each line:
1. Calculate the £ variance and % variance
2. Classify the driver as: volume / price / cost / timing
3. Write a one-line management comment
4. Flag any variance over £20K or ±5% for board attention

              Budget    Actual
Revenue       £850K     £780K
COGS          £340K     £328K
Gross Profit  £510K     £452K
S&M           £127K     £145K
G&A           £85K      £82K
EBITDA        £298K     £225K
"""`,
        codeLabel: "Variance analysis prompt",
        sim: {
          type: "PromptSim",
          prompt: "Variance analysis — Budget vs Actual:\nRevenue: £850K vs £780K | COGS: £340K vs £328K | S&M: £127K vs £145K | EBITDA: £298K vs £225K\nCalculate variances, classify driver, one-line comment, flag >£20K.",
          response: "| Line | Budget | Actual | £ Var | % Var | Driver | Comment |\n|---|---|---|---|---|---|---|\n| Revenue | £850K | £780K | -£70K | -8.2% | Volume ⚠️ | Revenue shortfall — likely delayed deals or churn |\n| COGS | £340K | £328K | +£12K | +3.5% | Cost | Favourable — variable costs flexed down with lower revenue |\n| Gross Profit | £510K | £452K | -£58K | -11.4% | Volume ⚠️ | Driven by revenue miss; GM% held at 58% |\n| S&M | £127K | £145K | -£18K | -14.2% | Cost ⚠️ | Overspend — campaigns or headcount above plan |\n| G&A | £85K | £82K | +£3K | +3.5% | Cost | Marginal saving — no action required |\n| EBITDA | £298K | £225K | -£73K | -24.5% | Mixed ⚠️ | Revenue miss (£70K) amplified by S&M overspend (£18K) |\n\n**Board attention flags:** Revenue (-£70K), S&M overspend (-£18K), EBITDA (-£73K)"
        },
        quiz: { question: "What four driver categories mirror standard FP&A variance methodology?", options: ["Up, down, flat, unknown", "Volume, price, mix, cost/timing", "Good, bad, neutral, one-off", "Revenue, cost, margin, headcount"], answer: 1 },
      },
      {
        id: "fa-4",
        title: "Ratio Analysis",
        concept: "Financial ratios translate raw numbers into insight. Claude can calculate a full ratio suite from your P&L and balance sheet, benchmark them against industry norms, and explain what each ratio means in plain language — making it easy to produce ratio commentary for investors, banks, or internal management.",
        tip: "Ask for ratios in a table with four columns: Ratio Name | Formula | Your Value | Benchmark. This gives you a ready-to-share analysis sheet.",
        code: `# Ratio analysis prompt
"""
Calculate the key financial ratios from this data.
Return a table: Ratio | Formula | Value | Benchmark | Signal

Data:
Revenue: £4.2M
Gross Profit: £2.52M
EBITDA: £630K
Net Profit: £420K
Total Assets: £3.1M
Current Assets: £1.4M
Current Liabilities: £780K
Total Debt: £900K
Equity: £1.42M

Include: gross margin, EBITDA margin, net margin,
current ratio, debt-to-equity, return on equity,
asset turnover.
"""`,
        codeLabel: "Ratio analysis prompt",
        sim: {
          type: "PromptSim",
          prompt: "Calculate key ratios from: Revenue £4.2M, GP £2.52M, EBITDA £630K, Net Profit £420K, Assets £3.1M, Current Assets £1.4M, Current Liabilities £780K, Debt £900K, Equity £1.42M.\nTable: Ratio | Formula | Value | Benchmark | Signal",
          response: "| Ratio | Formula | Value | Benchmark | Signal |\n|---|---|---|---|---|\n| Gross Margin | GP/Revenue | 60.0% | 55–70% | ✅ Healthy |\n| EBITDA Margin | EBITDA/Revenue | 15.0% | 10–20% | ✅ Solid |\n| Net Margin | Net Profit/Revenue | 10.0% | 8–15% | ✅ Good |\n| Current Ratio | CA/CL | 1.79 | >1.5 | ✅ Adequate liquidity |\n| Debt-to-Equity | Debt/Equity | 0.63 | <1.0 | ✅ Conservative leverage |\n| Return on Equity | Net Profit/Equity | 29.6% | >15% | ✅ Strong returns |\n| Asset Turnover | Revenue/Assets | 1.35x | >1.0x | ✅ Efficient asset use |\n\n**Summary:** All seven ratios fall within or above benchmark ranges. The business demonstrates healthy profitability, adequate liquidity, and conservative leverage. ROE of 29.6% is a particular strength — well above the cost of equity for most businesses."
        },
        quiz: { question: "What four-column table format is most useful for a ratio analysis output?", options: ["Name | Value | Good | Bad", "Ratio | Formula | Your Value | Benchmark", "Metric | Actual | Budget | Variance", "Category | High | Low | Average"], answer: 1 },
      },
      {
        id: "fa-5",
        title: "Cash Flow Interpretation",
        concept: "A cash flow statement is often harder to read at a glance than a P&L. Claude can decompose operating, investing, and financing activities, explain why a profitable business might have negative cash flow, and identify the specific line items driving cash movements — turning a confusing statement into a clear narrative.",
        tip: "Always ask Claude to reconcile net income to operating cash flow — this is where most of the explanatory insight lives and where errors are most commonly caught.",
        code: `# Cash flow interpretation prompt
"""
Interpret this cash flow statement. Explain:
1. Why operating cash flow differs from net profit
2. What the investing activities tell us about growth strategy
3. Whether the financing activities are sustainable
4. The net change in cash — is this a concern?
5. One question a bank or investor would ask

Net Income: £380K
Depreciation: £45K
Working Capital change: -£210K
Operating Cash Flow: £215K
Capital Expenditure: -£320K
Investing Cash Flow: -£320K
New Debt: £150K
Financing Cash Flow: £150K
Net Change in Cash: £45K
"""`,
        codeLabel: "Cash flow interpretation prompt",
        sim: {
          type: "PromptSim",
          prompt: "Interpret: Net Income £380K, Depreciation £45K, Working Capital change -£210K, Operating CF £215K, Capex -£320K, New Debt £150K, Net Cash Change +£45K.",
          response: "**1. Why OCF differs from net income**\nNet income of £380K converts to only £215K operating cash due to a £210K working capital outflow — likely receivables growing faster than payables. This is common in a growing business but signals customers are being given long payment terms.\n\n**2. Investing activities**\n£320K capex is significant — 84% of net income. This suggests meaningful investment in equipment, infrastructure, or product. It's either growth investment (positive) or maintenance of ageing assets (concerning) — the distinction matters.\n\n**3. Financing activities**\n£150K new debt taken to part-fund the capex. Sustainable if the capex generates returns above the cost of debt. One-off if it's an exceptional investment cycle.\n\n**4. Net cash +£45K**\nThe business is broadly cash neutral after a heavy investment year. Not a concern in isolation — but if capex remains at £300K+ annually, the debt will need to keep growing unless operating cash flow improves significantly.\n\n**5. Investor question:** 'What is the expected return and payback period on the £320K capex investment?'"
        },
        quiz: { question: "Why might a profitable business have low operating cash flow?", options: ["Incorrect accounting", "Working capital outflows — receivables growing faster than payables", "Low revenue", "High depreciation"], answer: 1 },
      },
      {
        id: "fa-6",
        title: "Budget vs Actual Commentary",
        concept: "Writing monthly management commentary is time-consuming and often repetitive. Claude can turn your variance numbers into polished, board-ready narrative commentary in minutes. The key is to provide both the numbers and the context — any one-off events, strategic decisions, or external factors that explain the variances.",
        tip: "Tell Claude which variances were planned (e.g. deliberate investment) vs unplanned (e.g. lost revenue). This distinction dramatically improves commentary quality.",
        code: `# Monthly commentary generation
"""
Write a board-ready management commentary for May.
Tone: professional, factual, concise.
Length: 3 short paragraphs.

Performance data:
- Revenue: £1.1M actual vs £1.2M budget (-8%)
- Gross Margin: 63% actual vs 65% budget
- EBITDA: £88K actual vs £156K budget (-44%)
- Headcount: 24 (budget: 22) — 2 new hires joined

Context (include in commentary):
- Revenue miss driven by 3-week delay on Enterprise deal
  (now signed and invoiced in June)
- 2 new sales reps joined — salary cost partially explains
  the margin and EBITDA miss
- No churn events in May
"""`,
        codeLabel: "Commentary generation prompt",
        sim: {
          type: "PromptSim",
          prompt: "Write board commentary for May. Revenue £1.1M vs £1.2M budget. EBITDA £88K vs £156K. Context: revenue miss due to delayed enterprise deal (signed June), 2 new sales reps joined.",
          response: "May revenue of £1.1M came in 8% below budget at £1.2M, driven entirely by a three-week delay on a single enterprise deal that has since been signed and invoiced in June. Excluding this timing difference, the underlying pipeline conversion was in line with expectations and there were no churn events during the month.\n\nGross margin of 63% was 2pp below budget, reflecting a modest shift in product mix during a lighter revenue month. EBITDA of £88K was £68K below plan, with the variance split between the revenue shortfall (£72K impact) and incremental headcount costs from two new sales representatives who joined mid-month as planned.\n\nOutlook for June is positive: the delayed enterprise deal has been booked, the new sales team members are now fully onboarded, and the pipeline remains above the level required to hit Q2 budget. The finance team will monitor whether the new headcount investment begins converting to pipeline within the next 60 days."
        },
        quiz: { question: "What context should you give Claude when generating monthly commentary?", options: ["Only the numbers", "Numbers plus any one-off events, planned investments, or external factors that explain variances", "Only the variances vs budget", "The previous month's commentary only"], answer: 1 },
      },
      {
        id: "fa-7",
        title: "Summarising Financial Reports",
        concept: "Long financial reports — annual accounts, investor decks, bank information memoranda — take hours to read in full. Claude can summarise a pasted document into key figures, main themes, and critical risks in minutes. This is one of the highest-leverage use cases for finance professionals dealing with high document volume.",
        tip: "For very long documents, paste section by section and ask Claude to maintain a running summary. Then ask it to synthesise all sections at the end.",
        code: `# Report summarisation prompt
"""
Below is the financial section of a target company's
information memorandum. Please extract and summarise:

1. Key financials: revenue, EBITDA, net debt (last 3 years)
2. Revenue quality: concentration, recurring vs one-off
3. Margin trends: improving / declining / stable
4. Key risks mentioned (explicit or implied)
5. Management's stated growth strategy
6. One metric or claim that seems optimistic or that
   you would want to verify independently

[Paste report section here]
"""`,
        codeLabel: "Report summarisation prompt",
        sim: {
          type: "TipsSim",
          tips: [
            "Ask for a structured summary with numbered sections — easier to reference later",
            "Include 'flag any claim that seems optimistic' — gives you a due diligence checklist",
            "For M&A or investment documents, ask for a 5-point investment thesis and 5-point risk summary",
            "Paste section by section for very long reports, then ask Claude to synthesise",
            "Always ask 'what information is missing from this document?' — Claude spots gaps well",
          ],
        },
        quiz: { question: "What is the most useful addition to a report summarisation prompt?", options: ["Ask for a longer summary", "Ask Claude to flag any claim that seems optimistic or requires verification", "Ask for bullet points only", "Ask Claude to rewrite the report"], answer: 1 },
      },
      {
        id: "fa-8",
        title: "Writing Financial Commentary",
        concept: "Financial commentary — for board packs, investor updates, or lender reports — needs to be accurate, professional, and written in your voice. Claude can draft this commentary from raw numbers and bullet-point context, matching the tone and length you specify. The output typically requires light editing rather than a full rewrite.",
        tip: "Give Claude a sample of your previous commentary alongside the new data — it will match your style far more closely than a generic prompt.",
        code: `# Financial commentary with style matching
"""
Here is last quarter's investor update commentary (for style reference):
"Q3 2024 delivered revenue of £1.8M, representing 22% growth
year-on-year. EBITDA of £252K (14% margin) reflected continued
investment in the sales team while maintaining strong unit economics."

Now write Q4 2024 commentary in the same style using:
- Revenue: £2.1M (+28% YoY)
- EBITDA: £294K (14% margin)
- Key event: launched enterprise tier in December
- Outlook: strong pipeline heading into 2025
"""`,
        codeLabel: "Style-matched commentary prompt",
        sim: {
          type: "PromptSim",
          prompt: "Style reference: 'Q3 delivered £1.8M revenue, 22% growth. EBITDA £252K (14% margin).'\nQ4 data: Revenue £2.1M (+28% YoY), EBITDA £294K (14% margin), launched enterprise tier December, strong 2025 pipeline.",
          response: "Q4 2024 delivered revenue of £2.1M, representing 28% growth year-on-year and closing a strong second half. EBITDA of £294K maintained a 14% margin, demonstrating operational leverage as the business scaled while absorbing the December launch of the enterprise tier. The new enterprise offering saw early traction before year-end and enters 2025 with a healthy pipeline of qualified opportunities."
        },
        quiz: { question: "What is the fastest way to get Claude to match your writing style for financial commentary?", options: ["Describe your style in words", "Paste a previous example of your commentary alongside the new data", "Ask Claude to be more professional", "Use a shorter prompt"], answer: 1 },
      },
      {
        id: "fa-9",
        title: "Forecasting Assumptions Review",
        concept: "Financial forecasts are only as good as their assumptions. Claude can review a set of assumptions, identify which ones are most sensitive, flag any that look aggressive or inconsistent with the historical data you provide, and suggest alternative scenarios. This makes Claude an effective sounding board before you present a forecast to the board.",
        tip: "Ask Claude to rate each assumption as 'conservative / base / aggressive' and explain why. This gives you an instant sensitivity map.",
        code: `# Assumptions review prompt
"""
Review these FY2025 forecast assumptions for our SaaS business.
Rate each as Conservative / Base / Aggressive and explain why.
Flag any that are internally inconsistent.

Historical data:
- Revenue growth: 18% (2023), 22% (2024)
- Churn rate: 12% (2023), 9% (2024)
- New logo ARR: £380K (2023), £520K (2024)

FY2025 Assumptions:
- Revenue growth: 35%
- Churn rate: 6%
- New logo ARR: £900K
- Gross margin: 75% (current: 68%)
- Headcount growth: 20% (sales only)
"""`,
        codeLabel: "Assumptions review prompt",
        sim: {
          type: "PromptSim",
          prompt: "Review FY2025 assumptions for SaaS: Revenue growth 35% (history: 18%, 22%), Churn 6% (history: 12%, 9%), New ARR £900K (history: £380K, £520K), GM 75% (current 68%).\nRate each: Conservative / Base / Aggressive.",
          response: "| Assumption | Rating | Reasoning |\n|---|---|---|\n| Revenue growth 35% | **Aggressive** | Growth acceleration of 13pp vs best-ever 22% — requires both churn improvement and significant new logo step-up simultaneously |\n| Churn rate 6% | **Aggressive** | Improving from 9% to 6% in one year is a 33% reduction — possible but would require a major product or CS investment not reflected here |\n| New logo ARR £900K | **Aggressive** | 73% increase on 2024's £520K — headcount growing only 20% in sales; the math is stretched |\n| Gross margin 75% | **Aggressive** | A 7pp margin improvement requires either significant price increases or major infrastructure cost reduction — what is driving this? |\n\n**Internal inconsistency:** A 35% revenue growth target combined with only 20% headcount growth in sales assumes a large productivity improvement per rep. If the team is new (as implied by 20% growth), ramp time means the 35% target is carrying significant execution risk.\n\n**Recommendation:** Model a base case at 25% growth with 7.5% churn — these are achievable extensions of the trend. The current plan reads as an optimistic case, not a base case."
        },
        quiz: { question: "What rating system helps Claude produce a useful assumptions review?", options: ["Pass / Fail", "Conservative / Base / Aggressive", "High / Low", "Good / Bad / Uncertain"], answer: 1 },
      },
      {
        id: "fa-10",
        title: "Sensitivity Analysis",
        concept: "Sensitivity analysis shows how the outcome changes when you vary a key assumption. Claude can run a verbal sensitivity analysis — explaining which variables have the most impact — and help you build the narrative around your numbers. For the actual modelling, pair Claude's reasoning with Excel or a FinancePlots tool.",
        tip: "Ask Claude 'which 3 assumptions, if wrong by 10%, have the biggest impact on EBITDA?' — this gives you an instant priority list for your sensitivity model.",
        code: `# Sensitivity analysis prompt
"""
Based on this P&L structure, identify:
1. The 3 assumptions with the highest EBITDA sensitivity
2. For each, what is the EBITDA impact of a 10% adverse movement?
3. Which combination of adverse movements would push
   EBITDA below zero?
4. What mitigating actions exist for each high-sensitivity item?

Revenue: £2M, Gross Margin: 62%, Fixed Costs: £780K, EBITDA: £460K
Variable costs = 38% of revenue
Fixed costs split: Salaries 65%, Rent 10%, Other 25%
"""`,
        codeLabel: "Sensitivity analysis prompt",
        sim: {
          type: "PromptSim",
          prompt: "P&L: Revenue £2M, GM 62%, Fixed Costs £780K, EBITDA £460K. Which 3 assumptions have highest EBITDA sensitivity? What is the impact of 10% adverse movement in each?",
          response: "**Top 3 EBITDA-sensitive assumptions:**\n\n1. **Revenue (-10% = -£200K revenue)**\n   EBITDA impact: -£124K (62% of revenue drop flows through to EBITDA at 62% GM)\n   EBITDA falls from £460K to £336K — a 27% decline from a 10% revenue miss.\n\n2. **Gross Margin (-10% = -6.2pp)**\n   EBITDA impact: -£124K (6.2pp × £2M revenue)\n   Same absolute impact as revenue but potentially harder to reverse quickly.\n\n3. **Fixed Cost Salaries (+10% = +£50.7K)**\n   EBITDA impact: -£51K — smaller than revenue/margin but most likely to occur (pay reviews, new hires)\n\n**Double-hit scenario:**\n Revenue -10% AND Gross Margin -5pp would reduce EBITDA by approximately £224K — from £460K to £236K. A triple-hit adding salary inflation would approach breakeven.\n\n**Mitigating actions:**\n• Revenue: maintain 3-month rolling pipeline at 2× monthly target\n• Gross margin: fix input cost contracts where possible; review pricing annually\n• Salaries: build pay review timing into the forecast cycle"
        },
        quiz: { question: "What is the most useful sensitivity question to ask Claude?", options: ["What is our EBITDA?", "Which 3 assumptions, if wrong by 10%, have the biggest EBITDA impact?", "Is our forecast aggressive?", "What is the industry average margin?"], answer: 1 },
      },
    ],
  },
  {
    id: "excel",
    icon: "📐",
    name: "Excel & Modelling",
    desc: "Write formulas, debug models and build structure with Claude",
    lessons: [
      {
        id: "em-1",
        title: "Writing Excel Formulas",
        concept: "Describing what you want in plain English and asking Claude for the Excel formula is one of the most practical daily uses of AI for finance professionals. Claude handles XLOOKUP, INDEX/MATCH, dynamic arrays, SUMIFS, complex nested IFs, and more — and explains what each part of the formula does.",
        tip: "Always describe the data layout (column letters, row numbers, sheet names) for the most accurate formula. 'Column A has dates, B has revenue, I want to sum revenue for Q1' gets a better formula than a vague description.",
        code: `# Excel formula request
"""
Write an Excel formula for the following:
- Sheet: 'Data'
- Column A: dates (daily, Jan–Dec 2024)
- Column B: revenue (£ values)
- I want a formula in a summary sheet that sums
  revenue for Q2 only (April, May, June 2024)
- The formula should work if I add more rows later
"""

# Claude will return:
=SUMPRODUCT((MONTH(Data!A:A)>=4)*(MONTH(Data!A:A)<=6)*
(YEAR(Data!A:A)=2024)*(Data!B:B))`,
        codeLabel: "Excel formula request example",
        sim: {
          type: "PromptSim",
          prompt: "Write an Excel formula: Sheet 'Data', Column A = dates, Column B = revenue. I want to sum revenue for Q2 2024 (April–June) in a separate summary sheet. Should work if rows are added.",
          response: "Here's the formula for your summary sheet:\n\n```\n=SUMPRODUCT((MONTH(Data!A:A)>=4)*(MONTH(Data!A:A)<=6)*(YEAR(Data!A:A)=2024)*(Data!B:B))\n```\n\n**How it works:**\n- `MONTH(Data!A:A)>=4` — filters April onwards\n- `MONTH(Data!A:A)<=6` — filters up to June\n- `YEAR(Data!A:A)=2024` — restricts to 2024\n- Multiplying the three conditions acts like AND logic\n- `SUMPRODUCT` sums only the rows where all conditions are TRUE\n\n**Automatically handles new rows** — using full column references (A:A) means no manual range update needed.\n\n**Alternative with SUMIFS:**\n```\n=SUMIFS(Data!B:B,Data!A:A,\">=\"&DATE(2024,4,1),Data!A:A,\"<\"&DATE(2024,7,1))\n```\nThis is slightly faster on very large datasets."
        },
        quiz: { question: "What information should you give Claude to get the most accurate Excel formula?", options: ["Just describe what you want in general terms", "Column letters, row numbers, sheet names, and a description of the logic", "The formula you already have", "The size of your dataset"], answer: 1 },
      },
      {
        id: "em-2",
        title: "Debugging Formula Errors",
        concept: "Paste a broken Excel formula and its error message into Claude and it will diagnose the problem, explain why it is occurring, and provide the corrected version. Claude handles #VALUE!, #REF!, #N/A, circular references, and logical errors — often faster than searching Stack Overflow.",
        tip: "Include the error type AND the formula. If you can also describe what the formula is supposed to do, Claude diagnoses it much faster.",
        code: `# Formula debugging prompt
"""
This Excel formula is returning #VALUE! and I don't know why:

=VLOOKUP(A2,'Product List'!A:C,3,FALSE)*D2

Context:
- A2 contains a product code (text like "PRD-001")
- 'Product List'!A:C has codes in column A,
  prices in column C
- D2 has the quantity (number)
- I want: unit price × quantity

What is causing the error and what is the fix?
"""`,
        codeLabel: "Formula debugging prompt",
        sim: {
          type: "PromptSim",
          prompt: "Formula returning #VALUE!: =VLOOKUP(A2,'Product List'!A:C,3,FALSE)*D2\nA2 = product code text, Column C = prices, D2 = quantity. What's wrong?",
          response: "The most likely cause of #VALUE! here is one of three things:\n\n**Most likely: Column C contains text-formatted numbers**\nIf prices in 'Product List'!C were imported from a system, they may look like numbers but are stored as text. VLOOKUP returns the text string, and multiplying text by D2 causes #VALUE!.\n\n**Fix:**\n```\n=VALUE(VLOOKUP(A2,'Product List'!A:C,3,FALSE))*D2\n```\nWrapping with VALUE() forces conversion to a number.\n\n**Second possibility: Mismatched data types in lookup column**\nIf 'Product List'!A contains numbers stored as text (e.g. '001 vs 001), the VLOOKUP returns #N/A rather than #VALUE! — but if the #N/A is then multiplied by D2 you get #VALUE!. Fix: ensure A2 and the lookup column are both the same type.\n\n**Third possibility: D2 contains text**\nIf D2 has a space or text character, the multiplication fails. Check with =ISNUMBER(D2).\n\n**Recommended robust version:**\n```\n=IFERROR(VALUE(VLOOKUP(A2,'Product List'!A:C,3,FALSE))*D2,\"Check data\")\n```"
        },
        quiz: { question: "What should you always include when asking Claude to debug an Excel formula?", options: ["Just the formula", "The formula, the error type, and what the formula is supposed to do", "The sheet name only", "A screenshot description"], answer: 1 },
      },
      {
        id: "em-3",
        title: "Building Model Structure",
        concept: "Before building a financial model, it's worth asking Claude to design the structure — which sheets to include, how to lay out the assumptions, what the calculation flow should be, and what outputs the model needs. This upfront planning avoids structural rework later and produces cleaner, more auditable models.",
        tip: "Tell Claude the purpose of the model, who will use it, and what decisions it needs to support. The structure should follow the decision, not the other way around.",
        code: `# Model structure request
"""
I need to build a 3-year financial model for a
UK restaurant chain (3 sites, planning to open 2 more).

Purpose: bank loan application of £500K
Audience: commercial banking team
Key decision: loan affordability and repayment

Design the model structure for me:
- List the tabs/sheets needed
- For each tab, describe what it contains
- Describe the calculation flow between tabs
- List the key output metrics the bank will focus on
"""`,
        codeLabel: "Model structure design prompt",
        sim: {
          type: "StepsSim",
          steps: [
            "Tab 1 — Assumptions: all input variables in one place (revenue per cover, covers per day, staffing ratios, rent, growth rates)",
            "Tab 2 — P&L: 3-year monthly income statement driven entirely by Assumptions tab",
            "Tab 3 — Cash Flow: operating, investing (new site capex), and financing (loan drawdown and repayments)",
            "Tab 4 — Balance Sheet: closing positions each year — assets, liabilities, equity",
            "Tab 5 — Debt Schedule: loan terms, interest calculation, repayment waterfall, covenant ratios",
            "Tab 6 — Summary / Dashboard: key metrics the bank needs — DSCR, interest cover, breakeven occupancy, payback period",
          ],
        },
        quiz: { question: "What should you tell Claude before asking it to design a model structure?", options: ["The number of rows you want", "The purpose of the model, the audience, and what decisions it supports", "The software version", "Your Excel skill level"], answer: 1 },
      },
      {
        id: "em-4",
        title: "Writing DAX Measures",
        concept: "DAX is Power BI's formula language and has a steep learning curve. Claude can write DAX measures from a plain English description of what you want to calculate — handling CALCULATE, FILTER, ALL, time intelligence functions (TOTALYTD, SAMEPERIODLASTYEAR), and complex context transitions. Always test the measure in Power BI after Claude generates it.",
        tip: "Describe your data model to Claude: table names, column names, and relationships. A DAX formula written without this context often needs adjustment.",
        code: `# DAX measure request
"""
Write a DAX measure for Power BI.

Data model:
- Table: Sales (columns: Date, Revenue, ProductID, CustomerID)
- Table: Calendar (Date column, marked as date table)
- Relationship: Sales[Date] → Calendar[Date]

I need a measure that:
- Calculates revenue for the same period last year
- Works correctly in a matrix visual with months on rows
- Returns BLANK() if there is no prior year data
"""`,
        codeLabel: "DAX measure request",
        sim: {
          type: "PromptSim",
          prompt: "Write DAX: Revenue same period last year. Tables: Sales (Date, Revenue), Calendar (Date, marked as date table). Should work in matrix with months on rows, return BLANK() if no prior year data.",
          response: "```dax\nRevenue PY = \nCALCULATE(\n    SUM(Sales[Revenue]),\n    SAMEPERIODLASTYEAR(Calendar[Date])\n)\n```\n\n**How it works:**\n- `SUM(Sales[Revenue])` — calculates total revenue in the current filter context\n- `SAMEPERIODLASTYEAR(Calendar[Date])` — shifts the date filter back exactly 12 months\n- `CALCULATE()` — applies the modified filter context\n- Returns BLANK() automatically when no prior year data exists (SAMEPERIODLASTYEAR returns an empty table)\n\n**Requirements:**\n- Calendar table must be marked as a Date Table in Power BI\n- The relationship between Sales[Date] and Calendar[Date] must be active\n\n**To show YoY growth % alongside it:**\n```dax\nRevenue YoY % = \nDIVIDE(\n    [Revenue] - [Revenue PY],\n    [Revenue PY]\n)\n```"
        },
        quiz: { question: "What information does Claude need to write accurate DAX measures?", options: ["Just the measure name", "Table names, column names, relationships, and what you want to calculate", "The Power BI version", "The visual type only"], answer: 1 },
      },
      {
        id: "em-5",
        title: "Cleaning Messy Data",
        concept: "Finance data from ERPs, spreadsheets, and exports is often messy — inconsistent formats, merged cells, extra spaces, mixed date formats, or values stored as text. Claude can write Excel formulas, Power Query M code, or Python Pandas code to clean and reshape data, often faster than doing it manually.",
        tip: "Describe the 'before' state of your data clearly and the 'after' state you need. A concrete example of one row before and after transformation helps Claude give a precise solution.",
        code: `# Data cleaning prompt
"""
I have a messy Excel export from our accounting system.
Issues:
1. Date column is stored as text "DD/MM/YYYY" — need proper dates
2. Revenue column has £ signs and commas: "£1,240,000" — need numbers
3. Customer names have trailing spaces
4. Some revenue rows have "N/A" instead of 0

Write Excel formulas to fix each issue.
I can add 4 helper columns next to the originals.
"""`,
        codeLabel: "Data cleaning formula request",
        sim: {
          type: "PromptSim",
          prompt: "Fix 4 data issues with Excel formulas: (1) Text dates 'DD/MM/YYYY' → real dates, (2) '£1,240,000' → numbers, (3) trailing spaces in names, (4) 'N/A' values → 0.",
          response: "**Column helper formulas (assuming originals in A, B, C, D):**\n\n**1. Text dates → real dates (original in A2):**\n```\n=DATEVALUE(TEXT(A2,\"DD/MM/YYYY\"))\n```\nOr more robustly:\n```\n=DATE(RIGHT(A2,4),MID(A2,4,2),LEFT(A2,2))\n```\nFormat the helper column as Date.\n\n**2. £1,240,000 → number (original in B2):**\n```\n=VALUE(SUBSTITUTE(SUBSTITUTE(B2,\"£\",\"\"),\",\",\"\"))\n```\nRemoves the £ sign first, then removes commas, then converts to number.\n\n**3. Remove trailing spaces (original in C2):**\n```\n=TRIM(C2)\n```\nTRIM removes all leading, trailing, and double spaces.\n\n**4. N/A → 0 (original in D2):**\n```\n=IF(D2=\"N/A\",0,VALUE(D2))\n```\nOr if the column is already numeric with #N/A errors:\n```\n=IFERROR(D2,0)\n```"
        },
        quiz: { question: "What is the most helpful thing to include when asking Claude to clean data?", options: ["The file size", "A description of the before state and after state, ideally with a row example", "The ERP system name", "The number of rows"], answer: 1 },
      },
      {
        id: "em-6",
        title: "Converting Excel to Python",
        concept: "Python with Pandas can automate financial calculations that would otherwise require manual Excel work each month. Claude can translate your Excel logic — formulas, pivot tables, VLOOKUP chains — into equivalent Python code that runs automatically on new data files. This is the first step toward full finance automation.",
        tip: "Paste the Excel formula and describe what the sheet does. Claude translates the logic to Pandas. Start with one calculation, get it working, then expand.",
        code: `# Excel to Python conversion
"""
Convert this Excel workflow to Python (Pandas):

1. Open file 'monthly_sales.xlsx'
2. Sheet 'Raw Data' has columns: Date, Customer, Product, Revenue
3. I need:
   a. Filter for current month only
   b. Group by Customer, sum Revenue
   c. Add a column: Revenue as % of total
   d. Sort by Revenue descending
   e. Export top 10 customers to a new Excel file

Show the complete Python script.
"""`,
        codeLabel: "Excel to Python conversion",
        sim: {
          type: "CodeSim",
          label: "Python script output",
          code: `import pandas as pd
from datetime import datetime

# Load data
df = pd.read_excel('monthly_sales.xlsx', sheet_name='Raw Data')
df['Date'] = pd.to_datetime(df['Date'])

# Filter current month
now = datetime.now()
df_month = df[
    (df['Date'].dt.month == now.month) &
    (df['Date'].dt.year == now.year)
]

# Group by customer
summary = df_month.groupby('Customer')['Revenue'].sum().reset_index()

# Revenue as % of total
summary['Revenue %'] = (summary['Revenue'] / summary['Revenue'].sum() * 100).round(1)

# Sort and top 10
top10 = summary.sort_values('Revenue', ascending=False).head(10)

# Export
top10.to_excel('top_customers.xlsx', index=False)
print(f"Done. Top customer: {top10.iloc[0]['Customer']}")`,
        },
        quiz: { question: "What is the key information Claude needs to convert Excel logic to Python?", options: ["The Excel version", "The formula or workflow logic, column names, and desired output", "The file size", "The Python version installed"], answer: 1 },
      },
      {
        id: "em-7",
        title: "Stress Testing a Model",
        concept: "A financial model that only shows the base case gives a false sense of precision. Claude can help you design stress test scenarios, identify the key assumptions to flex, and write the commentary explaining what each scenario means for the business. The actual modelling happens in your spreadsheet — Claude provides the thinking.",
        tip: "Ask Claude for a 'downside case' that is plausible but painful, and a 'severe stress' that represents a realistic worst case. The difference between the two reveals your true risk exposure.",
        code: `# Stress test design prompt
"""
Help me design stress tests for this SaaS model:
Base case: £5M revenue, 15% growth, 12% EBITDA margin

Design 3 scenarios:
1. Downside case — plausible but painful
2. Severe stress — realistic worst case
3. Upside case — achievable outperformance

For each scenario, specify:
- Revenue growth assumption
- Gross margin assumption
- Key cost flex
- Resulting EBITDA range
- Narrative description (1 sentence)
"""`,
        codeLabel: "Stress test design prompt",
        sim: {
          type: "PromptSim",
          prompt: "Design 3 stress scenarios for SaaS model: Base = £5M revenue, 15% growth, 12% EBITDA margin. Downside, severe stress, and upside — with assumptions and one-line narrative each.",
          response: "| Scenario | Revenue Growth | Gross Margin | Cost Flex | EBITDA | Narrative |\n|---|---|---|---|---|---|\n| **Downside** | 5% | -3pp to 62% | Hold headcount flat | ~8% | Slower than expected enterprise adoption with margin pressure from a new competitor, but the business remains profitable |\n| **Severe Stress** | -5% | -6pp to 59% | 10% headcount reduction | ~1-2% | A combination of churn acceleration and pricing pressure forces emergency cost cuts to preserve breakeven |\n| **Upside** | 28% | +2pp to 67% | Invest in sales +25% | ~14% | Enterprise tier drives large deal wins ahead of plan, and improved onboarding reduces support costs |\n\n**Key sensitivities to model:**\n1. Every 1pp of gross margin = £50K EBITDA at £5M revenue\n2. Every £500K of revenue miss at 65% GM = £325K EBITDA impact\n3. Headcount is the main controllable lever in the severe stress scenario"
        },
        quiz: { question: "What is the difference between a downside case and a severe stress?", options: ["They are the same", "Downside is plausible but painful; severe stress is realistic worst case", "Downside is worse", "Severe stress is unlikely"], answer: 1 },
      },
      {
        id: "em-8",
        title: "Documenting a Financial Model",
        concept: "Undocumented financial models are a liability — the person who built them leaves, and no one understands the logic. Claude can generate documentation for a model from a description of its structure: assumption definitions, formula logic, known limitations, and a user guide. This turns a personal tool into a team asset.",
        tip: "Ask Claude to write a 'model assumptions dictionary' — one row per assumption with: Name | Definition | Source | Sensitivity (H/M/L). This becomes the first page of any model audit.",
        code: `# Model documentation prompt
"""
Write documentation for this financial model.
Include:
1. Model purpose (1 paragraph)
2. Assumptions dictionary (table: Name | Definition | Source | Sensitivity H/M/L)
3. Calculation flow (step-by-step)
4. Known limitations (bullet list)
5. How to update the model each month (user instructions)

Model: 3-year P&L forecast for a SaaS business
Key assumptions: growth rate, churn, ARPU, headcount plan,
gross margin, CAC, LTV
"""`,
        codeLabel: "Model documentation request",
        sim: {
          type: "TipsSim",
          tips: [
            "Model Purpose: one clear paragraph explaining what the model does and what decisions it supports",
            "Assumptions Dictionary: every input variable defined, sourced, and rated for sensitivity",
            "Calculation Flow: numbered steps from inputs to outputs — makes auditing straightforward",
            "Known Limitations: honest list of what the model doesn't capture or where it might be wrong",
            "Monthly Update Guide: step-by-step instructions so anyone on the team can run the monthly process",
          ],
        },
        quiz: { question: "What is an 'assumptions dictionary' in a financial model?", options: ["A glossary of finance terms", "A table defining every input variable with its source and sensitivity rating", "A list of Excel functions used", "A summary of the model outputs"], answer: 1 },
      },
      {
        id: "em-9",
        title: "Power Query M Code",
        concept: "Power Query's M language is powerful but syntactically unfamiliar. Claude can write M code from a plain English description of the transformation you need — filtering, pivoting, unpivoting, merging tables, creating custom columns, and handling data type conversions. Paste the code directly into Power Query's Advanced Editor.",
        tip: "Describe your starting table structure (column names and types) and the end result you want. Claude's M code is usually correct first-try for standard transformations.",
        code: `# Power Query M request
"""
Write Power Query M code for this transformation:

Starting table: 'Sales' with columns:
- Month (text: "Jan", "Feb" etc.)
- Product (text)
- Region (text: "North", "South", "East", "West")
- Revenue (number)

I need to:
1. Filter to Region = "North" only
2. Pivot the Month column so months become column headers
3. Fill null values with 0
4. Add a Total column summing all months
"""`,
        codeLabel: "Power Query M code request",
        sim: {
          type: "PromptSim",
          prompt: "Write Power Query M: Table 'Sales' with Month, Product, Region, Revenue. Filter Region=North, pivot months to columns, fill nulls with 0, add Total column.",
          response: "```m\nlet\n    Source = Sales,\n    FilterNorth = Table.SelectRows(Source, each [Region] = \"North\"),\n    PivotMonths = Table.Pivot(\n        FilterNorth,\n        List.Distinct(FilterNorth[Month]),\n        \"Month\",\n        \"Revenue\",\n        List.Sum\n    ),\n    FillNulls = Table.FillDown(\n        Table.ReplaceValue(PivotMonths, null, 0, Replacer.ReplaceValue,\n            Table.ColumnNames(PivotMonths)),\n        Table.ColumnNames(PivotMonths)\n    ),\n    MonthCols = List.Difference(\n        Table.ColumnNames(FillNulls), {\"Product\", \"Region\"}\n    ),\n    AddTotal = Table.AddColumn(\n        FillNulls,\n        \"Total\",\n        each List.Sum(List.Transform(MonthCols, (col) => Record.Field(_, col))),\n        type number\n    )\nin\n    AddTotal\n```\n\nPaste this into Power Query Advanced Editor. The pivot will use whatever month values exist in your data — no hardcoding required."
        },
        quiz: { question: "What is the best way to get accurate Power Query M code from Claude?", options: ["Just ask for 'a Power Query transformation'", "Describe your starting column names/types and the exact end result needed", "Paste existing M code and ask to improve it", "Ask for Python instead"], answer: 1 },
      },
      {
        id: "em-10",
        title: "Claude as Modelling Co-Pilot",
        concept: "The most effective way to use Claude in financial modelling is as a co-pilot throughout the build process — not just for individual formulas. Describe the section you're building, paste relevant formulas for review, ask for a logic check before moving to the next section. This catches structural errors early and accelerates the build.",
        tip: "After completing each tab of a model, paste a description of the logic and ask Claude 'what could go wrong with this approach?' — this is faster than a full model audit.",
        code: `# Co-pilot workflow
# Step 1: Design
"Here is my plan for the revenue tab.
Check the logic before I build it."

# Step 2: Formula review
"Here is my ARR bridge formula.
Does this correctly calculate net new ARR
from opening, new, expansion, and churn?"

# Step 3: Sanity check
"My model shows EBITDA margin improving from
8% to 24% over 3 years. Does this look
reasonable for a B2B SaaS business at £2M ARR?"

# Step 4: Output review
"Here is the summary output. What would a
PE investor or bank ask about these numbers?"`,
        codeLabel: "Co-pilot workflow stages",
        sim: {
          type: "StepsSim",
          steps: [
            "Design phase: describe the tab structure and ask Claude to check the logic before you build",
            "Formula phase: paste each formula and ask 'does this correctly calculate X?'",
            "Sanity check: ask if your outputs look reasonable vs industry benchmarks",
            "Output review: ask what questions an investor or bank would raise about the numbers",
            "Documentation: at the end, ask Claude to generate the assumptions dictionary and model summary",
          ],
        },
        quiz: { question: "When should you ask Claude to review your model logic?", options: ["Only at the end when it's finished", "Throughout the build — after each section, not just at the end", "Never — Claude can't check Excel logic", "Only when there is an error"], answer: 1 },
      },
    ],
  },
  {
    id: "api",
    icon: "⚙️",
    name: "API & Automation",
    desc: "Automate finance workflows using the Claude API and Python",
    lessons: [
      {
        id: "aa-1",
        title: "What the Claude API Is",
        concept: "The Claude API lets you send messages to Claude programmatically from Python, JavaScript, or any language — without using the chat interface. This means you can automate finance tasks: analyse a new P&L every month, generate commentary from a database, or process hundreds of documents overnight. You pay per token (input + output), not a flat subscription.",
        tip: "The API is most useful when you have a repeating task with changing data — monthly reports, weekly variance summaries, batch document analysis. One-off analysis is faster in the chat interface.",
        code: `# When to use the API vs the chat interface

# Use the chat interface for:
# - One-off analysis
# - Exploratory prompting
# - Testing new prompts

# Use the API for:
# - Repeating tasks with new data each time
# - Processing multiple documents automatically
# - Integrating Claude into your finance tools
# - Generating reports on a schedule

# API pricing (approximate):
# claude-haiku-4-5: ~$0.25 per million input tokens
# claude-sonnet-4-6: ~$3 per million input tokens
# 1 token ≈ 0.75 words
# A 1,000-word P&L + response ≈ $0.005 on Haiku`,
        codeLabel: "API vs chat interface guide",
        sim: {
          type: "TipsSim",
          tips: [
            "The API is billed per token — a monthly P&L analysis costs pennies",
            "Use claude-haiku-4-5 for simple extraction tasks — it's 10× cheaper than Sonnet",
            "Use claude-sonnet-4-6 for complex reasoning, multi-step analysis, and code generation",
            "The API has no memory between calls — each call is independent, so include all context in each request",
            "Start with the chat interface to develop your prompts, then automate with the API",
          ],
        },
        quiz: { question: "When is the Claude API most useful compared to the chat interface?", options: ["For one-off questions", "For repeating tasks where the same prompt runs on new data automatically", "For longer responses", "For better quality output"], answer: 1 },
      },
      {
        id: "aa-2",
        title: "Your First API Call",
        concept: "Making your first Claude API call requires three things: an API key from Anthropic, the anthropic Python library, and a message. The structure is simple: you send a list of messages (the same way you would in a chat) and Claude returns a response object. Getting this working is the foundation for all finance automation.",
        tip: "Store your API key in a .env file, never in your code. Use python-dotenv to load it. Never commit your API key to GitHub.",
        code: `import anthropic
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env file

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Summarise this P&L in 3 bullet points: Revenue £1.2M, COGS £480K, EBITDA £180K"
        }
    ]
)

print(message.content[0].text)`,
        codeLabel: "First API call",
        sim: {
          type: "CodeSim",
          label: "Terminal output",
          code: `$ python first_call.py

• Revenue of £1.2M delivers a 60% gross margin after £480K COGS.
• EBITDA of £180K represents a 15% margin — solid for a services business.
• The gap between gross profit (£720K) and EBITDA (£180K) implies £540K of operating expenses.

Process finished with exit code 0`,
        },
        quiz: { question: "Where should you store your Claude API key?", options: ["Directly in your Python code", "In a .env file, loaded with python-dotenv, never committed to GitHub", "In a spreadsheet", "In the README file"], answer: 1 },
      },
      {
        id: "aa-3",
        title: "System Prompts for Finance",
        concept: "A system prompt sets Claude's role, behaviour, and constraints for an entire session. For finance automation, the system prompt is where you define who Claude is (a CFO assistant, a variance analyst, a commentary writer) and what rules it must follow (currency, tone, format, data constraints). The user messages then just contain the data.",
        tip: "Write one strong system prompt per automation task and reuse it. The system prompt is the 'contract' between you and Claude — it keeps outputs consistent across every run.",
        code: `import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """
You are a financial analyst assistant for a UK manufacturing business.
Currency: GBP. Tone: professional and direct.
Always return output as structured markdown.
Rules:
- Only use data provided in the user message
- If data is missing, say so rather than assuming
- Flag any variance over £50K or ±10% for board attention
- Limit commentary to 3 paragraphs maximum
"""

def analyse_pl(pl_data: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": pl_data}]
    )
    return message.content[0].text`,
        codeLabel: "System prompt for finance automation",
        sim: {
          type: "TipsSim",
          tips: [
            "Define role, currency, tone, and output format in the system prompt",
            "Add data constraints: 'only use data provided — do not make assumptions'",
            "Include thresholds: 'flag variances over £X for board attention'",
            "Set output format once in the system prompt so every response matches",
            "One system prompt per task type — commentary writer, variance analyst, ratio calculator",
          ],
        },
        quiz: { question: "What should a finance automation system prompt always include?", options: ["A greeting", "Role, currency, output format, and data constraints", "The date", "A list of all finance terms"], answer: 1 },
      },
      {
        id: "aa-4",
        title: "Processing CSV Data",
        concept: "A common finance automation pattern is: read a CSV file, pass it to Claude for analysis, get structured output back. This replaces manual 'open file, review, write commentary' workflows with a script that runs in seconds. Claude handles moderate-sized datasets well when formatted as clean CSV or markdown tables.",
        tip: "For large datasets (>500 rows), aggregate in Pandas first, then pass the summary to Claude. Sending raw row-level data is inefficient and expensive in tokens.",
        code: `import anthropic
import pandas as pd

client = anthropic.Anthropic()

def analyse_monthly_sales(filepath: str) -> str:
    # Load and aggregate data
    df = pd.read_csv(filepath)
    df['Date'] = pd.to_datetime(df['Date'])

    # Summarise to avoid passing raw rows
    summary = df.groupby('Product').agg(
        Revenue=('Revenue', 'sum'),
        Units=('Units', 'sum'),
        AvgPrice=('Revenue', 'mean')
    ).reset_index()

    # Convert to markdown table for Claude
    table = summary.to_markdown(index=False)

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Analyse this monthly sales summary and identify the top 3 insights:\n\n{table}"
        }]
    )
    return message.content[0].text

result = analyse_monthly_sales("sales_april.csv")
print(result)`,
        codeLabel: "CSV analysis automation",
        sim: {
          type: "CodeSim",
          label: "Terminal output",
          code: `$ python analyse_sales.py

**Top 3 Insights — April Sales:**

1. **Product B drives 47% of revenue** despite only 31% of unit volume,
   indicating significantly higher average price or margin vs other products.
   This concentration warrants a risk review.

2. **Product D shows the highest unit volume** but the lowest revenue per unit
   at £8.40 average — pricing may be too aggressive or the product mix
   has shifted toward lower-value SKUs.

3. **Combined revenue is 8% below the March run-rate** based on the totals —
   worth comparing to budget before drawing conclusions on trend direction.`,
        },
        quiz: { question: "Before sending a large CSV to Claude, what should you do?", options: ["Send it as-is row by row", "Aggregate the data in Pandas first, then send the summary", "Convert it to PDF", "Split it into multiple files"], answer: 1 },
      },
      {
        id: "aa-5",
        title: "Monthly Report Generator",
        concept: "One of the highest-value finance automations is a monthly report generator — a script that reads your month-end data, calls Claude to write the commentary, and outputs a formatted report. Once built, it runs in under a minute and produces a first-draft board pack that previously took hours to write.",
        tip: "Use Python's string templates or f-strings to inject data into your prompts. Keep the prompt logic in a separate file from the data loading — this makes it easy to update the prompt without touching the data pipeline.",
        code: `import anthropic
from datetime import datetime

client = anthropic.Anthropic()

COMMENTARY_PROMPT = """
Write a professional monthly board commentary (3 paragraphs).
P1: Revenue and headline performance vs budget
P2: Margin and cost analysis
P3: Outlook and key risks for next month
Tone: direct, no jargon, under 200 words total.
"""

def generate_monthly_report(actuals: dict, budget: dict, context: str) -> str:
    data_block = f"""
Month: {datetime.now().strftime('%B %Y')}

Actuals vs Budget:
Revenue: £{actuals['revenue']:,.0f} (budget: £{budget['revenue']:,.0f})
Gross Margin: {actuals['gm_pct']:.1f}% (budget: {budget['gm_pct']:.1f}%)
EBITDA: £{actuals['ebitda']:,.0f} (budget: £{budget['ebitda']:,.0f})

Context: {context}
"""
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=COMMENTARY_PROMPT,
        messages=[{"role": "user", "content": data_block}]
    )
    return message.content[0].text`,
        codeLabel: "Monthly report generator",
        sim: {
          type: "StepsSim",
          steps: [
            "Load month-end data from your source (Excel, CSV, database, ERP export)",
            "Aggregate to the required level (monthly totals, not row-level)",
            "Inject data into your prompt template using f-strings",
            "Call the Claude API with your system prompt and data block",
            "Write the output to a file, email, or Google Doc for review and light editing",
          ],
        },
        quiz: { question: "What is the best architecture for a monthly report generator?", options: ["One big script with everything mixed together", "Separate the data loading, prompt template, and API call into distinct components", "Use a spreadsheet macro instead", "Call Claude manually each month"], answer: 1 },
      },
      {
        id: "aa-6",
        title: "Structured JSON Output",
        concept: "When you need Claude's output to feed into another system — a database, a dashboard, or another script — you need structured data, not prose. Asking Claude to return JSON gives you machine-readable output that can be parsed directly in Python. This is the pattern behind AI-powered finance data pipelines.",
        tip: "Always validate the JSON Claude returns before using it downstream. Use Python's json.loads() inside a try/except — Claude occasionally returns slightly malformed JSON on complex schemas.",
        code: `import anthropic
import json

client = anthropic.Anthropic()

def extract_financials(text: str) -> dict:
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""Extract the financial figures from this text.
Return ONLY valid JSON with this exact structure:
{{
  "revenue": number or null,
  "gross_margin_pct": number or null,
  "ebitda": number or null,
  "currency": "GBP" or "USD" or "EUR",
  "period": "string describing the period"
}}

Text: {text}"""
        }]
    )

    try:
        return json.loads(message.content[0].text)
    except json.JSONDecodeError:
        return {"error": "Could not parse response"}

result = extract_financials(
    "In FY2024, the company posted UK revenue of £8.4M "
    "with a gross margin of 61% and EBITDA of £1.1M."
)
print(result)`,
        codeLabel: "JSON extraction script",
        sim: {
          type: "CodeSim",
          label: "Terminal output",
          code: `$ python extract.py

{
  "revenue": 8400000,
  "gross_margin_pct": 61.0,
  "ebitda": 1100000,
  "currency": "GBP",
  "period": "FY2024"
}`,
        },
        quiz: { question: "Why should you wrap JSON parsing in a try/except block?", options: ["To make the code run faster", "Because Claude occasionally returns slightly malformed JSON and you need to handle the error gracefully", "Because JSON is slow to parse", "To validate the business logic"], answer: 1 },
      },
      {
        id: "aa-7",
        title: "Batch Analysis",
        concept: "Finance teams often need to analyse the same type of data across multiple companies, departments, or time periods. Rather than analysing each one manually, a batch script passes each dataset to Claude in sequence (or in parallel) and collects all the outputs. This scales analysis that would take days to run in minutes.",
        tip: "Add a delay between API calls if processing many documents — Anthropic has rate limits. Use time.sleep(0.5) between calls or implement exponential backoff for production scripts.",
        code: `import anthropic
import time
import pandas as pd

client = anthropic.Anthropic()

companies = [
    {"name": "Alpha Ltd",   "revenue": 2100000, "ebitda": 252000,  "gm_pct": 65},
    {"name": "Beta Corp",   "revenue": 890000,  "ebitda": -42000,  "gm_pct": 48},
    {"name": "Gamma PLC",   "revenue": 5400000, "ebitda": 918000,  "gm_pct": 71},
]

results = []

for company in companies:
    prompt = f"""
    Analyse this company in 2 sentences. Flag any red flags.
    Company: {company['name']}
    Revenue: £{company['revenue']:,.0f}
    EBITDA: £{company['ebitda']:,.0f} ({company['ebitda']/company['revenue']*100:.1f}% margin)
    Gross Margin: {company['gm_pct']}%
    """

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}]
    )

    results.append({
        "company": company['name'],
        "analysis": message.content[0].text
    })

    time.sleep(0.5)  # rate limit protection

for r in results:
    print(f"\n{r['company']}:\n{r['analysis']}")`,
        codeLabel: "Batch company analysis",
        sim: {
          type: "CodeSim",
          label: "Terminal output",
          code: `Alpha Ltd:
Revenue of £2.1M with a 65% gross margin and 12% EBITDA margin
shows a healthy, efficient operation. No red flags — solid unit economics.

Beta Corp:
Gross margin of 48% is below typical service business benchmarks,
and negative EBITDA of -£42K signals the business is burning cash.
Red flag: immediate review of cost structure required.

Gamma PLC:
Strong performance — 71% gross margin and 17% EBITDA margin on
£5.4M revenue indicates excellent operational leverage. No red flags.`,
        },
        quiz: { question: "Why should you add time.sleep() between batch API calls?", options: ["To make the output cleaner", "To avoid hitting Anthropic's rate limits when processing many requests", "To save money", "To improve accuracy"], answer: 1 },
      },
      {
        id: "aa-8",
        title: "Streamlit + Claude Chatbot",
        concept: "Combining Streamlit (for the UI) with the Claude API (for intelligence) lets you build a private, self-hosted finance chatbot that your team can use to query financial data in natural language. This is a powerful alternative to expensive BI tools for teams with a developer or a willingness to learn Python.",
        tip: "Maintain conversation history in st.session_state so Claude remembers the context of the conversation — without this each message starts fresh.",
        code: `import streamlit as st
import anthropic

client = anthropic.Anthropic()

st.title("FinancePlots AI Assistant")

SYSTEM_PROMPT = """
You are a finance assistant for our company.
Help with P&L analysis, variance questions, and financial planning.
Currency: GBP. Be concise and professional.
"""

if "messages" not in st.session_state:
    st.session_state.messages = []

# Display history
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# User input
if prompt := st.chat_input("Ask about your finances..."):
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user"):
        st.write(prompt)

    # Call Claude
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=st.session_state.messages
    )

    reply = response.content[0].text
    st.session_state.messages.append({"role": "assistant", "content": reply})

    with st.chat_message("assistant"):
        st.write(reply)`,
        codeLabel: "Streamlit + Claude chatbot",
        sim: {
          type: "TipsSim",
          tips: [
            "st.session_state.messages maintains conversation history across interactions",
            "Pass the full message history to Claude each time — this is how it remembers context",
            "Use st.chat_input() for the input box and st.chat_message() for styled bubbles",
            "Deploy on Railway or Streamlit Cloud — add password protection with st.text_input for a PIN",
            "Pre-load financial data into the system prompt so Claude can answer questions about your specific business",
          ],
        },
        quiz: { question: "How does a Streamlit + Claude chatbot maintain conversation memory?", options: ["Claude remembers automatically", "Message history is stored in st.session_state and passed to Claude each time", "It uses a database", "It doesn't — each message is independent"], answer: 1 },
      },
      {
        id: "aa-9",
        title: "Managing Costs and Rate Limits",
        concept: "The Claude API is cheap for occasional use but costs can grow if you're processing large volumes or using expensive models for simple tasks. The main levers are: choosing the right model for the task, caching repeated context, aggregating before sending, and monitoring token usage. A well-optimised finance automation costs pennies per run.",
        tip: "Use claude-haiku-4-5 for extraction and classification tasks. Reserve claude-sonnet-4-6 for complex reasoning and report writing. The cost difference is ~10×.",
        code: `import anthropic

client = anthropic.Anthropic()

# COST OPTIMISATION PATTERNS

# 1. Right model for the task
# Extraction/classification → Haiku (~$0.25/M tokens)
# Analysis/commentary → Sonnet (~$3/M tokens)

# 2. Check token usage
message = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=256,
    messages=[{"role": "user", "content": "Summarise: Revenue £1M, EBITDA £100K"}]
)
print(f"Input tokens: {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")
cost = (message.usage.input_tokens / 1_000_000 * 0.25) + \
       (message.usage.output_tokens / 1_000_000 * 1.25)
print(f"Estimated cost: \${cost:.6f}")

# 3. Set max_tokens appropriately
# Don't use max_tokens=4096 for a 50-word summary
# Match max_tokens to expected output length`,
        codeLabel: "Cost optimisation patterns",
        sim: {
          type: "StepsSim",
          steps: [
            "Use Haiku for simple extraction and classification — 10× cheaper than Sonnet",
            "Use Sonnet for complex analysis, report writing, and code generation",
            "Aggregate data before sending — fewer tokens = lower cost",
            "Set max_tokens to match expected output length — don't leave it at 4096 for short responses",
            "Log token usage per run to track monthly spend and spot unexpected cost spikes",
          ],
        },
        quiz: { question: "Which model should you use for simple data extraction tasks?", options: ["Always claude-sonnet-4-6 for quality", "claude-haiku-4-5 — it is 10× cheaper and sufficient for extraction tasks", "claude-opus-4-6 for accuracy", "The model doesn't affect cost"], answer: 1 },
      },
      {
        id: "aa-10",
        title: "Complete Finance Automation Pipeline",
        concept: "A complete finance automation pipeline reads source data, processes it, calls Claude for analysis and commentary, and delivers output to its destination — all without manual intervention. Building one end-to-end system, even a simple one, is the best way to understand how all the pieces fit together and where the value is.",
        tip: "Start with the simplest possible version: one data source, one Claude call, one output file. Get it working end-to-end before adding complexity.",
        code: `import anthropic
import pandas as pd
from datetime import datetime
from pathlib import Path

client = anthropic.Anthropic()

SYSTEM = """You are a CFO assistant. Write concise, professional
financial commentary in GBP. Use only provided data."""

def run_monthly_pipeline(data_path: str, output_path: str):
    # 1. LOAD DATA
    df = pd.read_csv(data_path)

    # 2. AGGREGATE
    month_data = {
        "revenue": df['revenue'].sum(),
        "cogs": df['cogs'].sum(),
        "opex": df['opex'].sum(),
    }
    month_data['gross_profit'] = month_data['revenue'] - month_data['cogs']
    month_data['ebitda'] = month_data['gross_profit'] - month_data['opex']
    month_data['gm_pct'] = month_data['gross_profit'] / month_data['revenue'] * 100

    # 3. BUILD PROMPT
    prompt = f"""
Month: {datetime.now().strftime('%B %Y')}
Revenue: £{month_data['revenue']:,.0f}
Gross Margin: {month_data['gm_pct']:.1f}%
EBITDA: £{month_data['ebitda']:,.0f}

Write a 2-paragraph board commentary.
"""

    # 4. CALL CLAUDE
    message = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=512,
        system=SYSTEM, messages=[{"role": "user", "content": prompt}]
    )
    commentary = message.content[0].text

    # 5. WRITE OUTPUT
    Path(output_path).write_text(commentary)
    print(f"Report written to {output_path}")
    return commentary

run_monthly_pipeline("april_data.csv", "april_report.txt")`,
        codeLabel: "Complete automation pipeline",
        sim: {
          type: "StepsSim",
          steps: [
            "Step 1 — Load: read source data from CSV, Excel, database, or API",
            "Step 2 — Aggregate: use Pandas to compute monthly totals and ratios",
            "Step 3 — Prompt: inject aggregated data into your prompt template",
            "Step 4 — Call: send to Claude with the right model and system prompt",
            "Step 5 — Output: write commentary to file, email, Slack, or Google Docs",
            "Step 6 — Schedule: run automatically on the 1st of each month with a cron job or GitHub Action",
          ],
        },
        quiz: { question: "What is the recommended approach to building a finance automation pipeline?", options: ["Build the full complex system from the start", "Start with the simplest version end-to-end, then add complexity", "Use a different tool", "Automate everything at once"], answer: 1 },
      },
    ],
  },
  {
    id: "mcp",
    icon: "🔌",
    name: "Skills & MCP",
    desc: "Extend Claude with tools, data connections and custom capabilities",
    lessons: [
      {
        id: "mcp-1",
        title: "What Are Claude Skills",
        concept: "Claude Skills (also called tools or tool use) are custom capabilities you give Claude so it can take actions beyond generating text — like reading a file, querying a database, calling an API, or running a calculation. In the chat interface, Anthropic provides built-in skills like web search. When you use the API, you define your own skills that Claude can call during a conversation.",
        tip: "Think of skills as functions Claude can choose to call when it decides they are needed. You define what the function does — Claude decides when to use it based on the user's request.",
        code: `# The concept of skills / tool use

# Without skills: Claude can only generate text
# "What is the current EUR/GBP rate?" → Claude guesses or says it doesn't know

# With a currency skill: Claude calls your function
# "What is the current EUR/GBP rate?" → Claude calls get_exchange_rate("EUR", "GBP")
#                                      → Your function fetches the live rate
#                                      → Claude uses the real number in its response

# Skills let Claude:
# - Read live data (stock prices, FX rates, your database)
# - Write data (save a report, update a spreadsheet)
# - Run calculations (your custom financial models)
# - Call external APIs (your ERP, CRM, accounting software)
# - Execute code (Python calculations, data transformations)`,
        codeLabel: "Skills concept overview",
        sim: {
          type: "TipsSim",
          tips: [
            "Skills = functions Claude can call. You write the function, Claude decides when to use it",
            "Claude sees a description of each skill and chooses the right one based on the user's message",
            "Skills run on your infrastructure — Claude never directly accesses your data, it calls your function",
            "You can give Claude multiple skills and it will chain them together as needed",
            "Built-in Claude.ai skills: web search, file reading, code execution. API skills: whatever you build",
          ],
        },
        quiz: { question: "What is a Claude skill?", options: ["A special Claude model with extra training", "A custom function Claude can call to take actions beyond generating text", "A Claude subscription feature", "A type of prompt template"], answer: 1 },
      },
      {
        id: "mcp-2",
        title: "Defining a Custom Skill",
        concept: "To give Claude a custom skill via the API, you define it as a JSON schema describing the function name, what it does, and what parameters it takes. Claude reads this description and decides when to call the skill. Your code then executes the actual function and returns the result to Claude, which incorporates it into its response.",
        tip: "Write the skill description as if explaining it to a smart colleague — clear, specific, and including when it should and shouldn't be used. Claude's decision to call the skill depends entirely on how well you describe it.",
        code: `import anthropic
import json

client = anthropic.Anthropic()

# 1. Define the skill schema
tools = [
    {
        "name": "get_pl_summary",
        "description": "Retrieves the P&L summary for a given month and year from the finance database. Use this when the user asks about revenue, costs, margin or EBITDA for a specific period.",
        "input_schema": {
            "type": "object",
            "properties": {
                "month": {"type": "integer", "description": "Month number (1-12)"},
                "year":  {"type": "integer", "description": "4-digit year e.g. 2024"}
            },
            "required": ["month", "year"]
        }
    }
]

# 2. Your actual function (fetches real data)
def get_pl_summary(month: int, year: int) -> dict:
    # In production: query your database or ERP
    return {"revenue": 1240000, "ebitda": 186000, "gm_pct": 60.0,
            "month": month, "year": year}

# 3. Call Claude with the tool
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What was our EBITDA in March 2024?"}]
)
print(response.stop_reason)  # "tool_use" if Claude wants to call the skill`,
        codeLabel: "Custom skill definition",
        sim: {
          type: "StepsSim",
          steps: [
            "Define the skill as a JSON schema with name, description, and input parameters",
            "Write the actual Python function that does the work (database query, API call, calculation)",
            "Pass the skill definitions to Claude via the tools parameter in the API call",
            "Check if stop_reason is 'tool_use' — Claude is asking you to run the function",
            "Execute the function with Claude's chosen parameters and return the result",
            "Call Claude again with the function result — it will incorporate it into the final response",
          ],
        },
        quiz: { question: "What does Claude do when it decides to use a skill?", options: ["It executes the function itself", "It returns a tool_use stop reason with the function name and parameters it wants called", "It asks the user for permission", "It generates a code snippet"], answer: 1 },
      },
      {
        id: "mcp-3",
        title: "Handling Tool Calls",
        concept: "When Claude decides to call a skill, it stops generating and returns a tool_use block containing the function name and parameters. Your code runs the function, then sends the result back to Claude in a tool_result message. Claude then continues generating the final response incorporating the real data. This back-and-forth is called the tool use loop.",
        tip: "Always handle the case where Claude's chosen parameters are invalid — validate inputs before running the function and return a clear error message in the tool_result if something is wrong.",
        code: `import anthropic, json

client = anthropic.Anthropic()

def run_tool(name: str, params: dict) -> str:
    if name == "get_pl_summary":
        data = get_pl_summary(**params)
        return json.dumps(data)
    return json.dumps({"error": f"Unknown tool: {name}"})

def chat_with_tools(user_message: str, tools: list) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=tools,
            messages=messages
        )

        if response.stop_reason == "end_turn":
            # Claude finished — extract text response
            return next(b.text for b in response.content if hasattr(b, "text"))

        if response.stop_reason == "tool_use":
            # Claude wants to call a tool
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = run_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })
            messages.append({"role": "user", "content": tool_results})`,
        codeLabel: "Tool use loop",
        sim: {
          type: "StepsSim",
          steps: [
            "Send user message to Claude with tools defined",
            "Claude returns stop_reason='tool_use' with the function name and parameters",
            "Your code runs the function with Claude's parameters",
            "Send the result back to Claude as a tool_result message",
            "Claude continues and may call another tool or return the final answer",
            "Loop until stop_reason='end_turn' — Claude is done",
          ],
        },
        quiz: { question: "What does stop_reason='tool_use' mean?", options: ["An error occurred", "Claude wants you to run a function and return the result to it", "Claude has finished responding", "The API rate limit was hit"], answer: 1 },
      },
      {
        id: "mcp-4",
        title: "What Is MCP",
        concept: "MCP (Model Context Protocol) is an open standard created by Anthropic that defines how AI models connect to external data sources and tools. Instead of writing custom API integrations for every data source, you build or install an MCP server — and any MCP-compatible AI client (Claude Desktop, Claude Code, custom apps) can connect to it. It's like a USB standard for AI data connections.",
        tip: "MCP is the infrastructure layer — it handles the connection protocol. Skills/tools are what Claude can do through that connection. Think of MCP as the wire and skills as the electricity flowing through it.",
        code: `# MCP in plain English

# BEFORE MCP (bespoke integrations):
# - Claude API app <--custom code--> your database
# - Claude API app <--custom code--> your ERP
# - Claude API app <--custom code--> your Excel files
# Each integration is built from scratch

# WITH MCP (standardised protocol):
# - Claude Desktop <--MCP--> database MCP server
# - Claude Desktop <--MCP--> ERP MCP server
# - Claude Desktop <--MCP--> filesystem MCP server
# Any MCP client connects to any MCP server

# Key components:
# MCP Host    = the AI app (Claude Desktop, your app)
# MCP Client  = connection manager inside the host
# MCP Server  = the thing that exposes your data/tools
# Transport   = how they communicate (stdio, HTTP/SSE)`,
        codeLabel: "MCP architecture overview",
        sim: {
          type: "TipsSim",
          tips: [
            "MCP is a protocol — like HTTP for web pages, but for AI-to-data connections",
            "MCP Server = exposes your data or tools. MCP Client = the AI app consuming them",
            "Pre-built MCP servers exist for: file systems, databases, GitHub, Slack, Google Drive, and more",
            "You can build a custom MCP server in Python or TypeScript to connect Claude to any data source",
            "MCP-compatible clients include: Claude Desktop, Claude Code, and any app using the MCP SDK",
          ],
        },
        quiz: { question: "What problem does MCP solve?", options: ["It makes Claude faster", "It standardises how AI models connect to external data and tools, eliminating bespoke integrations", "It improves Claude's accuracy", "It reduces API costs"], answer: 1 },
      },
      {
        id: "mcp-5",
        title: "MCP in Claude Desktop",
        concept: "Claude Desktop is the easiest way to experience MCP. You configure MCP servers in a JSON config file and Claude Desktop connects to them automatically. Once connected, Claude can read your local files, query databases, search the web, or call any tool the MCP server exposes — all without writing any API code yourself.",
        tip: "Start with the official filesystem MCP server — it lets Claude read and write files on your machine. This alone transforms Claude Desktop into a powerful local data analyst.",
        code: `// Claude Desktop config file
// Location: ~/Library/Application Support/Claude/claude_desktop_config.json (Mac)
// Location: %APPDATA%/Claude/claude_desktop_config.json (Windows)

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents/Finance"
      ]
    },
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "/path/to/finance.db"]
    }
  }
}

// After saving this file and restarting Claude Desktop:
// Claude can now read your Finance folder and query your SQLite database
// Just ask: "Read the Q1 budget file and summarise the key numbers"`,
        codeLabel: "Claude Desktop MCP config",
        sim: {
          type: "StepsSim",
          steps: [
            "Install Claude Desktop from claude.ai/download",
            "Open the config file: %APPDATA%/Claude/claude_desktop_config.json on Windows",
            "Add MCP server entries — filesystem, database, or any published MCP server",
            "Save the config and restart Claude Desktop",
            "Claude now has access to the connected data sources — just ask it questions about them",
            "Test with: 'List the files in my Finance folder' or 'Query the database for this month's revenue'",
          ],
        },
        quiz: { question: "How do you connect an MCP server to Claude Desktop?", options: ["Download a plugin", "Add the server configuration to claude_desktop_config.json and restart", "Write API integration code", "Email Anthropic"], answer: 1 },
      },
      {
        id: "mcp-6",
        title: "Build Your First MCP Server",
        concept: "Building a custom MCP server in Python takes about 30 lines of code using the official MCP SDK. You define tools (functions Claude can call) and resources (data Claude can read), and the SDK handles all the protocol communication. A simple finance MCP server can expose your P&L data, budget files, or live calculations to Claude.",
        tip: "Start with read-only tools — functions that return data. Add write tools (saving reports, updating cells) only once your read tools are working correctly.",
        code: `# Install: pip install mcp

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types
import json

app = Server("finance-server")

# Mock data — replace with your real database or file
PL_DATA = {
    "2024-04": {"revenue": 1240000, "ebitda": 186000, "gm_pct": 60.0},
    "2024-05": {"revenue": 1180000, "ebitda": 142000, "gm_pct": 59.2},
}

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="get_monthly_pl",
            description="Get P&L data for a specific month. Use format YYYY-MM.",
            inputSchema={
                "type": "object",
                "properties": {
                    "period": {"type": "string", "description": "Period in YYYY-MM format"}
                },
                "required": ["period"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "get_monthly_pl":
        period = arguments["period"]
        data = PL_DATA.get(period, {"error": "Period not found"})
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

if __name__ == "__main__":
    import asyncio
    asyncio.run(stdio_server(app))`,
        codeLabel: "Simple finance MCP server",
        sim: {
          type: "CodeSim",
          label: "Claude asking your MCP server",
          code: `User: What was our EBITDA margin in April 2024?

[Claude calls get_monthly_pl with period="2024-04"]

MCP Server returns:
{
  "revenue": 1240000,
  "ebitda": 186000,
  "gm_pct": 60.0
}

Claude: April 2024 EBITDA was £186,000, representing a 15%
margin on revenue of £1.24M. Gross margin held at 60%.`,
        },
        quiz: { question: "What are the two main things you define in an MCP server?", options: ["Models and prompts", "Tools (functions Claude can call) and resources (data Claude can read)", "Clients and hosts", "APIs and webhooks"], answer: 1 },
      },
      {
        id: "mcp-7",
        title: "MCP for Finance Data",
        concept: "For finance professionals, the most valuable MCP servers connect Claude to your actual financial data — Excel files, CSV exports, accounting software databases, or ERP systems. Once connected, Claude becomes a conversational interface to your finance data: you ask questions in plain English and Claude queries the right source, calculates the answer, and explains it.",
        tip: "Build one MCP tool per data domain: one for P&L, one for cash flow, one for budget. Keep tools focused — Claude performs better when each tool has a single clear purpose.",
        code: `# Finance MCP server with multiple tools

import pandas as pd
from mcp.server import Server
from mcp import types
import json

app = Server("finance-data-server")

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="read_budget_file",
            description="Reads the annual budget Excel file and returns data for a given department or all departments.",
            inputSchema={"type": "object", "properties": {
                "department": {"type": "string", "description": "Department name, or 'all' for total"}
            }, "required": ["department"]}
        ),
        types.Tool(
            name="get_variance_report",
            description="Calculates actual vs budget variance for a given month.",
            inputSchema={"type": "object", "properties": {
                "month": {"type": "integer"},
                "year":  {"type": "integer"}
            }, "required": ["month", "year"]}
        ),
        types.Tool(
            name="calculate_runway",
            description="Calculates cash runway in months given current cash and monthly burn rate.",
            inputSchema={"type": "object", "properties": {
                "cash_balance": {"type": "number"},
                "monthly_burn": {"type": "number"}
            }, "required": ["cash_balance", "monthly_burn"]}
        ),
    ]`,
        codeLabel: "Multi-tool finance MCP server",
        sim: {
          type: "PromptSim",
          prompt: "We have £340K in the bank and we're burning £42K per month. How long is our runway and what happens if burn increases by 20%?",
          response: "[Claude calls calculate_runway with cash_balance=340000, monthly_burn=42000]\n\nAt your current burn rate of £42K/month, you have approximately 8.1 months of runway (£340K ÷ £42K).\n\nIf burn increases by 20% to £50.4K/month, runway falls to 6.7 months — a reduction of 1.4 months.\n\nAt 8 months you should be raising or cutting costs now. The standard rule is to start a fundraise or restructuring process when you have 6 months of runway remaining — which at current burn is approximately 2 months from today.\n\nRecommendation: model three scenarios — hold burn flat, reduce by 15%, and the 20% increase — to stress test your options before the board meeting."
        },
        quiz: { question: "What is the best way to structure finance tools in an MCP server?", options: ["One large tool that does everything", "One tool per data domain with a single clear purpose each", "As many tools as possible", "Mirror your database table structure exactly"], answer: 1 },
      },
      {
        id: "mcp-8",
        title: "MCP Resources",
        concept: "In addition to tools (functions Claude calls), MCP servers can expose resources — static or dynamic data that Claude can read directly, like a file, a database table, or a document. Resources work like URLs: Claude requests them by URI and gets the content back. This is ideal for exposing reference data like your chart of accounts, budget templates, or company policies.",
        tip: "Use resources for reference data that doesn't change often (chart of accounts, budget headers). Use tools for live queries (this month's actuals, current cash balance).",
        code: `from mcp.server import Server
from mcp import types

app = Server("finance-resources-server")

CHART_OF_ACCOUNTS = """
1000 - Cash and Cash Equivalents
1100 - Accounts Receivable
2000 - Revenue
2100 - Product Revenue
2200 - Service Revenue
3000 - Cost of Goods Sold
4000 - Operating Expenses
4100 - Sales & Marketing
4200 - Research & Development
4300 - General & Administrative
5000 - EBITDA
"""

@app.list_resources()
async def list_resources() -> list[types.Resource]:
    return [
        types.Resource(
            uri="finance://chart-of-accounts",
            name="Chart of Accounts",
            description="Company chart of accounts with account codes",
            mimeType="text/plain"
        ),
        types.Resource(
            uri="finance://budget-assumptions",
            name="FY2025 Budget Assumptions",
            description="Key assumptions behind the FY2025 budget model",
            mimeType="text/plain"
        ),
    ]

@app.read_resource()
async def read_resource(uri: str) -> str:
    if uri == "finance://chart-of-accounts":
        return CHART_OF_ACCOUNTS
    return "Resource not found"`,
        codeLabel: "MCP resources example",
        sim: {
          type: "TipsSim",
          tips: [
            "Resources are like files — Claude reads them when it needs reference information",
            "Tools are like functions — Claude calls them to get live data or perform actions",
            "Use resources for: chart of accounts, budget templates, company policies, glossaries",
            "Use tools for: live queries, calculations, data writes, API calls",
            "Claude will automatically read relevant resources when answering questions about your business",
          ],
        },
        quiz: { question: "When should you use MCP resources instead of tools?", options: ["Always — resources are better", "For reference data that doesn't change often, like a chart of accounts", "For live database queries", "For calculations"], answer: 1 },
      },
      {
        id: "mcp-9",
        title: "Skills vs MCP — When to Use Each",
        concept: "Skills (API tool use) and MCP are both ways to extend Claude with external capabilities, but they serve different use cases. API tool use is best for building your own application where you control the full stack. MCP is best for connecting Claude Desktop or other MCP clients to your data without building a full application. They can also be combined.",
        tip: "If you are building a product that others will use, use the API with tool definitions. If you are connecting Claude Desktop to your own data for personal or team use, build an MCP server.",
        code: `# Decision guide: Skills (API) vs MCP

# USE API TOOL USE when:
# - You are building an application for others to use
# - You need full control over the conversation flow
# - You are embedding Claude into an existing product
# - You need authentication / multi-user support
# Example: a finance chatbot on your company intranet

# USE MCP when:
# - You want to connect Claude Desktop to your data
# - You want other MCP-compatible tools to reuse the connection
# - You are building for personal or small team use
# - You want a plug-and-play integration with minimal code
# Example: connecting Claude Desktop to your finance database

# USE BOTH when:
# - Your MCP server is used by Claude Desktop (your team)
# - Your API app uses the same underlying data layer
# - You want maximum flexibility and reuse
# Example: MCP server for the finance team + API app for clients`,
        codeLabel: "Skills vs MCP decision guide",
        sim: {
          type: "StepsSim",
          steps: [
            "Building a product for others → use the Claude API with tool definitions",
            "Connecting Claude Desktop to your data → build an MCP server",
            "Need authentication and user accounts → Claude API (MCP has no auth layer by default)",
            "Want Claude Code or Claude Desktop to access your data → MCP server",
            "Need both personal use and a product → build an MCP server, wrap it in an API app",
            "Not sure → start with the API and migrate to MCP if you need Claude Desktop integration",
          ],
        },
        quiz: { question: "What is the key deciding factor between API tool use and MCP?", options: ["Cost", "Whether you're building a product for others (API) or connecting Claude Desktop to your data (MCP)", "Speed", "The programming language"], answer: 1 },
      },
      {
        id: "mcp-10",
        title: "Finance MCP Ecosystem",
        concept: "A finance MCP ecosystem connects all your data sources to Claude through a set of coordinated MCP servers. Claude becomes your conversational CFO dashboard — you ask questions across your P&L, cash position, budget, and market data without switching between tools. This is the end state of AI-augmented finance operations.",
        tip: "Build incrementally: start with one MCP server for your most-used data source. Add servers one at a time as you validate each one. A working single-server setup beats a broken multi-server plan.",
        code: `# Full finance MCP ecosystem config (Claude Desktop)
{
  "mcpServers": {
    "finance-db": {
      "command": "python",
      "args": ["/finance/mcp_servers/finance_db_server.py"],
      "description": "Live P&L, cash flow and budget data"
    },
    "documents": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/Finance/Documents"],
      "description": "Board packs, contracts, reports"
    },
    "market-data": {
      "command": "python",
      "args": ["/finance/mcp_servers/market_data_server.py"],
      "description": "FX rates, stock prices, indices"
    },
    "models": {
      "command": "python",
      "args": ["/finance/mcp_servers/excel_models_server.py"],
      "description": "Financial models and budget templates"
    }
  }
}
# Result: ask Claude anything about your business
# "What's our runway at current burn vs the budget?"
# "Summarise the board pack from last quarter"
# "What's the EUR/GBP impact on our Q3 revenue?"`,
        codeLabel: "Full finance MCP ecosystem config",
        sim: {
          type: "PromptSim",
          prompt: "Compare our actual EBITDA margin this month to the budget, and tell me what the EUR/GBP rate movement means for our Q3 export revenue.",
          response: "[Claude calls finance-db → get_monthly_actuals, get_budget_target]\n[Claude calls market-data → get_fx_rate('EUR', 'GBP')]\n\nActual EBITDA this month: £142K (11.4% margin) vs budget of £168K (13.5%) — a 2.1pp shortfall driven by the S&M overspend we flagged last week.\n\nOn FX: EUR/GBP is currently at 0.847, compared to the 0.862 assumption in your Q3 budget. For your £380K of EUR-denominated export revenue, this 1.5% rate movement reduces the GBP equivalent by approximately £5,700 — not material enough to flag separately but worth noting in the Q3 commentary if the rate stays here.\n\nCombined impact: EBITDA miss plus FX headwind puts Q3 tracking approximately £31K below plan on a run-rate basis."
        },
        quiz: { question: "What is the recommended approach to building a finance MCP ecosystem?", options: ["Build all servers at once for maximum capability", "Start with one server for your most-used data source, add incrementally", "Use only pre-built MCP servers", "Build the most complex server first"], answer: 1 },
      },
    ],
  },
];

// ── Helper: flatten all lessons ───────────────────────────────────────────────

function allLessons(): Lesson[] {
  return MODULES.flatMap(m => m.lessons);
}

// ── Sim components ────────────────────────────────────────────────────────────

function PromptSimBlock({ sim }: { sim: PromptSim }) {
  return (
    <div className="space-y-3">
      <div className="bg-[#0a0f1e] border border-gray-700 rounded-xl p-4">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Your Prompt</p>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">{sim.prompt}</p>
      </div>
      <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4">
        <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Claude&apos;s Response</p>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{sim.response}</p>
      </div>
    </div>
  );
}

function SimBlock({ sim }: { sim: Sim }) {
  if (sim.type === "PromptSim") return <PromptSimBlock sim={sim} />;

  if (sim.type === "TipsSim") {
    return (
      <div className="space-y-2">
        {sim.tips.map((tip, i) => (
          <div key={i} className="flex gap-2 items-start bg-purple-900/10 border border-purple-500/20 rounded-lg px-3 py-2">
            <span className="text-purple-400 font-bold text-sm shrink-0">✓</span>
            <span className="text-gray-300 text-sm">{tip}</span>
          </div>
        ))}
      </div>
    );
  }

  if (sim.type === "StepsSim") {
    return (
      <ol className="space-y-2">
        {sim.steps.map((step, i) => (
          <li key={i} className="flex gap-3 items-start bg-[#0a0f1e] border border-gray-800 rounded-lg px-3 py-2">
            <span className="text-purple-400 font-bold text-sm shrink-0 mt-0.5">{i + 1}.</span>
            <span className="text-gray-300 text-sm">{step}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (sim.type === "CodeSim") {
    return (
      <div className="bg-[#0a0f1e] border border-gray-800 rounded-xl overflow-hidden">
        {sim.label && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 bg-[#070d1a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-gray-500 ml-1">{sim.label}</span>
          </div>
        )}
        <pre className="p-4 text-xs text-green-400 font-mono overflow-x-auto leading-relaxed">
          <code>{sim.code}</code>
        </pre>
      </div>
    );
  }

  return null;
}

// ── Quiz widget ───────────────────────────────────────────────────────────────

function QuizWidget({ quiz }: { quiz: Lesson["quiz"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="bg-[#0a0f1e] border border-gray-800 rounded-xl p-5">
      <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-3">Quick Quiz</p>
      <p className="text-white font-semibold text-sm mb-4">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          const isCorrect = i === quiz.answer;
          const isSelected = i === selected;
          let cls = "border-gray-700 text-gray-300 hover:border-purple-500 hover:text-white cursor-pointer";
          if (answered) {
            if (isCorrect) cls = "border-green-500 bg-green-500/10 text-green-300 cursor-default";
            else if (isSelected) cls = "border-red-500 bg-red-500/10 text-red-300 cursor-default";
            else cls = "border-gray-800 text-gray-600 cursor-default";
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className={`mt-3 text-sm font-semibold ${selected === quiz.answer ? "text-green-400" : "text-red-400"}`}>
          {selected === quiz.answer ? "Correct!" : `Incorrect — the answer is: ${quiz.options[quiz.answer]}`}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ClaudeFinanceClient() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cf-completed");
      if (saved) setCompleted(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const mod = MODULES[activeModule];
  const lesson = mod.lessons[activeLesson];
  const totalLessons = allLessons().length;
  const completedCount = completed.size;

  function markComplete(id: string) {
    const next = new Set(completed);
    next.add(id);
    setCompleted(next);
    try { localStorage.setItem("cf-completed", JSON.stringify([...next])); } catch {}
  }

  function goNext() {
    if (activeLesson < mod.lessons.length - 1) {
      markComplete(lesson.id);
      setActiveLesson(l => l + 1);
    } else if (activeModule < MODULES.length - 1) {
      markComplete(lesson.id);
      setActiveModule(m => m + 1);
      setActiveLesson(0);
    }
  }

  function goPrev() {
    if (activeLesson > 0) setActiveLesson(l => l - 1);
    else if (activeModule > 0) {
      setActiveModule(m => m - 1);
      setActiveLesson(MODULES[activeModule - 1].lessons.length - 1);
    }
  }

  const isFirst = activeModule === 0 && activeLesson === 0;
  const isLast  = activeModule === MODULES.length - 1 && activeLesson === mod.lessons.length - 1;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <Link href="/learn" className="text-xs text-gray-500 hover:text-gray-300 transition mb-4 inline-block">
            ← Back to Learn
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">FinancePlots Academy</p>
              <h1 className="text-3xl font-extrabold text-white">Claude for Finance</h1>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm text-gray-500">
              <span><span className="text-purple-400 font-bold">{completedCount}</span> / {totalLessons} lessons</span>
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(completedCount / totalLessons) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Module tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {MODULES.map((m, mi) => {
            const modCompleted = m.lessons.filter(l => completed.has(l.id)).length;
            return (
              <button
                key={m.id}
                onClick={() => { setActiveModule(mi); setActiveLesson(0); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                  activeModule === mi
                    ? "bg-purple-600/20 border border-purple-500/50 text-purple-300"
                    : "border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
                <span className="text-xs opacity-60">{modCompleted}/{m.lessons.length}</span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-[#0d1426] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{mod.name}</p>
              </div>
              <div className="py-2">
                {mod.lessons.map((l, li) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLesson(li)}
                    className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm transition ${
                      activeLesson === li ? "text-white bg-purple-600/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border text-xs flex items-center justify-center shrink-0 ${
                      completed.has(l.id) ? "bg-purple-500 border-purple-500 text-white" : "border-gray-600"
                    }`}>
                      {completed.has(l.id) ? "✓" : ""}
                    </span>
                    <span className="truncate">{l.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Lesson content */}
          <div className="space-y-6">
            <div className="bg-[#0d1426] border border-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  {mod.name}
                </span>
                <span className="text-xs text-gray-600">Lesson {activeLesson + 1} of {mod.lessons.length}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-4">{lesson.title}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{lesson.concept}</p>

              {/* Tip */}
              <div className="flex gap-3 bg-purple-900/15 border border-purple-500/20 rounded-xl p-4 mb-6">
                <span className="text-purple-400 text-lg shrink-0">💡</span>
                <p className="text-purple-200 text-sm leading-relaxed">{lesson.tip}</p>
              </div>

              {/* Code */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{lesson.codeLabel}</p>
                <div className="bg-[#070d1a] border border-gray-800 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <pre className="p-4 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed">
                    <code>{lesson.code}</code>
                  </pre>
                </div>
              </div>

              {/* Simulator */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">
                  {lesson.sim.type === "PromptSim" ? "Live Example" :
                   lesson.sim.type === "TipsSim"   ? "Best Practices" :
                   lesson.sim.type === "StepsSim"  ? "Step-by-Step" : "Output Preview"}
                </p>
                <SimBlock sim={lesson.sim} />
              </div>

              {/* Quiz */}
              <QuizWidget key={lesson.id} quiz={lesson.quiz} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                ← Previous
              </button>
              <button
                onClick={() => markComplete(lesson.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  completed.has(lesson.id)
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                    : "bg-purple-600 hover:bg-purple-500 text-white"
                }`}
              >
                {completed.has(lesson.id) ? "✓ Completed" : "Mark Complete"}
              </button>
              <button
                onClick={goNext}
                disabled={isLast}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
