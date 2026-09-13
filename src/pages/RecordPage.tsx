import { useRef, useState, type ReactNode } from "react";
import { budgetPools, moods, type TodayRecord } from "../data";
import type { MoodId } from "../types";

const categories = [
  { id: "food", label: "餐饮", icon: "🍜" },
  { id: "transport", label: "交通", icon: "🚌" },
  { id: "medical", label: "医疗", icon: "💊" },
  { id: "fun", label: "娱乐", icon: "🎮" },
  { id: "gift", label: "礼物", icon: "🎁" },
  { id: "shopping", label: "购物", icon: "🛒" },
  { id: "travel", label: "旅行", icon: "✈️" },
  { id: "internet", label: "上网", icon: "🌐" },
  { id: "sport", label: "运动", icon: "🏃" },
  { id: "other", label: "其他", icon: "✨" },
] as const;

const poolMeta = {
  need: { icon: "🌱", tone: "bg-[#eef8f3] text-mint-deep" },
  joy: { icon: "💗", tone: "bg-[#ffe8ea] text-rose" },
  buffer: { icon: "☁️", tone: "bg-[#f3edfb] text-lilac-deep" },
} as const;

type PoolId = (typeof budgetPools)[number]["id"];

function nowLocalInput() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTimeLabel(value: string) {
  if (!value) return "选择时间";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const today = new Date();
  const sameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return sameDay ? `今天 ${time}` : `${d.getMonth() + 1}/${d.getDate()} ${time}`;
}

type RecordPageProps = {
  onBack: () => void;
  onSave?: (input: Omit<TodayRecord, "id">) => void;
};

