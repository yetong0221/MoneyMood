import { useCallback, useState } from "react";
import { todayRecords, type TodayRecord } from "./data";

const STORAGE_KEY = "moneymood-records-v1";

function isValidRecord(r: unknown): r is TodayRecord {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    (o.poolId === "need" || o.poolId === "joy" || o.poolId === "buffer") &&
    typeof o.title === "string" &&
    typeof o.amount === "number" &&
    typeof o.time === "string" &&
    typeof o.moodId === "string"
  );
}

export function loadRecords(): TodayRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...todayRecords];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...todayRecords];
    const list = parsed.filter(isValidRecord);
    return list.length > 0 ? list : [...todayRecords];
  } catch {
    return [...todayRecords];
  }
}

export function persistRecords(list: TodayRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function useRecords() {
  const [records, setRecords] = useState<TodayRecord[]>(loadRecords);

  const save = useCallback((next: TodayRecord[]) => {
    setRecords(next);
    persistRecords(next);
  }, []);

  const addRecord = useCallback(
    (input: Omit<TodayRecord, "id">) => {
      const item: TodayRecord = {
        ...input,
        id: `r${Date.now()}`,
      };
      save([item, ...records]);
      return item;
    },
    [records, save],
  );

  const updateRecord = useCallback(
    (id: string, patch: Partial<Omit<TodayRecord, "id">>) => {
      save(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    },
    [records, save],
  );

  const deleteRecord = useCallback(
    (id: string) => {
      save(records.filter((r) => r.id !== id));
    },
    [records, save],
  );

  return { records, addRecord, updateRecord, deleteRecord };
}
