import { useEffect, useRef, useState } from 'react';
import type { Employee } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function useEmployees(fallbackData: readonly Employee[] = []) {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fallbackRef = useRef(fallbackData);
  fallbackRef.current = fallbackData;

  useEffect(() => {
    let cancelled = false;

    async function fetchEmployees() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/employees`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { employees?: Employee[] };
        const employees = json.employees ?? [];
        if (!cancelled) setData(employees);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch');
          setData([...fallbackRef.current]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEmployees();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
