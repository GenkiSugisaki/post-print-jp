import { describe, it, expect } from 'vitest';
import { formatSender } from './formatSender';

describe('formatSender', () => {
  it('showOnEnvelope=falseの場合nullを返す', () => {
    const sender = {
      name: '差出人',
      postalCode: '000-0000',
      prefecture: '大阪府',
      city: '大阪市',
      addressLine1: '1-2',
      addressLine2: '',
      showOnEnvelope: false,
    };
    expect(formatSender(sender)).toBeNull();
  });

  it('nullの場合nullを返す', () => {
    expect(formatSender(null)).toBeNull();
  });

  it('showOnEnvelope=trueの場合FormattedSenderを返す', () => {
    const sender = {
      name: '差出人',
      postalCode: '000-0000',
      prefecture: '大阪府',
      city: '大阪市',
      addressLine1: '1-2',
      addressLine2: 'テストビル3F',
      showOnEnvelope: true,
    };
    const result = formatSender(sender);
    expect(result).not.toBeNull();
    expect(result!.postalCode).toBe('000-0000');
    expect(result!.address).toBe('大阪府大阪市1-2');
    expect(result!.building).toBe('テストビル3F');
    expect(result!.name).toBe('差出人');
  });

  it('住所が空白なしで連結される', () => {
    const sender = {
      name: '山田花子',
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '新宿区',
      addressLine1: '歌舞伎町2-4-8',
      addressLine2: '○○マンション10F号室',
      showOnEnvelope: true,
    };
    const result = formatSender(sender);
    expect(result!.address).toBe('東京都新宿区歌舞伎町2-4-8');
    expect(result!.building).toBe('○○マンション10F号室');
  });

  it('建物名が空の場合nullになる', () => {
    const sender = {
      name: '差出人',
      postalCode: '000-0000',
      prefecture: '大阪府',
      city: '大阪市',
      addressLine1: '1-2',
      addressLine2: '',
      showOnEnvelope: true,
    };
    const result = formatSender(sender);
    expect(result!.building).toBeNull();
  });
});
