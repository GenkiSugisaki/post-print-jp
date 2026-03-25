import { useState, useEffect, useRef } from 'react';

interface UsePostalLookupResult {
  zipcode: string | null;
  loading: boolean;
  error: string | null;
}

export function usePostalLookup(prefecture: string, city: string, town: string = ''): UsePostalLookupResult {
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!prefecture.trim() || !city.trim()) {
      // 都道府県/市区町村未填时立即清空上次 fetch 的邮编。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZipcode(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const townStr = town.trim();

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams({
        method: 'getTowns',
        prefecture: prefecture.trim(),
        city: city.trim(),
      });
      fetch(`https://geoapi.heartrails.com/api/json?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error('network_error');
          return res.json();
        })
        .then((json) => {
          if (!cancelled) {
            const locations: { postal: string; town: string }[] = json?.response?.location ?? [];
            if (locations.length === 0) {
              setZipcode(null);
            } else {
              let match = locations[0];
              if (townStr) {
                const exact = locations.find((l) => l.town === townStr);
                if (exact) {
                  match = exact;
                } else {
                  const partial = locations
                    .filter((l) => townStr.startsWith(l.town))
                    .sort((a, b) => b.town.length - a.town.length);
                  if (partial.length > 0) match = partial[0];
                }
              }
              setZipcode(match.postal.replace(/^(\d{3})(\d{4})$/, '$1-$2'));
            }
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setZipcode(null);
            setError('郵便番号の自動取得に失敗しました。手動で入力してください。');
            setLoading(false);
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prefecture, city, town]);

  return { zipcode, loading, error };
}
