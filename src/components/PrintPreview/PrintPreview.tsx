
import { useRef, useState, useEffect } from 'react';
import type { AppState, SenderInfo } from '../../types';
import { ENVELOPES } from '../../constants/envelopes';
import { formatEnvelope } from '../../utils/formatAddress';
import { formatSender } from '../../utils/formatSender';
import { computeScale, mmToPx } from '../../utils/envelopeScale';
import { LabelLayout } from './LabelLayout';

interface Props {
  state: AppState;
  sender: SenderInfo | null;
}

export function PrintPreview({ state, sender }: Props) {
  const envelope = ENVELOPES.find((e) => e.id === state.envelopeId) ?? ENVELOPES[0];
  const data = formatEnvelope(state);
  const senderData = formatSender(sender);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(380);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width && width > 0) setContainerWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = computeScale(envelope.widthMm, containerWidth);
  const previewWidthPx = mmToPx(envelope.widthMm) * scale;
  // Match the height calculation used in LabelLayout
  const labelHeightMm = state.layout === '縦書き'
    ? Math.min(envelope.heightMm * 0.65, 160)
    : 80;
  const previewHeightPx = mmToPx(labelHeightMm) * scale;

  return (
    <div ref={containerRef}>
      <p className="font-mincho text-[13px] tracking-[0.12em] text-sumi-light mb-4 text-center">
        {envelope.name}（{envelope.widthMm}mm幅）
      </p>

      {/* Preview container — shows the label at scaled size */}
      <div
        className="relative mx-auto overflow-hidden bg-[var(--paper)] shadow-[0_1px_0_rgba(0,0,0,0.02),0_12px_32px_-16px_rgba(28,26,22,0.18)]"
        style={{ width: previewWidthPx, height: previewHeightPx, border: '1px solid var(--hairline)' }}
      >
        <div
          id="print-root"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            display: 'inline-block',
          }}
        >
          <LabelLayout data={data} sender={senderData} widthMm={envelope.widthMm} heightMm={envelope.heightMm} layout={state.layout} />
        </div>
      </div>
    </div>
  );
}
