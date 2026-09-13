import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { BudgetPage } from "./pages/BudgetPage";
import { HomePage } from "./pages/HomePage";
import { RecordPage } from "./pages/RecordPage";
import { ReviewPage } from "./pages/ReviewPage";
import { useRecords } from "./recordsStore";
import type { TabId } from "./types";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const { records, addRecord, updateRecord, deleteRecord } = useRecords();

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-cream text-ink shadow-[0_0_0_1px_rgba(243,221,212,0.6)] sm:border-x sm:border-[#f3e4dc]">
      <main className="app-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {tab === "home" && (
          <HomePage records={records} onUpdateRecord={updateRecord} onDeleteRecord={deleteRecord} />
        )}
        {tab === "record" && (
          <RecordPage
            onBack={() => setTab("home")}
            onSave={(input) => {
              addRecord(input);
              setTab("home");
            }}
          />
        )}
        {tab === "budget" && <BudgetPage onBack={() => setTab("home")} />}
        {tab === "review" && <ReviewPage onBack={() => setTab("home")} />}
      </main>

      {tab === "home" && (
        <div className="shrink-0 bg-cream px-4 pt-1">
          <button
            type="button"
            onClick={() => setTab("record")}
            className="flex w-full items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3.5 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(255,140,148,0.4)] active:scale-[0.98]"
          >
            + 快速记账
          </button>
        </div>
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
