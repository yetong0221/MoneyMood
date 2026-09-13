import { useEffect, useState } from "react";
import { moods, todayPoolStats } from "../data";
import type { TodayRecord } from "../data";
import type { MoodId } from "../types";
import { getComfortByMood } from "../insight";
import { LogoMark } from "../components/Illustrations";

const themeMap = {
  mint: {
    card: "from-[#eefaf4] to-[#dff3ea]",
    bar: "bg-mint-deep",
    chip: "bg-white/70 text-mint-deep",
  },
  rose: {
    card: "from-[#fff0f2] to-[#ffe0e6]",
    bar: "bg-rose",
    chip: "bg-white/70 text-rose",
  },
  lilac: {
    card: "from-[#f3edfb] to-[#e8ddf8]",
    bar: "bg-lilac-deep",
    chip: "bg-white/70 text-lilac-deep",
  },
} as const;

type PoolId = (typeof todayPoolStats)[number]["id"];

/** 按当前小时返回问候语：5-11 早上好 / 11-14 中午好 / 14-19 下午好 / 19-24 晚上好 / 0-5 夜深了 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return "早上好";
  if (hour >= 11 && hour < 14) return "中午好";
  if (hour >= 14 && hour < 19) return "下午好";
  if (hour >= 19 || hour < 0) return "晚上好";
  return "夜深了";
}

/**
 * 可任意键入的数字输入框：聚焦后用本地 draft 编辑，失焦 / 回车才提交。
 * 之前直接用受控 number + 即时 clamp，导致删空、逐位输入时被立刻钳回去，看起来像“改不成任意数字”。
 */
function PlanNumberInput({
  value,
  onCommit,
  ariaLabel,
  className = "",
}: {
  value: number;
  onCommit: (v: number) => void;
  ariaLabel: string;
  className?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  function commit(raw: string) {
    if (raw === "" || raw === null) {
      setDraft(null);
      return;
    }
    const v = Math.round(Number(raw));
    setDraft(null);
    if (!Number.isNaN(v) && v >= 0) onCommit(v);
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={draft ?? String(value)}
      onFocus={() => setDraft(String(value))}
      onChange={(e) => {
        const next = e.target.value.replace(/[^\d]/g, "").slice(0, 5);
        setDraft(next);
      }}
      onBlur={(e) => commit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") setDraft(null);
      }}
      aria-label={ariaLabel}
      className={className}
    />
  );
}

type HomePageProps = {
  records: TodayRecord[];
  onUpdateRecord: (id: string, patch: Partial<Omit<TodayRecord, "id">>) => void;
  onDeleteRecord: (id: string) => void;
};

