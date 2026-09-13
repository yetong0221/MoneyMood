import { useState } from "react";
import { budgetPools } from "../data";
import { getBudgetInsight } from "../insight";
import type { Period } from "../types";
import { RobotArt } from "../components/Illustrations";

export function BudgetPage({ onBack }: { onBack: () => void }) {
  const [period, setPeriod] = useState<Period>("week");
  const insight = getBudgetInsight(period);

  return (
    <div className="space-y-3 pb-4">
      <header className="px-1">
        <div className="mb-1 flex items-center gap-2">
          <button type="button" onClick={onBack} className="text-lg text-[#c49a96]" aria-label="返回">
            ‹
          </button>
          <h1 className="text-[20px] font-extrabold text-ink">三轨情绪预算</h1>
        </div>
        <p className="pl-4 text-[12px] text-muted">给不同的情绪，分配合适的预算</p>
      </header>

      <PeriodSwitch value={period} onChange={setPeriod} />

      {budgetPools.map((pool) => (
        <article
          key={pool.id}
          className={`rounded-3xl p-4 shadow-[0_8px_20px_rgba(255,140,148,0.1)] ${
            pool.theme === "mint"
              ? "bg-gradient-to-br from-[#eefaf4] to-[#d8f3e8]"
              : pool.theme === "rose"
                ? "bg-gradient-to-br from-[#fff0f2] to-[#ffe0e6]"
                : "bg-gradient-to-br from-[#f3edfb] to-[#e8ddf8]"
          }`}
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {pool.icon === "sprout" ? "🌱" : pool.icon === "heart" ? "💗" : "☁️"}
              </span>
              <h2 className="text-[14px] font-extrabold text-ink">{pool.name}</h2>
            </div>
            <span className="rounded-full bg-white/75 px-2.5 py-0.5 text-[10px] text-[#a88888]">
              {pool.tag}
            </span>
          </div>
          <p className="text-[22px] font-extrabold text-ink">
            ¥{pool.used.toLocaleString()}
            <span className="ml-1 text-[13px] font-semibold text-[#c4a6a2]">
              / ¥{pool.total.toLocaleString()}
            </span>
          </p>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/70">
            <div
              className={`h-full rounded-full transition-all ${
                pool.theme === "mint"
                  ? "bg-mint-deep"
                  : pool.theme === "rose"
                    ? "bg-rose"
                    : "bg-lilac-deep"
              }`}
              style={{ width: `${pool.percent}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {pool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/65 px-2 py-0.5 text-[10px] text-[#a88888]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="shrink-0 text-[12px] font-bold text-[#8a6f6f]">{pool.percent}%</span>
          </div>
        </article>
      ))}

      <section className="flex items-start gap-3 rounded-3xl bg-white/90 p-3.5 shadow-[0_8px_20px_rgba(255,140,148,0.08)]">
        <RobotArt className="h-11 w-11 shrink-0" />
        <div>
          <p className="text-[12px] font-bold text-[#8a5a62]">{insight.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#9a7774]">{insight.body}</p>
          <button type="button" className="mt-1.5 text-[11px] text-[#d7a3a8]">
            查看详情 ›
          </button>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff4ee] to-[#ffe6e0] p-4">
        <div className="flex items-center gap-2">
          <p className="relative z-10 min-w-0 flex-1 text-[14px] font-extrabold leading-snug text-[#8a5a52]">
            合理消费，
            <br />
            也是一种自我关爱 ♡
          </p>
          <div className="pointer-events-none h-[108px] w-[112px] shrink-0">
            <img
              src="/illust-girl-heart.png"
              alt=""
              className="h-full w-full object-contain object-center drop-shadow-[0_6px_12px_rgba(90,63,63,0.12)]"
              draggable={false}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function PeriodSwitch({
  value,
  onChange,
  activeTone = "mint",
}: {
  value: Period;
  onChange: (v: Period) => void;
  activeTone?: "mint" | "rose";
}) {
  const periodLabel: Record<Period, string> = {
    week: "本周",
    month: "本月",
    year: "本年",
  };
  return (
    <div className="flex rounded-full bg-white/90 p-1 shadow-sm">
      {(["week", "month", "year"] as const).map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-1 rounded-full py-1.5 text-[13px] transition-colors ${
            value === id
              ? activeTone === "rose"
                ? "bg-[#ffe4e8] font-bold text-rose shadow-sm"
                : "bg-[#dff3ea] font-bold text-mint-deep shadow-sm"
              : "text-[#c4a6a2]"
          }`}
        >
          {periodLabel[id]}
        </button>
      ))}
    </div>
  );
}
