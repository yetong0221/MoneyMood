import { useMemo } from "react";
import { moods, type TodayRecord } from "../data";
import type { MoodId } from "../types";
import { weekRange, parseRecordTime } from "../insight";

export type DaySpending = {
  dayName: string;
  amount: number;
  topMood: MoodId | null;
  moodLabel: string;
  moodEmoji: string;
  isOverBudget: boolean;
  isToday: boolean;
};

/** 计算本周每日开销和情绪统计 */
export function getWeekDaySpending(
  records: TodayRecord[],
  _dailyBudget: number,
  weekTotalBudget: number,
): DaySpending[] {
  const { start, end } = weekRange();
  const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  // 初始化每天数据
  const days: DaySpending[] = dayNames.map((name) => ({
    dayName: name,
    amount: 0,
    topMood: null,
    moodLabel: "",
    moodEmoji: "",
    isOverBudget: false,
    isToday: false,
  }));

  // 获取今天的日期用于判断是否是今天
  const today = new Date();

  // 统计每天的开销和情绪
  const moodCounts: Record<number, Record<MoodId, number>> = {};
  for (let i = 0; i < 7; i++) {
    moodCounts[i] = { happy: 0, calm: 0, ok: 0, stress: 0, down: 0, tired: 0 };
  }

  for (const record of records) {
    const ts = parseRecordTime(record.time, Date.now());
    if (ts !== null && ts >= start && ts < end) {
      // 计算是周几 (0=周一, 6=周日)
      const date = new Date(ts);
      const dayOfWeek = date.getDay();
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      days[dayIndex].amount += record.amount;
      if (moodCounts[dayIndex]) {
        moodCounts[dayIndex][record.moodId]++;
      }

      // 判断是否是今天
      const isSameDay =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();
      if (isSameDay) {
        days[dayIndex].isToday = true;
      }
    }
  }

  // 计算每日情绪最频繁的那个
  const avgDailyBudget = weekTotalBudget / 7;
  for (let i = 0; i < 7; i++) {
    const counts = moodCounts[i];
    let maxCount = 0;
    let topMood: MoodId | null = null;
    for (const [moodId, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        topMood = moodId as MoodId;
      }
    }
    days[i].topMood = topMood;
    if (topMood) {
      const moodInfo = moods.find((m) => m.id === topMood);
      days[i].moodLabel = moodInfo?.label ?? "";
      days[i].moodEmoji = moodInfo?.emoji ?? "";
    }
    // 判断是否超过日均额度
    days[i].isOverBudget = days[i].amount > avgDailyBudget;
  }

  return days;
}

type WeekDayChartProps = {
  records: TodayRecord[];
  weekTotalBudget: number;
};

/** 一周七天柱状图组件 */
export function WeekDayChart({ records, weekTotalBudget }: WeekDayChartProps) {
  const avgDailyBudget = weekTotalBudget / 7;

  const weekDays = useMemo(
    () => getWeekDaySpending(records, avgDailyBudget, weekTotalBudget),
    [records, avgDailyBudget, weekTotalBudget],
  );

  // 找出最高花费用于计算柱状图高度
  const maxAmount = Math.max(...weekDays.map((d) => d.amount), avgDailyBudget);

  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-[0_8px_20px_rgba(255,140,148,0.08)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-extrabold text-ink">📊 本周每日开销</p>
        <span className="rounded-full bg-[#fff3ef] px-2.5 py-0.5 text-[10px] font-bold text-[#b07830]">
          日均 ¥{Math.round(avgDailyBudget)}
        </span>
      </div>

      {/* 柱状图 */}
      <div className="mt-4 flex h-40 items-end justify-between gap-1 px-1">
        {weekDays.map((day, i) => {
          const heightPercent = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
          const isOver = day.isOverBudget && day.amount > 0;

          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              {/* 金额标签 */}
              <span
                className={`text-[9px] font-semibold ${
                  day.amount === 0
                    ? "text-muted"
                    : isOver
                      ? "text-rose"
                      : "text-[#8a6f6f]"
                }`}
              >
                {day.amount > 0 ? `¥${day.amount}` : ""}
              </span>

              {/* 柱子 */}
              <div className="relative w-full">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    day.amount === 0
                      ? "h-1 bg-[#f0e8e5]"
                      : isOver
                        ? "bg-gradient-to-t from-[#ff4757] to-[#ff8c94] shadow-[0_4px_12px_rgba(255,71,87,0.4)]"
                        : day.isToday
                          ? "bg-gradient-to-t from-rose to-[#ffb0b6] shadow-[0_4px_12px_rgba(255,140,148,0.3)]"
                          : "bg-gradient-to-t from-[#ffb0b6] to-[#ffd0d8]"
                  }`}
                  style={{
                    height: day.amount === 0 ? "4px" : `${Math.max(heightPercent, 10)}%`,
                  }}
                />
                {/* 超额红色边框 */}
                {isOver && (
                  <div className="absolute -inset-0.5 rounded-lg border-2 border-rose/50" />
                )}
              </div>

              {/* 情绪标签 */}
              {day.moodEmoji && day.amount > 0 && (
                <span className="text-[12px]" title={day.moodLabel}>
                  {day.moodEmoji}
                </span>
              )}

              {/* 周几 */}
              <span
                className={`text-[10px] font-semibold ${
                  day.isToday ? "text-rose" : "text-muted"
                }`}
              >
                {day.dayName.slice(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* 日均额度参考线提示 */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose" />
          超日均
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ffd0d8]" />
          正常
        </span>
        {weekDays.some((d) => d.isToday) && (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose" />
            今天
          </span>
        )}
      </div>

      {/* 警示提示 */}
      {weekDays.some((d) => d.isOverBudget) && (
        <div className="mt-3 rounded-xl bg-[#ffe4e6] px-3 py-2 text-center text-[11px] font-semibold text-rose">
          ⚠️ 有 {weekDays.filter((d) => d.isOverBudget).length} 天超过日均额度，注意控制消费节奏
        </div>
      )}
    </section>
  );
}
