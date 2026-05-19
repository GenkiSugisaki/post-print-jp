import { useState, useEffect } from 'react';
import type { City } from '../types';
import { PREFECTURES } from '../constants/prefectures';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

interface UseCitySearchResult {
  cities: City[];
  loading: boolean;
  error: string | null;
}

export function useCitySearch(prefectureCode: string | null): UseCitySearchResult {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prefectureCode) {
      // 都道府県未选时立即清空市区町村列表。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCities([]);
      setError(null);
      return;
    }

    const pref = PREFECTURES.find((p) => p.code === prefectureCode);
    if (!pref) {
      setCities([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      method: 'getCities',
      prefecture: pref.name,
    });
    fetchWithTimeout(`https://geoapi.heartrails.com/api/json?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('network_error');
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          const locations: { city: string }[] = json?.response?.location ?? [];
          setCities(locations.map((loc) => ({ id: loc.city, name: loc.city })));
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const isTimeout = err instanceof Error && err.name === 'AbortError';
          setError(
            isTimeout
              ? '通信タイムアウト。手動で入力してください。'
              : '市区町村の取得に失敗しました。ネットワーク未接続の場合、手動で入力してください。',
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [prefectureCode]);

  return { cities, loading, error };
}
