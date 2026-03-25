import { describe, it, expect } from 'vitest';
import { computeScale, mmToPx } from './envelopeScale';

describe('computeScale', () => {
  it('長形3号 (120mm) は 400px コンテナでスケールを計算する', () => {
    const scale = computeScale(120, 400);
    expect(scale).toBeCloseTo(400 / (120 * (96 / 25.4)), 2);
  });

  it('スケールは1を超えない（拡大しない）', () => {
    const scale = computeScale(50, 400); // tiny envelope in large container
    expect(scale).toBeLessThanOrEqual(1);
  });

  it('コンテナ幅がエンベロープより小さい場合はスケールダウン', () => {
    const scale = computeScale(200, 400);
    expect(scale).toBeLessThan(1);
  });
});

describe('mmToPx', () => {
  it('10mmを正しくpxに変換する', () => {
    expect(mmToPx(10)).toBeCloseTo(10 * (96 / 25.4), 2);
  });
});
