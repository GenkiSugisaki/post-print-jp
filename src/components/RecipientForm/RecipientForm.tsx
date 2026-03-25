
import type { AppState, RecipientType } from '../../types';
import { TextInput } from '../common/TextInput';

interface Props {
  state: AppState;
  onChange: (patch: Partial<AppState>) => void;
}

export function RecipientForm({ state, onChange }: Props) {
  const handleTypeChange = (type: RecipientType) => {
    onChange({ recipientType: type, companyName: '', department: '', personName: '' });
  };

  return (
    <div className="space-y-5">
      <h2 className="m-0 font-mincho text-lg md:text-xl font-semibold tracking-[0.12em] text-sumi pb-3.5 border-b border-hairline-light">
        受取人
      </h2>

      {/* 個人 / 法人 toggle */}
      <div className="inline-flex border border-hairline bg-washi-light">
        {(['個人', '法人'] as RecipientType[]).map((type, idx) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            className={`px-6 py-2.5 font-mincho text-sm tracking-[0.15em] transition-colors ${
              idx > 0 ? 'border-l border-hairline' : ''
            } ${
              state.recipientType === type
                ? 'bg-sumi text-washi'
                : 'bg-transparent text-muted hover:text-sumi'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {state.recipientType === '法人' && (
        <>
          <TextInput
            label="会社名"
            value={state.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="例:株式会社〇〇"
          />
          <TextInput
            label="部署名（任意）"
            value={state.department}
            onChange={(e) => onChange({ department: e.target.value })}
            placeholder="例:営業部"
          />
          <TextInput
            label="担当者名（任意）"
            value={state.personName}
            onChange={(e) => onChange({ personName: e.target.value })}
            placeholder="例:田中太郎"
            hint="入力した場合、担当者に「様」、部署名・会社名に「御中」は付きません"
            autoComplete="off"
          />
        </>
      )}

      {state.recipientType === '個人' && (
        <TextInput
          label="氏名"
          value={state.personName}
          onChange={(e) => onChange({ personName: e.target.value })}
          placeholder="例:山田花子"
          autoComplete="off"
        />
      )}
    </div>
  );
}
