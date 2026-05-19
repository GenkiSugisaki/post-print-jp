import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { SenderInfo } from '../../types';
import { TextInput } from '../common/TextInput';
import { Button } from '../common/Button';

interface Props {
  isOpen: boolean;
  initial: SenderInfo | null;
  onSave: (info: SenderInfo) => void;
  onClose: () => void;
  onClear?: () => void;
}

const EMPTY: SenderInfo = {
  name: '',
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
  showOnEnvelope: true,
};

export function SenderModal({ isOpen, initial, onSave, onClose, onClear }: Props) {
  const [form, setForm] = useState<SenderInfo>(initial ?? EMPTY);

  useEffect(() => {
    // 弹窗打开时把 prop `initial` 同步到内部 `form`（reset 语义）。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) setForm(initial ?? EMPTY);
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const patch = (p: Partial<SenderInfo>) => setForm((f) => ({ ...f, ...p }));

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const handleClear = () => {
    if (!onClear) return;
    // 共有 PC で前のユーザーの情報が残らないよう、確認後に即時消去。
    if (!window.confirm('保存した差出人情報を削除します。よろしいですか？')) return;
    onClear();
    setForm(EMPTY);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-sumi/40 overflow-y-auto py-4"
      role="dialog"
      aria-modal="true"
      aria-label="差出人情報の設定"
    >
      <div className="bg-washi-light border border-hairline shadow-[0_32px_80px_-32px_rgba(28,26,22,0.5)] w-full max-w-md mx-4 p-7 space-y-5">
        <div>
          <h2 className="m-0 font-mincho text-lg font-semibold tracking-[0.12em] text-sumi pb-3.5 border-b border-hairline-light">
            差出人情報の設定
          </h2>
          {!initial && (
            <p className="mt-4 text-xs text-moegi bg-[#F0EFE4] border-l-[3px] border-moegi px-3 py-2 leading-relaxed">
              <span className="font-mincho text-moegi mr-1">守</span>
              一度設定するだけで、次回から自動的に表示されます。
            </p>
          )}
        </div>

        <TextInput
          label="氏名 / 会社名"
          value={form.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="例:山田花子"
        />

        <div>
          <label className="block font-mincho text-sm font-medium tracking-[0.08em] text-sumi mb-2.5">
            郵便番号
          </label>
          <div className="flex items-center gap-3">
            <span className="font-mincho text-lg text-shu flex-shrink-0">〒</span>
            <input
              className="flex-1 bg-transparent border-0 border-b border-hairline px-0.5 py-2.5 text-[15px] tracking-[0.05em] text-sumi placeholder:text-muted-light placeholder:font-light focus:outline-none focus:ring-0 focus:border-kon transition-colors"
              value={form.postalCode}
              onChange={(e) => patch({ postalCode: e.target.value })}
              placeholder="例:100-0001"
            />
          </div>
        </div>

        <TextInput
          label="都道府県"
          value={form.prefecture}
          onChange={(e) => patch({ prefecture: e.target.value })}
          placeholder="例:東京都"
        />
        <TextInput
          label="市区町村"
          value={form.city}
          onChange={(e) => patch({ city: e.target.value })}
          placeholder="例:千代田区"
        />
        <TextInput
          label="番地"
          value={form.addressLine1}
          onChange={(e) => patch({ addressLine1: e.target.value })}
          placeholder="例:1-1"
        />
        <TextInput
          label="建物名・部屋番号（任意）"
          value={form.addressLine2}
          onChange={(e) => patch({ addressLine2: e.target.value })}
          placeholder="例:○○ビル 101号室"
        />

        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-[13px] text-sumi-light">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={form.showOnEnvelope}
            onChange={(e) => patch({ showOnEnvelope: e.target.checked })}
          />
          <span
            className={`w-4 h-4 inline-flex items-center justify-center border text-[11px] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-kon ${
              form.showOnEnvelope
                ? 'bg-kon border-kon text-white'
                : 'bg-white border-hairline text-transparent'
            }`}
            aria-hidden="true"
          >
            ✓
          </span>
          <span>封筒に差出人を印刷する</span>
        </label>

        <div className="flex items-center justify-between gap-3 pt-3">
          {initial && onClear ? (
            <Button variant="ghost" onClick={handleClear} type="button">
              保存した情報を削除
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