export function HomePage({ records, onUpdateRecord, onDeleteRecord }: HomePageProps) {
  const initialNeed = todayPoolStats.find((p) => p.id === "need")?.budget ?? 60;
  const initialJoy = todayPoolStats.find((p) => p.id === "joy")?.budget ?? 35;
  const initialBuffer = todayPoolStats.find((p) => p.id === "buffer")?.budget ?? 80;

  const [totalPlan, setTotalPlan] = useState(initialNeed + initialJoy + initialBuffer);
  const [needBudget, setNeedBudget] = useState(initialNeed);
  const [joyBudget, setJoyBudget] = useState(initialJoy);
  const bufferBudget = Math.max(0, totalPlan - needBudget - joyBudget);

  const [showNotice, setShowNotice] = useState(false);
  const [notices, setNotices] = useState([
    {
      id: "n1",
      icon: "☁️",
      tone: "bg-[#f3edfb]",
      title: "压力缓冲池快满了",
      desc: "已用 74%，再花 ¥258 就超支了哦",
      time: "10 分钟前",
      read: false,
    },
    {
      id: "n2",
      icon: "📝",
      tone: "bg-[#fff3e0]",
      title: "今日已记 3 笔",
      desc: "刚需 ¥24 · 缓冲 ¥22，继续保持",
      time: "1 小时前",
      read: false,
    },
    {
      id: "n3",
      icon: "💗",
      tone: "bg-[#ffe8ea]",
      title: "情绪小提醒",
      desc: "压力时最容易下单，下单前先等 10 分钟",
      time: "昨天 21:00",
      read: true,
    },
  ]);
  const unreadCount = notices.filter((n) => !n.read).length;

  // 记录详情 / 编辑 / 删除
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [draftMoodId, setDraftMoodId] = useState<MoodId>("ok");
  const [draftPoolId, setDraftPoolId] = useState<PoolId>("need");
  const [draftNote, setDraftNote] = useState("");
  const [formError, setFormError] = useState("");

  const selected = selectedId ? (records.find((r) => r.id === selectedId) ?? null) : null;

  useEffect(() => {
    if (selected) {
      setEditing(false);
      setConfirmDelete(false);
      setFormError("");
      setDraftTitle(selected.title);
      setDraftAmount(String(selected.amount));
      setDraftTime(selected.time);
      setDraftMoodId(selected.moodId);
      setDraftPoolId(selected.poolId);
      setDraftNote(selected.note ?? "");
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  function closeDetail() {
    setSelectedId(null);
    setEditing(false);
    setConfirmDelete(false);
    setFormError("");
  }

  function handleSaveEdit() {
    if (!selected) return;
    const title = draftTitle.trim();
    const amount = Math.round(Number(draftAmount));
    const time = draftTime.trim();
    if (!title) {
      setFormError("请填写消费名称");
      return;
    }
    if (!draftAmount.trim() || Number.isNaN(amount) || amount < 0) {
      setFormError("请填写正确的金额");
      return;
    }
    if (!time) {
      setFormError("请填写时间");
      return;
    }
    onUpdateRecord(selected.id, {
      title,
      amount,
      time,
      moodId: draftMoodId,
      poolId: draftPoolId,
      note: draftNote.trim() ? draftNote.trim() : undefined,
    });
    setEditing(false);
    setConfirmDelete(false);
    setFormError("");
  }

  function handleConfirmDelete() {
    if (!selected) return;
    onDeleteRecord(selected.id);
    closeDetail();
  }

  // 总数锚定：totalPlan = need + joy + buffer，buffer 为推导值。
  // 任意数字都可输入（仅限制 >= 0）：总额不够时按比例压缩刚需/悦己，保证输入值原样落地。
  function handleTotalChange(v: number) {
    const next = Math.max(0, v);
    const curSum = needBudget + joyBudget;
    if (next >= curSum) {
      setTotalPlan(next);
      return;
    }
    if (curSum <= 0) {
      setTotalPlan(next);
      return;
    }
    const scale = next / curSum;
    const newNeed = Math.round(needBudget * scale);
    setNeedBudget(newNeed);
    setJoyBudget(Math.max(0, next - newNeed));
    setTotalPlan(next);
  }

  // 改刚需：输入值原样落地；总额不够则扩充总额，其余两池数值不动
  function handleNeedChange(v: number) {
    const clampedNeed = Math.max(0, v);
    const oldBuffer = Math.max(0, totalPlan - needBudget - joyBudget);
    setNeedBudget(clampedNeed);
    setTotalPlan(clampedNeed + joyBudget + oldBuffer);
  }

  // 改悦己（刚需不动）：输入值原样落地；总额不够则扩充总额
  function handleJoyChange(v: number) {
    const clampedJoy = Math.max(0, v);
    const oldBuffer = Math.max(0, totalPlan - needBudget - joyBudget);
    setJoyBudget(clampedJoy);
    setTotalPlan(needBudget + clampedJoy + oldBuffer);
  }

  // 改缓冲：总数跟着走 total = need + joy + newBuffer
  function handleBufferChange(v: number) {
    const clampedBuffer = Math.max(0, v);
    setTotalPlan(needBudget + joyBudget + clampedBuffer);
  }

  function handlePoolBudgetChange(id: PoolId, v: number) {
    if (id === "need") handleNeedChange(v);
    else if (id === "joy") handleJoyChange(v);
    else handleBufferChange(v);
  }

  const isToday = (r: TodayRecord) => !r.time.startsWith("昨天");
  const todayList = records.filter(isToday);
  const spentByPool: Record<PoolId, number> = { need: 0, joy: 0, buffer: 0 };
  for (const r of todayList) spentByPool[r.poolId] += r.amount;

  const pools = todayPoolStats.map((p) => {
    const budget = p.id === "need" ? needBudget : p.id === "joy" ? joyBudget : bufferBudget;
    const spent = spentByPool[p.id];
    const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    return { ...p, budget, spent, percent };
  });

  const todaySpent = todayList.reduce((sum, r) => sum + r.amount, 0);
  const remaining = totalPlan - todaySpent;

  const latest = records[0] ?? null;
  const latestMood = latest ? moods.find((m) => m.id === latest.moodId) : null;
  const latestPool = latest ? pools.find((p) => p.id === latest.poolId) : null;

  const selectedMood = selected ? moods.find((m) => m.id === selected.moodId) : null;
  const selectedPool = selected ? pools.find((p) => p.id === selected.poolId) : null;

  return (
    <div className="space-y-4 pb-4">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff7f5] via-[#ffe9e6] to-[#ffd6d9] p-4 shadow-[0_8px_24px_rgba(255,140,148,0.12)]">
        <div className="flex items-center gap-2">
          <div className="relative z-10 min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <LogoMark />
                <h1 className="font-extrabold text-[20px] tracking-tight text-ink">MoneyMood</h1>
              </div>
              <button
                type="button"
                onClick={() => setShowNotice((v) => !v)}
                className="relative grid h-8 w-8 place-items-center rounded-full bg-white/75 text-[#c48a8a] shadow-sm active:scale-95"
                aria-label="通知"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9a6 6 0 1 1 12 0c0 4 2 5 2 5H4s2-1 2-5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M10 19a2 2 0 0 0 4 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <p className="text-[17px] font-extrabold leading-snug text-ink">{getGreeting()}，叶彤 🌸</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">今天也要好好爱自己呀！</p>
          </div>
          <div className="pointer-events-none h-[128px] w-[156px] shrink-0 animate-float">
            <img
              src="/illust-girl-dog-flower.png"
              alt=""
              className="h-full w-full object-contain object-center drop-shadow-[0_8px_14px_rgba(90,63,63,0.14)]"
              draggable={false}
            />
          </div>
        </div>
      </header>

      {showNotice && (
        <section className="rounded-3xl bg-white/90 p-3 shadow-[0_8px_24px_rgba(255,140,148,0.12)]">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[13px] font-extrabold text-ink">
              通知
              {unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#ffe4e6] px-2 py-0.5 text-[10px] font-bold text-rose">
                  {unreadCount} 条未读
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => setNotices((list) => list.map((n) => ({ ...n, read: true })))}
              className="text-[11px] text-[#d7a3a8]"
            >
              全部已读
            </button>
          </div>
          <ul className="space-y-2">
            {notices.map((notice) => (
              <li key={notice.id}>
                <button
                  type="button"
                  onClick={() =>
                    setNotices((list) =>
                      list.map((n) => (n.id === notice.id ? { ...n, read: true } : n)),
                    )
                  }
                  className={`flex w-full items-start gap-2.5 rounded-2xl px-3 py-2.5 text-left transition-colors active:scale-[0.99] ${
                    notice.read ? "bg-[#fff9f8]" : "bg-[#fff3ef]"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[15px] ${notice.tone}`}
                  >
                    {notice.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-bold text-ink">
                        {notice.title}
                      </span>
                      {!notice.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted">
                      {notice.desc}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] text-[#d7a3a8]">{notice.time}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* —— 01 消费模块 —— */}
      <section className="space-y-3 rounded-3xl border border-[#ffe3e4]/70 bg-white/50 p-3 shadow-[0_8px_24px_rgba(255,140,148,0.07)]">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose text-[13px] font-extrabold text-white">
            ¥
          </span>
          <h2 className="text-[15px] font-extrabold text-ink">消费</h2>
          <span className="text-[11px] text-muted">今日财务状态</span>
          <span className="h-px flex-1 bg-gradient-to-r from-[#ffc9cd] to-transparent" />
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${remaining < 0 ? "bg-[#ffe4e6] text-rose" : "bg-[#dff3ea] text-mint-deep"}`}
          >
            {remaining >= 0 ? `还可花 ¥${remaining}` : `已超 ¥${Math.abs(remaining)}`}
          </span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-[#fff6f4] p-3.5 shadow-[0_6px_18px_rgba(255,140,148,0.09)]">
          <p className="text-[12px] font-extrabold text-ink">今日消费</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[28px] font-extrabold leading-none text-ink">¥{todaySpent}</span>
            <span className="flex items-baseline gap-1 text-[13px] font-semibold text-muted">
              / ¥
              <PlanNumberInput
                value={totalPlan}
                onCommit={handleTotalChange}
                ariaLabel="修改今日计划总额"
                className="w-20 rounded-lg bg-[#fff0f2] px-1.5 py-0.5 text-center text-[13px] font-extrabold text-ink outline-none focus:ring-2 focus:ring-rose/40"
              />
            </span>
          </p>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#f6eee9]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose"
              style={{ width: `${totalPlan > 0 ? Math.min(100, (todaySpent / totalPlan) * 100) : 0}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {pools.map((pool) => {
            const tone = themeMap[pool.theme];
            return (
              <article
                key={pool.id}
                className={`flex min-w-0 flex-col rounded-2xl bg-gradient-to-b ${tone.card} p-2 shadow-[0_4px_12px_rgba(255,140,148,0.06)]`}
              >
                <div className="flex min-w-0 items-center gap-1">
                  <span className="shrink-0 text-[13px]">{pool.icon}</span>
                  <h3 className="min-w-0 flex-1 whitespace-nowrap text-[11px] font-extrabold leading-tight text-ink">
                    {pool.name}
                  </h3>
                </div>
                <p className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="truncate text-[14px] font-extrabold leading-none text-ink">
                    ¥{pool.spent}
                    <span className="ml-0.5 text-[10px] font-semibold text-muted">
                      /{pool.budget}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] font-extrabold text-[#8a6f6f]">
                    {pool.percent}%
                  </span>
                </p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full ${tone.bar}`}
                    style={{ width: `${Math.min(100, pool.percent)}%` }}
                  />
                </div>
                <label className="mt-1.5 flex items-center gap-1 rounded-lg bg-white/75 px-1.5 py-1">
                  <span className="shrink-0 text-[9px] text-muted">计划</span>
                  <PlanNumberInput
                    value={pool.budget}
                    onCommit={(v) => handlePoolBudgetChange(pool.id, v)}
                    ariaLabel={`修改${pool.name}计划额度`}
                    className="w-full min-w-0 bg-transparent text-right text-[11px] font-extrabold text-ink outline-none"
                  />
                </label>
              </article>
            );
          })}
        </div>
      </section>

      {/* —— 02 情绪模块 —— */}
      <section className="space-y-3 rounded-3xl border border-[#e6d9f5]/80 bg-[#faf7ff]/60 p-3 shadow-[0_8px_24px_rgba(209,196,233,0.18)]">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lilac-deep text-[13px] font-extrabold text-white">
            ♡
          </span>
          <h2 className="text-[15px] font-extrabold text-ink">情绪</h2>
          <span className="text-[11px] text-muted">当下情绪状态</span>
          <span className="h-px flex-1 bg-gradient-to-r from-[#d1c4e9] to-transparent" />
        </div>

        {latest && latestMood ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f3ff] via-[#fff0f4] to-[#ffe8ea] p-4 shadow-[0_8px_24px_rgba(209,196,233,0.25)]">
            <div className="relative z-10 flex min-h-[168px] gap-2">
              <div className="min-w-0 flex-1 pr-1">
                <p className="text-[11px] font-medium text-muted">来自最新一笔消费</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] bg-white text-[34px] shadow-sm">
                    {latestMood.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[22px] font-extrabold text-ink">{latestMood.label}</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {latest.time} · {latest.title} · ¥{latest.amount}
                    </p>
                    {latestPool && (
                      <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${themeMap[latestPool.theme].chip}`}
                      >
                        {latestPool.icon} {latestPool.name}
                      </span>
                    )}
                  </div>
                </div>

                {latest.note && (
                  <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-[12px] leading-relaxed text-[#8a6262]">
                    “{latest.note}”
                  </p>
                )}

                <div className="mt-3 rounded-2xl bg-white/60 px-3 py-2.5">
                  <p className="text-[10px] text-muted">这笔消费的心情提醒</p>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink">
                    {getComfortByMood(latestMood.id)}
                  </p>
                </div>
              </div>

              <div className="pointer-events-none flex w-[118px] shrink-0 items-end justify-center self-stretch">
                <img
                  src="/illust-girl-cat.png"
                  alt=""
                  className="h-full max-h-[168px] w-full object-contain object-bottom opacity-90"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-2xl bg-white/70 px-3 py-4 text-center text-[12px] text-muted">
            还没有记录，去记第一笔吧～
          </p>
        )}
      </section>

      {/* —— 03 记录模块 —— */}
      <section className="space-y-3 rounded-3xl border border-[#fbe3c3]/70 bg-[#fffcf7]/70 p-3 shadow-[0_8px_24px_rgba(230,177,92,0.1)]">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e6b15c] text-[13px] font-extrabold text-white">
            ✎
          </span>
          <h2 className="text-[15px] font-extrabold text-ink">记录</h2>
          <span className="text-[11px] text-muted">今日财务明细</span>
          <span className="h-px flex-1 bg-gradient-to-r from-[#f3d9ac] to-transparent" />
          <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-muted">
            共 {records.length} 笔
          </span>
        </div>
        <p className="px-1 text-[10px] text-muted">点击任意一笔可查看详情、修改或删除</p>

        {records.length === 0 ? (
          <p className="rounded-2xl bg-white/80 px-3 py-5 text-center text-[12px] text-muted">
            还没有记录，去记第一笔吧～
          </p>
        ) : (
          <ul className="space-y-2">
            {records.map((item) => {
              const mood = moods.find((m) => m.id === item.moodId);
              const pool = pools.find((p) => p.id === item.poolId);
              return (
                <li
                  key={item.id}
                  className="rounded-2xl bg-white/90 shadow-[0_6px_16px_rgba(255,140,148,0.07)]"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="block w-full p-3 text-left transition-transform active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fff6f4] text-[18px]">
                        {mood?.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-extrabold text-ink">{item.title}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-muted">
                          <span>{item.time}</span>
                          <span>·</span>
                          <span>{mood?.label}</span>
                          {pool && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-px font-bold ${themeMap[pool.theme].chip}`}
                            >
                              {pool.icon} {pool.name}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-[14px] font-extrabold text-ink">
                        ¥{item.amount}
                      </span>
                      <span className="shrink-0 text-[12px] text-[#d7a3a8]">›</span>
                    </div>
                    {item.note && (
                      <p className="mt-2 rounded-xl bg-[#fff9f8] px-2.5 py-1.5 text-[11px] leading-relaxed text-[#8a6262]">
                        “{item.note}”
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* —— 记录详情 / 编辑 / 删除弹窗 —— */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
          onClick={closeDetail}
          role="dialog"
          aria-modal="true"
          aria-label="记录详情"
        >
          <div
            className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">{editing ? "修改记录" : "记录详情"}</p>
              <button
                type="button"
                onClick={closeDetail}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96] active:scale-95"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>

            {!editing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-[#fff9f8] p-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[26px] shadow-sm">
                    {selectedMood?.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[16px] font-extrabold text-ink">{selected.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {selected.time} · {selectedMood?.label}
                    </p>
                  </div>
                  <span className="shrink-0 text-[20px] font-extrabold text-ink">
                    ¥{selected.amount}
                  </span>
                </div>

                <dl className="space-y-2 rounded-2xl bg-[#fff9f8] p-3 text-[12px]">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted">所属池子</dt>
                    <dd className="font-bold text-ink">
                      {selectedPool ? `${selectedPool.icon} ${selectedPool.name}` : selected.poolId}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-muted">消费心情</dt>
                    <dd className="font-bold text-ink">
                      {selectedMood?.emoji} {selectedMood?.label}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <dt className="shrink-0 text-muted">备注</dt>
                    <dd className="text-right font-semibold text-ink">
                      {selected.note ? `“${selected.note}”` : "—"}
                    </dd>
                  </div>
                </dl>

                {confirmDelete ? (
                  <div className="rounded-2xl bg-[#ffe4e6] p-3 text-center">
                    <p className="text-[13px] font-bold text-rose">确定删除「{selected.title}」吗？</p>
                    <p className="mt-1 text-[11px] text-[#b08989]">删除后无法恢复</p>
                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="rounded-full bg-white py-2.5 text-[13px] font-bold text-[#8a6f6f]"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="rounded-full bg-rose py-2.5 text-[13px] font-bold text-white shadow-[0_6px_14px_rgba(255,140,148,0.4)]"
                      >
                        确认删除
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="rounded-full bg-[#fff3ef] py-3 text-[14px] font-bold text-rose active:scale-[0.98]"
                    >
                      删除
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)] active:scale-[0.98]"
                    >
                      修改
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <label className="block rounded-2xl bg-[#fff9f8] px-3 py-2.5">
                  <span className="text-[11px] text-muted">名称</span>
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    maxLength={20}
                    placeholder="例如：咖啡"
                    className="mt-1 w-full bg-transparent text-[14px] font-bold text-ink outline-none placeholder:text-[#d4b0ae]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block rounded-2xl bg-[#fff9f8] px-3 py-2.5">
                    <span className="text-[11px] text-muted">金额 ¥</span>
                    <input
                      value={draftAmount}
                      onChange={(e) => setDraftAmount(e.target.value.replace(/[^\d.]/g, ""))}
                      inputMode="decimal"
                      placeholder="0"
                      className="mt-1 w-full bg-transparent text-[14px] font-bold text-ink outline-none placeholder:text-[#d4b0ae]"
                    />
                  </label>
                  <label className="block rounded-2xl bg-[#fff9f8] px-3 py-2.5">
                    <span className="text-[11px] text-muted">时间</span>
                    <input
                      value={draftTime}
                      onChange={(e) => setDraftTime(e.target.value)}
                      maxLength={20}
                      placeholder="例如：10:24"
                      className="mt-1 w-full bg-transparent text-[14px] font-bold text-ink outline-none placeholder:text-[#d4b0ae]"
                    />
                  </label>
                </div>
                <div className="rounded-2xl bg-[#fff9f8] px-3 py-2.5">
                  <p className="text-[11px] text-muted">情绪</p>
                  <div className="mt-1.5 grid grid-cols-6 gap-1.5">
                    {moods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDraftMoodId(m.id)}
                        title={m.label}
                        className={`flex flex-col items-center rounded-xl py-1.5 text-[10px] ${
                          draftMoodId === m.id
                            ? "bg-[#ffe6e8] font-bold text-rose"
                            : "text-[#8a6f6f]"
                        }`}
                      >
                        <span className="text-[18px]">{m.emoji}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#fff9f8] px-3 py-2.5">
                  <p className="text-[11px] text-muted">放入池子</p>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {todayPoolStats.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setDraftPoolId(p.id)}
                        className={`rounded-xl px-2 py-2 text-[11px] ${
                          draftPoolId === p.id
                            ? "bg-[#ffe6e8] font-bold text-rose"
                            : "bg-white text-[#8a6f6f]"
                        }`}
                      >
                        {p.icon} {p.name.replace("池", "")}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block rounded-2xl bg-[#fff9f8] px-3 py-2.5">
                  <span className="text-[11px] text-muted">备注</span>
                  <input
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    maxLength={50}
                    placeholder="写点什么吧…"
                    className="mt-1 w-full bg-transparent text-[13px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]"
                  />
                </label>

                {formError && (
                  <p className="rounded-xl bg-[#ffe4e6] px-3 py-2 text-center text-[12px] font-semibold text-rose">
                    {formError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormError("");
                    }}
                    className="rounded-full bg-[#fff3ef] py-3 text-[14px] font-bold text-[#c49a96]"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)]"
                  >
                    保存修改
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
