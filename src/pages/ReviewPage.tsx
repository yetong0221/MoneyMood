import { useState } from "react";
import { emotionShare, moodSpend } from "../data";
import { getReviewBudgetTip, getReviewInsight } from "../insight";
import type { Period } from "../types";
import { PeriodSwitch } from "./BudgetPage";
import { RobotArt } from "../components/Illustrations";

const moodEmoji: Record<string, string> = {
  开心: "😊",
  平静: "🙂",
  压力: "😣",
  低落: "😞",
  疲惫: "😪",
};

export function ReviewPage({ onBack }: { onBack: () => void }) {
  const [period, setPeriod] = useState<Period>("month");
  const maxBar = Math.max(...moodSpend.map((item) => item.value));
  const insight = getReviewInsight();
  const budgetTip = getReviewBudgetTip();

  return (
    <div className="space-y-3 pb-4">
      <header className="px-1">
        <div className="mb-1 flex items-center gap-2">
          <button type="button" onClick={onBack} className="text-lg text-[#c49a96]" aria-label="返回">
            ‹
          </button>
          <h1 className="text-[20px] font-extrabold text-ink">情绪-财务复盘</h1>
        </div>
        <p className="pl-4 text-[12px] text-muted">看见情绪与金钱的关系，找到更好的自己</p>
      </header>

      <PeriodSwitch value={period} onChange={setPeriod} activeTone="rose" />

      <section className="rounded-3xl bg-white/90 p-4 shadow-[0_8px_24px_rgba(255,140,148,0.1)]">
        <p className="text-[12px] font-bold text-[#8a6f6f]">本月消费总览</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-[30px] font-extrabold leading-none text-ink">¥4,862</p>
            <p className="mt-2 text-[11px] text-muted">
              较上月 <span className="font-semibold text-rose">↗ +12%</span>
            </p>
          </div>
          <div className="relative h-[84px] w-[84px] shrink-0">
            <div className="donut h-full w-full rounded-full" />
            <div className="absolute inset-[18px] grid place-items-center rounded-full bg-white text-[10px] font-bold text-[#8a6f6f]">
              消费结构
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-[12px]">
          <LegendRow color="#a8e6cf" label="必要消费" percent="61%" amount="¥2,980" />
          <LegendRow color="#d1c4e9" label="理性享受" percent="16%" amount="¥1,140" />
          <LegendRow color="#ff8c94" label="情绪关联" percent="23%" amount="¥1,742" />
        </div>
      </section>

      <section className="rounded-3xl bg-white/90 p-4 shadow-[0_8px_20px_rgba(255,140,148,0.08)]">
        <p className="mb-3 text-[13px] font-bold text-[#8a6f6f]">情绪消费占比</p>
        <div className="space-y-2.5">
          {emotionShare.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[11px]">
              <span className="w-8 text-[#8a6f6f]">{item.label}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f6eee9]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.value}%`, background: item.color }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-muted">{item.value}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white/90 p-4 shadow-[0_8px_20px_rgba(255,140,148,0.08)]">
        <p className="mb-3 text-[13px] font-bold text-[#8a6f6f]">消费 × 情绪关系</p>
        <div className="flex h-28 items-end justify-between gap-2 px-1">
          {moodSpend.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-muted">¥{item.value}</span>
              <div
                className="w-full max-w-[22px] rounded-t-lg"
                style={{ height: `${(item.value / maxBar) * 72}px`, background: item.color }}
              />
              <span className="text-[14px]">{moodEmoji[item.label] ?? "🙂"}</span>
              <span className="text-[9px] text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-3xl bg-gradient-to-br from-[#f3edfb] to-[#ebe0f8] p-3.5">
        <RobotArt className="h-11 w-11 shrink-0" />
        <div>
          <p className="text-[12px] font-bold text-[#7a5a9a]">{insight.title}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#7a6a8a]">
            {insight.body}
            {insight.action}
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-[#fff6f2] p-3.5">
        <p className="text-[12px] font-bold text-[#c07a7a]">{budgetTip.title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-[#9a7774]">{budgetTip.body}</p>
      </section>
    </div>
  );
}

function LegendRow({
  color,
  label,
  percent,
  amount,
}: {
  color: string;
  label: string;
  percent: string;
  amount: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      <span className="flex-1 text-[#8a6f6f]">{label}</span>
      <span className="text-muted">{percent}</span>
      <span className="w-14 text-right font-semibold text-ink">{amount}</span>
    </div>
  );
}
