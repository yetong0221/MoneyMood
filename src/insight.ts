import { budgetPools, emotionShare, moodSpend, moods } from "./data";
import type { MoodId, Period } from "./types";

/**
 * 本地智能引擎：无 AI 但智能。
 * 所有结论都由真实数据算出来，不是写死文案。
 * 以后想接大模型，只需实现底部的 polishWithLLM 做语气润色，不改变数字结论。
 */

const comfortMap: Record<MoodId, string> = {
  happy: "保持这份好心情，继续温柔对待自己吧",
  calm: "平静也是一种力量，今天节奏刚刚好",
  ok: "平平淡淡也是收获，记得给自己点个赞",
  stress: "压力来了也没关系，记下来就已经很勇敢了",
  down: "有点低落也没关系，先抱抱自己，再慢慢来",
  tired: "累了就歇一歇，照顾好自己比什么都重要",
};

export function getComfortByMood(moodId: MoodId): string {
  return comfortMap[moodId] ?? comfortMap.ok;
}

export function getMoodLabel(moodId: MoodId): string {
  return moods.find((m) => m.id === moodId)?.label ?? "";
}

const periodLabel: Record<Period, string> = {
  week: "本周",
  month: "本月",
  year: "本年",
};

export type BudgetInsight = {
  title: string;
  body: string;
};

/** 根据三池使用率动态生成预算建议，而非写死 “悦己+50 / 缓冲-50”。 */
export function getBudgetInsight(period: Period): BudgetInsight {
  const pools = [...budgetPools].sort((a, b) => b.percent - a.percent);
  const hottest = pools[0];
  const coolest = pools[pools.length - 1];
  const prefix = periodLabel[period];

  if (hottest.percent >= 70) {
    return {
      title: "小M观察",
      body: `根据你最近的消费数据，${prefix}「${hottest.name}」已用 ${hottest.percent}%，${coolest.name}相对宽裕（${coolest.percent}%）。建议把「${coolest.name}」的 ¥50 调给「${hottest.name}」，别让它超支。`,
    };
  }

  const joy = budgetPools.find((p) => p.id === "joy");
  const buffer = budgetPools.find((p) => p.id === "buffer");
  if (joy && buffer && buffer.percent > joy.percent) {
    return {
      title: "小M观察",
      body: `根据你最近的消费和情绪数据，${prefix}情绪消费偏多。建议将「${joy.name}」增加 ¥50，「${buffer.name}」减少 ¥50，把情绪消费变成更有意识的自我关照。`,
    };
  }

  return {
    title: "小M观察",
    body: `${prefix}三池节奏都不错，继续保持。记得大额支出前先看看「可安心支出」。`,
  };
}

export type ReviewInsight = {
  title: string;
  body: string;
  action: string;
};

/** 根据情绪占比 + 情绪消费额 + 缓冲池水位，组合出 2 句洞察 + 1 条行动。 */
export function getReviewInsight(): ReviewInsight {
  const topEmotion = [...emotionShare].sort((a, b) => b.value - a.value)[0];
  const topSpend = [...moodSpend].sort((a, b) => b.value - a.value)[0];
  const buffer = budgetPools.find((p) => p.id === "buffer");

  const body =
    topEmotion && topSpend
      ? `你的消费主要受「${topEmotion.label}」（占 ${topEmotion.value}%）影响，「${topSpend.label}」时花得最多（¥${topSpend.value.toLocaleString()}）。`
      : "多记几笔，观察会越来越准哦。";

  let action = "试试给每笔消费打上情绪标签，下周的观察会更准。";
  if (buffer && buffer.percent >= 70) {
    action = `「${buffer.name}」已用 ${buffer.percent}%，试试给它设个上限，超了就散步代替下单吧。`;
  } else if (topEmotion && (topEmotion.label === "压力" || topEmotion.label === "疲惫")) {
    action = "高压时刻更容易非必要消费，下次下单前先等 10 分钟，再决定要不要买。";
  }

  return { title: "情绪观察", body, action };
}

export function getReviewBudgetTip(): { title: string; body: string } {
  const joy = budgetPools.find((p) => p.id === "joy");
  const buffer = budgetPools.find((p) => p.id === "buffer");
  if (joy && buffer) {
    return {
      title: "下月小建议",
      body: `建议下月将「${joy.name}」增加 ¥50，「${buffer.name}」减少 ¥50，把情绪消费变成更有意识的自我关照。`,
    };
  }
  return { title: "下月小建议", body: "继续保持三池节奏，下月会更好。" };
}

/**
 * 未来 LLM 润色预留位：只改语气，不改数字。
 * export async function polishWithLLM(text: string): Promise<string> {
 *   const res = await fetch("/api/polish", { method: "POST", body: JSON.stringify({ text }) });
 *   return (await res.json()).text ?? text;
 * }
 */
