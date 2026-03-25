import { useEffect, useRef, useState } from 'react';
import { PREFECTURES } from '../../constants/prefectures';
import { useCitySearch } from '../../hooks/useCitySearch';
import { usePostalLookup } from '../../hooks/usePostalLookup';
import { useAddressLookup } from '../../hooks/useAddressLookup';
import type { AppState } from '../../types';
import { Select } from '../common/Select';
import { TextInput } from '../common/TextInput';

interface Props {
  state: AppState;
  onChange: (patch: Partial<AppState>) => void;
}

export function AddressForm({ state, onChange }: Props) {
  const [autoLookup, setAutoLookup] = useState(true);
  // city name returned by address lookup, waiting for cities list to load
  const pendingCityRef = useRef<string | null>(null);
  // town name returned by address lookup, waiting to be applied after city is set
  const pendingTownRef = useRef<string | null>(null);
  // Track already-applied results to prevent re-application on unrelated re-renders
  const appliedZipcodeRef = useRef<string | null>(null);
  const appliedAddressRef = useRef<object | null>(null);
  // Directional suppression: when one mode auto-fills, suppress the other from reacting
  const suppressMode1Ref = useRef(false); // Mode 2 filled postalCode → don't let Mode 1 overwrite pref/city
  const suppressMode2Ref = useRef(false); // Mode 1 filled pref/city → don't let Mode 2 overwrite postalCode

  const { cities, loading: citiesLoading, error: citiesError } = useCitySearch(
    state.prefecture?.code ?? null
  );

  // Mode 2: prefecture + city + town → zipcode
  const { zipcode, loading: postalLoading, error: postalError } = usePostalLookup(
    state.prefecture?.name ?? '',
    state.city?.name ?? '',
    state.addressLine1
  );

  // Mode 1: zipcode → prefecture + city
  const { address: lookedUpAddress, loading: addressLoading, error: addressError } = useAddressLookup(state.postalCode);

  // Apply Mode 2 result (prefecture + city → zipcode)
  useEffect(() => {
    if (!autoLookup || suppressMode2Ref.current || !zipcode) return;
    if (zipcode === appliedZipcodeRef.current) return;
    appliedZipcodeRef.current = zipcode;
    suppressMode1Ref.current = true; // suppress Mode 1 from reacting to this auto-filled zipcode
    onChange({ postalCode: zipcode });
  }, [zipcode, autoLookup]);

  // Apply Mode 1 result — set prefecture and save city name for later
  useEffect(() => {
    if (!autoLookup || suppressMode1Ref.current || !lookedUpAddress) return;
    if (lookedUpAddress === appliedAddressRef.current) return;
    appliedAddressRef.current = lookedUpAddress;
    const pref = PREFECTURES.find((p) => p.name === lookedUpAddress.prefecture) ?? null;
    if (!pref) return;
    suppressMode2Ref.current = true; // suppress Mode 2 from reacting to this auto-filled pref/city
    pendingCityRef.current = lookedUpAddress.city;
    pendingTownRef.current = lookedUpAddress.town || null;
    onChange({ prefecture: pref, city: null });
  }, [lookedUpAddress, autoLookup]);

  // Once cities load, apply the pending city from Mode 1
  useEffect(() => {
    if (!autoLookup || !pendingCityRef.current || cities.length === 0) return;
    const city = cities.find((c) => c.name === pendingCityRef.current) ?? null;
    if (city) {
      const town = pendingTownRef.current;
      pendingCityRef.current = null;
      pendingTownRef.current = null;
      onChange({ city, ...(town ? { addressLine1: town } : {}) });
    }
  }, [cities, autoLookup]);

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const pref = PREFECTURES.find((p) => p.code === code) ?? null;
    // User manually changed address → allow Mode 2 to auto-fill zipcode, suppress Mode 1
    suppressMode1Ref.current = true;
    suppressMode2Ref.current = false;
    appliedZipcodeRef.current = null;
    onChange({ prefecture: pref, city: null, postalCode: '' });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const city = cities.find((c) => c.id === id) ?? null;
    // User manually changed city → allow Mode 2 to auto-fill zipcode, suppress Mode 1
    suppressMode1Ref.current = true;
    suppressMode2Ref.current = false;
    appliedZipcodeRef.current = null;
    onChange({ city, postalCode: '' });
  };

  const isSearching = postalLoading || addressLoading;

  return (
    <div className="space-y-5">
      <h2 className="m-0 font-mincho text-lg md:text-xl font-semibold tracking-[0.12em] text-sumi pb-3.5 border-b border-hairline-light">
        送付先住所
      </h2>

      <div>
        <label className="block font-mincho text-sm font-medium tracking-[0.08em] text-sumi mb-2.5">
          郵便番号
        </label>
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <span className="font-mincho text-lg text-shu flex-shrink-0">〒</span>
          <input
            className="flex-1 min-w-[140px] max-w-[280px] bg-transparent border-0 border-b border-hairline px-0.5 py-2.5 text-[15px] tracking-[0.05em] text-sumi placeholder:text-muted-light placeholder:font-light focus:outline-none focus:ring-0 focus:border-kon transition-colors"
            value={state.postalCode}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 7);
              const formatted = digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
              // User manually changed zipcode → allow Mode 1 to auto-fill pref/city, suppress Mode 2
              suppressMode2Ref.current = true;
              suppressMode1Ref.current = false;
              appliedAddressRef.current = null;
              onChange({ postalCode: formatted });
            }}
            placeholder={isSearching && autoLookup ? '検索中...' : '例:100-0001'}
            maxLength={8}
            autoComplete="off"
          />
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-sumi-light whitespace-nowrap">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoLookup}
              onChange={(e) => setAutoLookup(e.target.checked)}
            />
            <span
              className={`w-4 h-4 inline-flex items-center justify-center border text-[11px] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-kon ${
                autoLookup
                  ? 'bg-kon border-kon text-white'
                  : 'bg-white border-hairline text-transparent'
              }`}
              aria-hidden="true"
            >
              ✓
            </span>
            <span>住所自動入力</span>
          </label>
        </div>
        {autoLookup && (
          addressError ? (
            <p className="mt-2 text-xs text-shu">{addressError}</p>
          ) : (
            <p className="mt-2 text-xs text-muted leading-relaxed">
              〒を入力すると都道府県・市区町村が自動入力されます
            </p>
          )
        )}
      </div>

      <Select
        label="都道府県"
        value={state.prefecture?.code ?? ''}
        onChange={handlePrefectureChange}
      >
        <option value="">選択してください</option>
        {PREFECTURES.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </Select>

      <div>
        {citiesError ? (
          <>
            <TextInput
              label="市区町村"
              value={state.city?.name ?? ''}
              onChange={(e) => {
                const name = e.target.value;
                onChange({ city: name ? { id: name, name } : null });
              }}
              placeholder="例:千代田区"
            />
            <p className="mt-2 text-xs text-shu">{citiesError}</p>
          </>
        ) : (
          <>
            <Select
              label="市区町村"
              value={state.city?.id ?? ''}
              onChange={handleCityChange}
              disabled={!state.prefecture || citiesLoading}
            >
              <option value="">
                {citiesLoading ? '読み込み中...' : '選択してください'}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {autoLookup && (
              postalError ? (
                <p className="mt-2 text-xs text-shu">{postalError}</p>
              ) : (
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  都道府県・市区町村を選択すると〒が自動入力されます
                </p>
              )
            )}
          </>
        )}
      </div>

      <TextInput
        label="番地"
        value={state.addressLine1}
        onChange={(e) => onChange({ addressLine1: e.target.value })}
        placeholder="例:1-1"
        hint={autoLookup ? '入力内容に応じて郵便番号が自動的に補正されます' : undefined}
        autoComplete="off"
      />

      <TextInput
        label="建物名・部屋番号"
        value={state.addressLine2}
        onChange={(e) => onChange({ addressLine2: e.target.value })}
        placeholder="例:○○ビル 101号室（任意）"
        autoComplete="off"
      />
    </div>
  );
}
