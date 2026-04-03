"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ── Questions ─────────────────────────────────────────────────────────────────

interface Question {
  q: string;
  options: string[];
  correct: number; // index of correct option
  explanation: string;
  tool?: { label: string; href: string };
}

const QUESTIONS: Question[] = [
  {
    q: "What does WACC stand for?",
    options: [
      "Weighted Average Cost of Capital",
      "Working Asset Capital Calculation",
      "Weighted Annual Cash Contribution",
      "Working Average Cost of Credit",
    ],
    correct: 0,
    explanation: "WACC is the blended rate a company must earn to satisfy all investors — it weights the cost of equity and cost of debt by their share of total capital.",
    tool: { label: "Business Valuation", href: "/tools/valuation" },
  },
  {
    q: "A company has £8,000 fixed costs and a contribution margin of £4 per unit. What is the break-even quantity?",
    options: ["1,000 units", "2,000 units", "3,200 units", "4,000 units"],
    correct: 1,
    explanation: "Break-even = Fixed Costs ÷ Contribution Margin = £8,000 ÷ £4 = 2,000 units.",
    tool: { label: "Break-Even Analysis", href: "/tools/break-even" },
  },
  {
    q: "EBITDA adds back which items to operating profit?",
    options: [
      "Tax and interest only",
      "Depreciation and amortisation only",
      "Interest, tax, depreciation and amortisation",
      "Revenue and cost of goods sold",
    ],
    correct: 2,
    explanation: "EBITDA = Earnings Before Interest, Tax, Depreciation & Amortisation. It strips out financing and accounting policy differences to show core operating performance.",
    tool: { label: "5-Year Financial Model", href: "/tools/financial-model" },
  },
  {
    q: "£10,000 invested at 8% compound interest per year for 10 years becomes approximately…",
    options: ["£14,800", "£18,000", "£21,589", "£80,000"],
    correct: 2,
    explanation: "Using A = P(1 + r)ⁿ: £10,000 × (1.08)¹⁰ ≈ £21,589. This is the power of compounding — interest earning interest.",
    tool: { label: "Compound Interest Calculator", href: "/tools/compound-interest" },
  },
  {
    q: "A P/E ratio of 20× means investors are paying…",
    options: [
      "20% annual dividend yield",
      "£20 for every £1 of annual earnings",
      "20 times the company's annual revenue",
      "A 20% premium to book value",
    ],
    correct: 1,
    explanation: "P/E = Share Price ÷ Earnings Per Share. A P/E of 20× means you pay £20 today for each £1 the company earns annually.",
    tool: { label: "Stock Analysis", href: "/tools/stock-analysis" },
  },
  {
    q: "What does a current ratio below 1.0 signal?",
    options: [
      "High profitability",
      "Strong revenue growth",
      "The company may struggle to meet short-term obligations",
      "An undervalued stock",
    ],
    correct: 2,
    explanation: "Current Ratio = Current Assets ÷ Current Liabilities. Below 1.0 means there are more short-term liabilities than assets — a potential liquidity risk.",
    tool: { label: "13-Week Cash Flow Forecast", href: "/tools/cash-flow" },
  },
  {
    q: "Which discount rate is typically used in a DCF valuation?",
    options: ["The risk-free rate", "The inflation rate", "WACC", "The bank base rate"],
    correct: 2,
    explanation: "DCF uses WACC as the discount rate because it reflects the blended return required by all capital providers — both debt and equity holders.",
    tool: { label: "Business Valuation", href: "/tools/valuation" },
  },
  {
    q: "A startup has £400k cash and spends £80k/month with £30k/month revenue. What is its runway?",
    options: ["5 months", "8 months", "13 months", "3 months"],
    correct: 1,
    explanation: "Net burn = £80k − £30k = £50k/month. Runway = £400k ÷ £50k = 8 months.",
    tool: { label: "13-Week Cash Flow Forecast", href: "/tools/cash-flow" },
  },
  {
    q: "According to Damodaran (Jan 2026), which sector has the highest EV/EBITDA multiple?",
    options: ["Oil & Gas", "Grocery Retail", "Semiconductor", "Trucking"],
    correct: 2,
    explanation: "Semiconductors trade at ~34.8× EV/EBITDA — reflecting high R&D intensity, IP barriers and strong growth expectations. Oil & Gas trades at ~5× and Trucking at ~10×.",
    tool: { label: "Business Valuation", href: "/tools/valuation" },
  },
  {
    q: "What is the main difference between compound and simple interest?",
    options: [
      "Simple interest uses a higher rate",
      "Compound interest earns interest on previously accumulated interest",
      "Simple interest compounds monthly",
      "They are the same over 1 year",
    ],
    correct: 1,
    explanation: "With simple interest you only earn on the principal. Compound interest earns on both principal AND previously earned interest — making it exponentially more powerful over time.",
    tool: { label: "Compound Interest Calculator", href: "/tools/compound-interest" },
  },
];

// ── Confetti ──────────────────────────────────────────────────────────────────

const EMOJIS = ["🎉", "⭐", "🏆", "✨", "💰", "🎊", "📈"];

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-confetti"
          style={{
            left: `${5 + (i * 5.5) % 90}%`,
            animationDelay: `${(i * 0.08).toFixed(2)}s`,
            animationDuration: `${1.2 + (i % 4) * 0.2}s`,
          }}
        >
          {EMOJIS[i % EMOJIS.length]}
        </span>
      ))}
    </div>
  );
}

// ── Score screen ──────────────────────────────────────────────────────────────

