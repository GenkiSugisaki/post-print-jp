
import { ENVELOPES } from '../../constants/envelopes';
import { Select } from '../common/Select';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function EnvelopeSelector({ value, onChange }: Props) {
  return (
    <Select
      label="封筒サイズ"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {ENVELOPES.map((env) => (
        <option key={env.id} value={env.id}>
          {env.name}（{env.widthMm}×{env.heightMm}mm・{env.description}）
        </option>
      ))}
    </Select>
  );
}
