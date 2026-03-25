import { describe, it, expect } from 'vitest';
import { formatEnvelope } from './formatAddress';
import type { AppState } from '../types';
import { DEFAULT_ENVELOPE_ID } from '../constants/envelopes';

const BASE_STATE: AppState = {
  prefecture: { code: '13', name: '東京都' },
  city: { id: '13101', name: '千代田区' },
  postalCode: '100-0001',
  addressLine1: '1-1',
  addressLine2: '皇居',
  recipientType: '個人',
  companyName: '',
  department: '',
  personName: '山田花子',
  envelopeId: DEFAULT_ENVELOPE_ID,
  layout: '縦書き',
  senderModalOpen: false,
};

describe('formatEnvelope', () => {
  it('個人の住所行を正しく生成する', () => {
    const result = formatEnvelope(BASE_STATE);
    expect(result.addressPrefCity).toBe('東京都千代田区\u30001-1');
    expect(result.addressBuilding).toBe('皇居');
    expect(result.addressLines).toEqual(['東京都千代田区\u30001-1', '皇居']);
    expect(result.postalCode).toBe('100-0001');
  });

  it('空の行はフィルタリングされる', () => {
    const state = { ...BASE_STATE, addressLine2: '' };
    const result = formatEnvelope(state);
    expect(result.addressPrefCity).toBe('東京都千代田区\u30001-1');
    expect(result.addressBuilding).toBeNull();
    expect(result.addressLines).toEqual(['東京都千代田区\u30001-1']);
  });

  it('個人受取人に様が付く', () => {
    const result = formatEnvelope(BASE_STATE);
    expect(result.recipientLines).toContain('山田花子　様');
  });
});
