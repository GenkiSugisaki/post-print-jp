
import type { LayoutMode } from '../../types';

interface Props {
  value: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export function LayoutToggle({ value, onChange }: Props) {
  return (
    <div>
      <p className="block font-mincho text-sm font-medium tracking-[0.08em] text-sumi mb-2.5">
        文字方向
      </p>
      <div className="inline-flex border border-hairline bg-washi-light">
        {(['縦書き', '横書き'] as LayoutMode[]).map((mode, idx) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`px-6 py-2.5 font-mincho text-sm tracking-[0.15em] transition-colors ${
              idx > 0 ? 'border-l border-hairline' : ''
            } ${
              value === mode
                ? 'bg-sumi text-washi'
                : 'bg-transparent text-muted hover:text-sumi'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
