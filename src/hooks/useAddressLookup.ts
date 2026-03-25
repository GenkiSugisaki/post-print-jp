import { useState, useEffect, useRef } from 'react';

interface AddressResult {
  prefecture: string;
  city: string;
  town: string;
}

interface UseAddressLookupResult {
  address: AddressResult | null;
  loading: boolean;
  error: string | null;
}

export function useAddressLookup(zipcode: string): UseAddressLookupResult {
  const [address, setAddress] = useState<AddressResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const digits = zipcode.replace(/-/g, '');
    if (digits.length !== 7) {
      // 输入无效时立即清空上次 fetch 结果，避免显示陈旧地址。
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAddress(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    timerRef.current = setTimeout(() => {
      fetch(`https://geoapi.heartrails.com/api/json?method=searchByPostal&postal=${digits}`)
        .then((res) => {
          if (!res.ok) throw new Error('network_error');
          return res.json();
        })
        .then((json) => {
          if (!cancelled) {
            const locations: { prefecture: string; city: string; town: string }[] = json?.response?.location ?? [];
            if (locations.length > 0) {
              const { prefecture, city, town } = locations[0];
              setAddress({ prefecture, city, town: town ?? '' });
            } else {
              setAddress(null);
            }
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setAddress(null);
            setError('住所の自動取得に失敗しました。手動で入力してください。');
            setLoading(false);
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [zipcode]);

  return { address, loading, error };
}
