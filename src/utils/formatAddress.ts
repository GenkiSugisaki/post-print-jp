import type { AppState } from '../types';
import { buildRecipientLines } from './honorific';

export interface FormattedEnvelope {
  postalCode: string;
  addressPrefCity: string;       // "東京都新宿区　西新宿二丁目八番一号"
  addressBuilding: string | null; // "○○マンション 101号室"
  addressLines: string[];         // [addressPrefCity, addressBuilding?] for backward compat
  recipientLines: string[];
  recipientOrg: string | null;
  recipientDept: string | null;
  recipientName: string | null;
}

export function formatEnvelope(state: AppState): FormattedEnvelope {
  const prefCity = [state.prefecture?.name ?? '', state.city?.name ?? ''].filter(Boolean).join('');
  const addressPrefCity = [prefCity, state.addressLine1].filter((l) => l.trim() !== '').join('\u3000');
  const addressBuilding = state.addressLine2.trim() !== '' ? state.addressLine2 : null;
  const addressLines: string[] = [addressPrefCity, addressBuilding].filter(
    (l): l is string => l !== null && l.trim() !== ''
  );

  const { companyLine, departmentLine, nameLine } = buildRecipientLines(
    state.recipientType,
    state.companyName,
    state.department,
    state.personName
  );

  const recipientLines: string[] = [companyLine, departmentLine, nameLine].filter(
    (l): l is string => l !== null && l.trim() !== ''
  );

  const recipientOrg: string | null = companyLine ?? null;
  const recipientDept: string | null = departmentLine ?? null;
  const recipientName: string | null = nameLine ?? null;

  return {
    postalCode: state.postalCode,
    addressPrefCity,
    addressBuilding,
    addressLines,
    recipientLines,
    recipientOrg,
    recipientDept,
    recipientName,
  };
}