export function RecordPage({ onBack, onSave }: RecordPageProps) {
  const [amount, setAmount] = useState("");
  const [time, setTime] = useState(nowLocalInput());
  const [categoryId, setCategoryId] = useState<(typeof categories)[number]["id"] | "">("");
  const [moodId, setMoodId] = useState<MoodId | "">("");
  const [poolId, setPoolId] = useState<PoolId | "">("");
  const [openPicker, setOpenPicker] = useState<"category" | "mood" | "pool" | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const timeInputRef = useRef<HTMLInputElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);

  const category = categories.find((c) => c.id === categoryId);
  const mood = moods.find((m) => m.id === moodId);
  const pool = budgetPools.find((p) => p.id === poolId);

  function resetForm() {
    setAmount("");
    setTime(nowLocalInput());
    setCategoryId("");
    setMoodId("");
    setPoolId("");
    setNote("");
    setOpenPicker(null);
    setSaved(false);
    setError("");
  }

  function handleConfirm() {
    const amountNum = Number(amount);
    if (!amount.trim() || Number.isNaN(amountNum) || amountNum <= 0) {
      setError("请填写正确的金额");
      return;
    }
    if (!categoryId) {
      setError("请选择分类");
      return;
    }
    if (!moodId) {
      setError("请选择情绪");
      return;
    }
    if (!poolId) {
      setError("请选择池子");
      return;
    }
    onSave?.({
      poolId,
      title: category?.label ?? "消费",
      amount: Math.round(amountNum),
      time: formatTimeLabel(time),
      moodId,
      note: note.trim() ? note.trim() : undefined,
    });
    setError("");
    setSaved(true);
    setTimeout(() => onBack(), 700);
  }

  return (
    <div className="space-y-3 pb-2">
      <header className="px-1">
        <div className="mb-1 flex items-center gap-2">
          <button type="button" onClick={onBack} className="text-lg text-[#c49a96]" aria-label="返回">
            ‹
          </button>
          <h1 className="text-[20px] font-extrabold text-ink">记一笔消费</h1>
        </div>
        <p className="pl-4 text-[12px] text-muted">手动填写金额、分类和情绪，记入对应池子</p>
      </header>

      <section className="rounded-3xl bg-white/90 p-4 shadow-[0_8px_24px_rgba(255,140,148,0.1)]">
        <p className="mb-3 text-[13px] font-bold text-[#8a6f6f]">手动记账</p>
        <div className="space-y-2">
          <FormRow
            icon="¥"
            tone="bg-[#ffe8ea] text-rose"
            label="金额"
            onSelect={() => amountInputRef.current?.focus()}
          >
            <div className="flex items-center justify-end gap-0.5">
              <span className="text-[13px] font-semibold text-ink">¥</span>
              <input
                ref={amountInputRef}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-24 bg-transparent text-right text-[13px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]"
              />
            </div>
          </FormRow>

          <FormRow
            icon="🕒"
            tone="bg-[#e8f5ff] text-[#5a9fd4]"
            label="时间"
            onSelect={() => timeInputRef.current?.showPicker?.() ?? timeInputRef.current?.focus()}
          >
            <span className="relative flex cursor-pointer items-center justify-end gap-1">
              <span className="text-[13px] font-semibold text-ink">{formatTimeLabel(time)}</span>
              <span className="text-[11px] text-[#d7a3a8]">›</span>
              <input
                ref={timeInputRef}
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                tabIndex={-1}
                aria-hidden
              />
            </span>
          </FormRow>

          <FormRow
            icon={category?.icon ?? "🏷️"}
            tone="bg-[#fff3e0] text-[#e09a4a]"
            label="分类"
            onSelect={() => setOpenPicker(openPicker === "category" ? null : "category")}
          >
            <span className="flex items-center justify-end gap-1 text-[13px] font-semibold text-ink">
              <span className={category ? "text-ink" : "text-[#d4b0ae]"}>
                {category?.label ?? "选择分类"}
              </span>
              <span className="text-[11px] text-[#d7a3a8]">›</span>
            </span>
          </FormRow>

          <FormRow
            icon={mood?.emoji ?? "🙂"}
            tone="bg-[#f3edfb] text-lilac-deep"
            label="情绪"
            onSelect={() => setOpenPicker(openPicker === "mood" ? null : "mood")}
          >
            <span className="flex items-center justify-end gap-1 text-[13px] font-semibold text-ink">
              <span className={mood ? "text-ink" : "text-[#d4b0ae]"}>
                {mood ? `${mood.emoji} ${mood.label}` : "选择情绪"}
              </span>
              <span className="text-[11px] text-[#d7a3a8]">›</span>
            </span>
          </FormRow>

          <FormRow
            icon={pool ? poolMeta[pool.id].icon : "🧺"}
            tone={pool ? poolMeta[pool.id].tone : "bg-[#eef7f2] text-mint-deep"}
            label="放入池子"
            onSelect={() => setOpenPicker(openPicker === "pool" ? null : "pool")}
          >
            <span className="flex items-center justify-end gap-1 text-[13px] font-semibold text-ink">
              <span className={pool ? "text-ink" : "text-[#d4b0ae]"}>
                {pool?.name ?? "选择池子"}
              </span>
              <span className="text-[11px] text-[#d7a3a8]">›</span>
            </span>
          </FormRow>

          <FormRow
            icon="📝"
            tone="bg-[#fff7e8] text-[#c99a4a]"
            label="备注"
            onSelect={() => noteInputRef.current?.focus()}
          >
            <input
              ref={noteInputRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="写点什么吧…"
              maxLength={50}
              className="w-full bg-transparent text-right text-[13px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]"
            />
          </FormRow>
        </div>
      </section>

      {openPicker === "category" && (
        <PickerCard title="选择分类">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategoryId(item.id);
                  setOpenPicker(null);
                }}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-[12px] ${
                  categoryId === item.id
                    ? "bg-[#ffe6e8] font-bold text-rose"
                    : "bg-[#faf4f0] text-[#8a6f6f]"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </PickerCard>
      )}

      {openPicker === "mood" && (
        <PickerCard title="选择情绪">
          <div className="grid grid-cols-3 gap-2">
            {moods.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMoodId(item.id);
                  setOpenPicker(null);
                }}
                className={`flex flex-col items-center rounded-2xl py-3 text-[11px] ${
                  moodId === item.id
                    ? "bg-[#ffe6e8] font-bold text-rose"
                    : "bg-[#faf4f0] text-[#8a6f6f]"
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>
        </PickerCard>
      )}

      {openPicker === "pool" && (
        <PickerCard title="选择池子">
          <div className="space-y-2">
            {budgetPools.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setPoolId(item.id);
                  setOpenPicker(null);
                }}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left ${
                  poolId === item.id
                    ? "bg-[#ffe6e8] font-bold text-rose"
                    : "bg-[#faf4f0] text-[#8a6f6f]"
                }`}
              >
                <span className="flex items-center gap-2 text-[13px]">
                  <span>{poolMeta[item.id].icon}</span>
                  {item.name}
                </span>
                <span className="text-[10px] font-medium opacity-70">{item.tag}</span>
              </button>
            ))}
          </div>
        </PickerCard>
      )}

      {saved && (
        <p className="rounded-2xl bg-[#eef8f3] py-2 text-center text-[12px] font-semibold text-mint-deep">
          {pool ? `已记入「${pool.name}」${poolMeta[pool.id].icon}` : "已记录成功 🎉"}
        </p>
      )}

      {!saved && error && (
        <p className="rounded-2xl bg-[#ffe4e6] py-2 text-center text-[12px] font-semibold text-rose">
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-3xl">
        <img
          src="/illust-quick-footer.jpg"
          alt=""
          className="h-auto w-full object-cover object-center"
          draggable={false}
        />
      </section>

      <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
        <button
          type="button"
          onClick={resetForm}
          className="rounded-full bg-[#fff3ef] py-3 text-[14px] font-bold text-[#c49a96]"
        >
          重新输入
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)]"
        >
          确认记录
        </button>
      </div>
    </div>
  );
}

function FormRow({
  icon,
  tone,
  label,
  children,
  onSelect,
}: {
  icon: string;
  tone: string;
  label: string;
  children: ReactNode;
  onSelect?: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-[#fff9f8] px-3 py-2.5 ${
        onSelect ? "cursor-pointer transition-transform active:scale-[0.99]" : ""
      }`}
    >
      <span className="flex min-w-0 items-center gap-2 text-[13px] text-muted">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] ${tone}`}>
          {icon}
        </span>
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function PickerCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white/90 p-4 shadow-[0_8px_20px_rgba(255,140,148,0.08)]">
      <p className="mb-3 text-[12px] font-bold text-[#8a6f6f]">{title}</p>
      {children}
    </section>
  );
}