function scoreRating(score: number, total: number) {
  const pct = score / total;
  if (pct === 1)    return { emoji: "🏆", label: "Perfect score!",      color: "text-yellow-400" };
  if (pct >= 0.8)   return { emoji: "🌟", label: "Finance expert!",     color: "text-blue-400"   };
  if (pct >= 0.6)   return { emoji: "📈", label: "Good knowledge!",     color: "text-green-400"  };
  if (pct >= 0.4)   return { emoji: "📚", label: "Keep learning!",      color: "text-orange-400" };
  return              { emoji: "💪", label: "Time to hit the glossary!", color: "text-red-400"    };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function QuizClient() {
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState<number | null>(null);
  const [revealed,  setRevealed]  = useState(false);
  const [score,     setScore]     = useState(0);
  const [finished,  setFinished]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [answers,   setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));

  const q = QUESTIONS[current];
  const isCorrect = selected === q.correct;
  const answered  = selected !== null;

  useEffect(() => {
    if (showConf) {
      const t = setTimeout(() => setShowConf(false), 1800);
      return () => clearTimeout(t);
    }
  }, [showConf]);

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    if (idx === q.correct) {
      setScore(s => s + 1);
      setShowConf(true);
    }
  }

  function handleNext() {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    setShowConf(false);
    setAnswers(Array(QUESTIONS.length).fill(null));
  }

  // ── Finished screen ──
  if (finished) {
    const { emoji, label, color } = scoreRating(score, QUESTIONS.length);
    return (
      <div className="animate-fadeIn text-center">
        <div className="text-7xl mb-4">{emoji}</div>
        <h2 className={`text-3xl font-extrabold mb-2 ${color}`}>{label}</h2>
        <p className="text-gray-400 mb-8 text-sm">You answered {score} out of {QUESTIONS.length} correctly.</p>

        {/* Score bar */}
        <div className="max-w-sm mx-auto mb-10">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Score</span>
            <span className="font-bold text-white">{score}/{QUESTIONS.length} ({Math.round(score/QUESTIONS.length*100)}%)</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
              style={{ width: `${(score / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Review wrong answers */}
        {score < QUESTIONS.length && (
          <div className="text-left max-w-xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Questions you missed</p>
            <div className="space-y-3">
              {QUESTIONS.map((q, i) => {
                if (answers[i] === q.correct) return null;
                return (
                  <div key={i} className="bg-[#0d1426] border border-red-500/20 rounded-xl p-4 text-sm">
                    <p className="text-white font-semibold mb-1">{q.q}</p>
                    <p className="text-red-400 text-xs mb-1">Your answer: {answers[i] !== null ? q.options[answers[i]!] : "Skipped"}</p>
                    <p className="text-green-400 text-xs mb-2">Correct: {q.options[q.correct]}</p>
                    <p className="text-gray-500 text-xs">{q.explanation}</p>
                    {q.tool && (
                      <Link href={q.tool.href} className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 transition">
                        Try it → {q.tool.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleRestart}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition"
          >
            Try again
          </button>
          <Link
            href="/glossary"
            className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            Study the glossary →
          </Link>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  return (
    <div>
      {showConf && <Confetti />}

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex gap-1.5 flex-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i < current ? (answers[i] === QUESTIONS[i].correct ? "bg-green-500" : "bg-red-500") :
                i === current ? "bg-blue-500" : "bg-gray-800"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 shrink-0 font-medium">
          {current + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Score badge */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full font-semibold">
          Score: {score}
        </span>
        {answered && isCorrect && (
          <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-bold animate-fadeIn">
            ✓ Correct!
          </span>
        )}
        {answered && !isCorrect && (
          <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold animate-fadeIn">
            ✗ Not quite
          </span>
        )}
      </div>

      {/* Question */}
      <div className="bg-[#0d1426] border border-gray-800 rounded-2xl p-6 mb-6 animate-fadeIn">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
          Question {current + 1}
        </p>
        <h2 className="text-white font-bold text-lg leading-snug">{q.q}</h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {q.options.map((opt, i) => {
          let style = "bg-[#0d1426] border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white cursor-pointer";
          if (answered) {
            if (i === q.correct)             style = "bg-green-500/10 border-green-500 text-green-300 cursor-default";
            else if (i === selected)         style = "bg-red-500/10 border-red-500 text-red-300 cursor-default";
            else                             style = "bg-[#0d1426] border-gray-800 text-gray-600 cursor-default";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`flex items-center gap-4 border rounded-xl px-5 py-4 text-left transition text-sm font-medium ${style}`}
            >
              <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                answered && i === q.correct ? "border-green-500 text-green-400 bg-green-500/20" :
                answered && i === selected  ? "border-red-500 text-red-400 bg-red-500/20" :
                "border-gray-600 text-gray-500"
              }`}>
                {answered && i === q.correct ? "✓" : answered && i === selected ? "✗" : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Post-answer: explanation + actions */}
      {answered && (
        <div className="animate-fadeIn">
          {(revealed || isCorrect) && (
            <div className={`border rounded-xl p-4 mb-4 text-sm ${
              isCorrect ? "bg-green-500/5 border-green-500/30" : "bg-blue-500/5 border-blue-500/20"
            }`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Explanation</p>
              <p className="text-gray-300 leading-relaxed">{q.explanation}</p>
              {q.tool && (
                <Link href={q.tool.href} className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300 transition font-semibold">
                  Try it → {q.tool.label}
                </Link>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!isCorrect && !revealed && (
              <button
                onClick={() => setRevealed(true)}
                className="border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
              >
                Show explanation
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm ml-auto"
            >
              {current + 1 >= QUESTIONS.length ? "See my score →" : "Next question →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
