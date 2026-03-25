import { describe, it, expect } from 'vitest';
import { buildRecipientLines } from './honorific';

describe('buildRecipientLines', () => {
  describe('個人', () => {
    it('氏名に「様」を付ける', () => {
      const result = buildRecipientLines('個人', '', '', '山田花子');
      expect(result.nameLine).toBe('山田花子　様');
      expect(result.companyLine).toBeNull();
      expect(result.departmentLine).toBeNull();
    });

    it('氏名が空の場合はnullを返す', () => {
      const result = buildRecipientLines('個人', '', '', '');
      expect(result.nameLine).toBeNull();
    });
  });

  describe('法人 – 担当者なし', () => {
    it('会社名に「御中」を付ける', () => {
      const result = buildRecipientLines('法人', '株式会社Example', '', '');
      expect(result.companyLine).toBe('株式会社Example　御中');
      expect(result.nameLine).toBeNull();
    });

    it('部署名がある場合は部署名に「御中」を付ける', () => {
      const result = buildRecipientLines('法人', '株式会社Example', '営業部', '');
      expect(result.companyLine).toBe('株式会社Example');
      expect(result.departmentLine).toBe('営業部　御中');
    });
  });

  describe('法人 – 担当者あり', () => {
    it('会社名に御中なし、担当者に「様」を付ける', () => {
      const result = buildRecipientLines('法人', '株式会社Example', '営業部', '田中太郎');
      expect(result.companyLine).toBe('株式会社Example');
      expect(result.departmentLine).toBe('営業部');
      expect(result.nameLine).toBe('田中太郎　様');
    });

    it('部署名なし・担当者ありの場合', () => {
      const result = buildRecipientLines('法人', '株式会社Example', '', '田中太郎');
      expect(result.companyLine).toBe('株式会社Example');
      expect(result.departmentLine).toBeNull();
      expect(result.nameLine).toBe('田中太郎　様');
    });
  });

  describe('法人 – 会社名なし', () => {
    it('会社名が空の場合はすべてnull', () => {
      const result = buildRecipientLines('法人', '', '営業部', '田中太郎');
      expect(result.companyLine).toBeNull();
      expect(result.departmentLine).toBeNull();
      expect(result.nameLine).toBeNull();
    });
  });
});
