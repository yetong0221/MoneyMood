import { useState } from "react";

/**
 * 可任意键入的数字输入框：聚焦后用本地 draft 编辑，失焦 / 回车才提交。
 * 之前直接用受控 number + 即时 clamp，导致删空、逐位输入时被立刻钳回去，看起来像“改不成任意数字”。
 */
export function PlanNumberInput({
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
        const next = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
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
