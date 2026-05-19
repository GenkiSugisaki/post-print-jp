import { useState } from 'react';
import type { AppState } from './types';
import { DEFAULT_ENVELOPE_ID } from './constants/envelopes';
import { useSenderStorage } from './hooks/useSenderStorage';
import { AddressForm } from './components/AddressForm/AddressForm';
import { RecipientForm } from './components/RecipientForm/RecipientForm';
import { SenderModal } from './components/SenderModal/SenderModal';
import { EnvelopeSelector } from './components/EnvelopeSelector/EnvelopeSelector';
import { LayoutToggle } from './components/LayoutToggle/LayoutToggle';
import { PrintPreview } from './components/PrintPreview/PrintPreview';
import { Button } from './components/common/Button';
import { printEnvelope } from './utils/printEnvelope';

const INITIAL_STATE: AppState = {
  prefecture: null,
  city: null,
  postalCode: '',
  addressLine1: '',
  addressLine2: '',
  recipientType: '個人',
  companyName: '',
  department: '',
  personName: '',
  envelopeId: DEFAULT_ENVELOPE_ID,
  layout: '縦書き',
  senderModalOpen: false,
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [sender, saveSender, clearSender] = useSenderStorage();
  const [autoOpened, setAutoOpened] = useState(!sender);

  const senderModalOpen = state.senderModalOpen || autoOpened;
  const patch = (p: Partial<AppState>) => setState((s) => ({ ...s, ...p }));


  return (
    <div id="app-shell" className="min-h-screen bg-[#E5DECA]">
      <div className="max-w-[1280px] mx-auto bg-washi border border-hairline shadow-[0_32px_80px_-32px_rgba(28,26,22,0.25),0_4px_12px_rgba(28,26,22,0.06)] my-0 md:my-6">
        {/* Header */}
        <header className="flex items-center justify-between px-6 md:px-12 py-6 md:py-7 border-b border-hairline">
          <h1 className="m-0 font-mincho text-xl md:text-[26px] font-semibold tracking-[0.2em] text-sumi">
            宛先ラベル印刷
          </h1>
          <button
            onClick={() => patch({ senderModalOpen: true })}
            className="w-9 h-9 border border-hairline bg-washi-light inline-flex items-center justify-center text-sumi-light hover:bg-white transition-colors"
            title="差出人情報の設定"
            aria-label="差出人情報の設定"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </header>

        {/* Privacy notice */}
        <div className="mx-4 md:mx-12 mt-4 md:mt-6 bg-[#F0EFE4] border-l-[3px] border-moegi px-4 md:px-5 py-3.5 flex items-center gap-3 md:gap-3.5 text-xs md:text-[13px] text-sumi-light leading-relaxed">
          <span className="font-mincho text-moegi text-base leading-none flex-shrink-0">守</span>
          <div><b className="font-semibold text-sumi mr-1">個人情報保護：</b>入力された情報はサーバーに送信・保存されません。すべてお使いのブラウザ内でのみ処理されます。</div>
        </div>

        {/* Main two-column layout */}
        <main className="px-4 md:px-12 py-7 md:py-7 pb-12 md:pb-16 grid grid-cols-1 lg:grid-cols-[1fr_540px] gap-6 lg:gap-8">
          {/* Left: Forms */}
          <form onSubmit={(e) => e.preventDefault()} autoComplete="off" className="space-y-6">
            <div className="bg-washi-light border border-hairline p-6 md:p-9">
              <AddressForm state={state} onChange={patch} />
            </div>
            <div className="bg-washi-light border border-hairline p-6 md:p-9">
              <RecipientForm state={state} onChange={patch} />
            </div>
            <div className="bg-washi-light border border-hairline p-6 md:p-9 space-y-5">
              <h2 className="m-0 font-mincho text-lg md:text-xl font-semibold tracking-[0.12em] text-sumi pb-3.5 border-b border-hairline-light">
                封筒設定
              </h2>
              <EnvelopeSelector
                value={state.envelopeId}
                onChange={(id) => patch({ envelopeId: id })}
              />
              <LayoutToggle
                value={state.layout}
                onChange={(layout) => patch({ layout })}
              />
            </div>
          </form>

          {/* Right: Preview + Print (sticky) */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-washi-light border border-hairline p-6 md:p-9">
              <h2 className="m-0 font-mincho text-lg md:text-xl font-semibold tracking-[0.12em] text-sumi pb-3.5 mb-5 border-b border-hairline-light">
                プレビュー
              </h2>
              <PrintPreview state={state} sender={sender} />
              <p className="mt-5 text-xs text-muted leading-relaxed">
                普通のA4用紙にも印刷できます。印刷後、封筒の実寸に合わせて切り取り、貼り付けてください。
              </p>
              <Button
                className="mt-5 w-full py-4 text-[15px] tracking-[0.3em]"
                onClick={() => printEnvelope()}
              >
                印刷
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Sender Modal */}
      <SenderModal
        isOpen={senderModalOpen}
        initial={sender}
        onSave={(info) => {
          saveSender(info);
          setAutoOpened(false);
          patch({ senderModalOpen: false });
        }}
        onClose={() => {
          setAutoOpened(false);
          patch({ senderModalOpen: false });
        }}
        onClear={() => {
          clearSender();
          // モーダルは開いたまま — onboarding メッセージへ戻り、入力し直しまたはキャンセル可能。
          setAutoOpened(true);
        }}
      />
    </div>
  );
}
