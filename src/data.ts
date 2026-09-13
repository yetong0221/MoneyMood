import type { MoodId } from "./types";

export const moods: { id: MoodId; label: string; emoji: string }[] = [
  { id: "happy", label: "开心", emoji: "😊" },
  { id: "calm", label: "平静", emoji: "🙂" },
  { id: "ok", label: "一般", emoji: "😐" },
  { id: "stress", label: "压力", emoji: "😣" },
  { id: "down", label: "低落", emoji: "😞" },
  { id: "tired", label: "疲惫", emoji: "😪" },
];

export const recordDraft = {
  text: "刚刚买了杯 22 块的咖啡，因为今天开会被领导骂了，压力好大...",
  amount: 22,
  category: "餐饮 · 咖啡",
  time: "今天 10:24",
  emotion: "压力 / 焦虑",
  purpose: "情绪补偿",
};

export type PoolId = "need" | "joy" | "buffer";

export type TodayRecord = {
  id: string;
  poolId: PoolId;
  title: string;
  amount: number;
  time: string;
  moodId: MoodId;
  note?: string;
};

/** 按时间新→旧；第一条即最新消费 */
export const todayRecords: TodayRecord[] = [
  {
    id: "r1",
    poolId: "buffer",
    title: "咖啡",
    amount: 22,
    time: "10:24",
    moodId: "stress",
    note: "开会后给自己买的",
  },
  {
    id: "r2",
    poolId: "need",
    title: "地铁",
    amount: 6,
    time: "09:12",
    moodId: "calm",
  },
  {
    id: "r3",
    poolId: "need",
    title: "早餐",
    amount: 18,
    time: "08:40",
    moodId: "ok",
  },
  {
    id: "r4",
    poolId: "joy",
    title: "鲜花",
    amount: 35,
    time: "昨天 19:20",
    moodId: "happy",
    note: "路过花店",
  },
  {
    id: "r5",
    poolId: "buffer",
    title: "外卖甜品",
    amount: 28,
    time: "昨天 21:05",
    moodId: "tired",
  },
];

export const todayPoolStats = [
  {
    id: "need" as const,
    name: "刚需基础池",
    icon: "🌱",
    spent: 24,
    budget: 60,
    percent: 40,
    theme: "mint" as const,
  },
  {
    id: "joy" as const,
    name: "悦己享受池",
    icon: "💗",
    spent: 0,
    budget: 35,
    percent: 0,
    theme: "rose" as const,
  },
  {
    id: "buffer" as const,
    name: "压力缓冲池",
    icon: "☁️",
    spent: 22,
    budget: 80,
    percent: 28,
    theme: "lilac" as const,
  },
];

export const budgetPools = [
  {
    id: "need",
    name: "刚需基础池",
    icon: "sprout",
    used: 2980,
    total: 4800,
    percent: 62,
    tag: "保障生活",
    tags: ["餐饮", "交通", "房租", "学习", "生活"],
    theme: "mint",
  },
  {
    id: "joy",
    name: "悦己享受池",
    icon: "heart",
    used: 1140,
    total: 2000,
    percent: 57,
    tag: "提升幸福感",
    tags: ["娱乐", "兴趣", "社交", "礼物"],
    theme: "rose",
  },
  {
    id: "buffer",
    name: "压力缓冲池",
    icon: "cloud",
    used: 742,
    total: 1000,
    percent: 74,
    tag: "应对情绪波动",
    tags: ["外卖", "购物", "娱乐", "临时消费"],
    theme: "lilac",
  },
] as const;

export const emotionShare = [
  { label: "压力", value: 52, color: "#7bb7e0" },
  { label: "疲惫", value: 27, color: "#e6b15c" },
  { label: "开心", value: 14, color: "#ff8c94" },
  { label: "无聊", value: 7, color: "#d1c4e9" },
];

export const moodSpend = [
  { label: "开心", value: 680, color: "#ffb0b6" },
  { label: "平静", value: 520, color: "#ffe0b2" },
  { label: "压力", value: 1140, color: "#7bb7e0" },
  { label: "低落", value: 760, color: "#d1c4e9" },
  { label: "疲惫", value: 820, color: "#a8e6cf" },
];
