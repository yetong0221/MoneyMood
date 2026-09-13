import type { TabId } from "../types";

const tabs: { id: TabId; label: string; icon: "home" | "pen" | "wallet" | "chart" }[] = [
  { id: "home", label: "首页", icon: "home" },
  { id: "record", label: "记账", icon: "pen" },
  { id: "budget", label: "预算", icon: "wallet" },
  { id: "review", label: "复盘", icon: "chart" },
];

function TabIcon({ name, active }: { name: (typeof tabs)[number]["icon"]; active: boolean }) {
  const stroke = active ? "#ff8c94" : "#c4b2b2";
  if (name === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "pen") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 5.5 18.5 10M4 20l1.2-5.3L16.8 3.1a1.6 1.6 0 0 1 2.3 0l1.8 1.8a1.6 1.6 0 0 1 0 2.3L9.3 18.8 4 20Z"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "wallet") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="13" rx="3" stroke={stroke} strokeWidth="1.8" />
        <path d="M3 10h18" stroke={stroke} strokeWidth="1.8" />
        <circle cx="16.5" cy="14.5" r="1.1" fill={stroke} />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19V11M10 19V7M15 19v-5M20 19V5"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BottomNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <nav className="shrink-0 border-t border-[#f3e4dc] bg-white/95 px-2 pt-1.5 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-end justify-around">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="flex min-h-12 min-w-[64px] flex-col items-center justify-center gap-0.5 py-1 active:opacity-70"
            >
              <TabIcon name={tab.icon} active={isActive} />
              <span
                className={`text-[11px] ${isActive ? "font-bold text-rose" : "font-medium text-[#c4b2b2]"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
