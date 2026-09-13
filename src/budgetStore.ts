import { useCallback, useState } from "react";
import {
  monthBudgetSeed,
  savingsGoalsSeed,
  yearGoalSeed,
  type MonthBudgetState,
  type PoolId,
  type SavingsGoal,
  type YearGoal,
} from "./data";

const MONTH_KEY = "moneymood-month-budget-v1";
const GOALS_KEY = "moneymood-savings-goals-v1";
const YEAR_KEY = "moneymood-year-goal-v1";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return { ...fallback, ...(parsed as object) } as T;
    return fallback;
  } catch {
    return fallback;
  }
}

function loadList<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function useMonthBudget() {
  const [month, setMonth] = useState<MonthBudgetState>(() => load(MONTH_KEY, monthBudgetSeed));

  const update = useCallback((patch: Partial<MonthBudgetState>) => {
    setMonth((prev) => {
      const next = { ...prev, ...patch };
      persist(MONTH_KEY, next);
      return next;
    });
  }, []);

  const setPoolTotal = useCallback(
    (id: PoolId, total: number) => {
      setMonth((prev) => {
        const next = { ...prev, poolTotals: { ...prev.poolTotals, [id]: Math.max(0, total) } };
        persist(MONTH_KEY, next);
        return next;
      });
    },
    [],
  );

  return { month, update, setPoolTotal };
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>(() => loadList(GOALS_KEY, savingsGoalsSeed));

  const updateGoal = useCallback((id: string, patch: Partial<Omit<SavingsGoal, "id">>) => {
    setGoals((prev) => {
      const next = prev.map((g) => (g.id === id ? { ...g, ...patch } : g));
      persist(GOALS_KEY, next);
      return next;
    });
  }, []);

  const addToGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) => {
      const next = prev.map((g) =>
        g.id === id ? { ...g, saved: Math.max(0, Math.round(g.saved + amount)) } : g,
      );
      persist(GOALS_KEY, next);
      return next;
    });
  }, []);

  return { goals, updateGoal, addToGoal };
}

export function useYearGoal() {
  const [goal, setGoal] = useState<YearGoal>(() => load(YEAR_KEY, yearGoalSeed));

  const update = useCallback((patch: Partial<YearGoal>) => {
    setGoal((prev) => {
      const next = { ...prev, ...patch };
      persist(YEAR_KEY, next);
      return next;
    });
  }, []);

  return { goal, update };
}
