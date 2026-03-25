
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipientForm } from './RecipientForm';
import type { AppState } from '../../types';
import { DEFAULT_ENVELOPE_ID } from '../../constants/envelopes';

const BASE_STATE: AppState = {
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

describe('RecipientForm', () => {
  it('個人モードで氏名フィールドを表示する', () => {
    render(<RecipientForm state={BASE_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText('氏名')).toBeInTheDocument();
    expect(screen.queryByLabelText('会社名')).not.toBeInTheDocument();
  });

  it('法人モードで会社名・部署名・担当者名フィールドを表示する', () => {
    const state = { ...BASE_STATE, recipientType: '法人' as const };
    render(<RecipientForm state={state} onChange={vi.fn()} />);
    expect(screen.getByLabelText('会社名')).toBeInTheDocument();
    expect(screen.getByLabelText('部署名（任意）')).toBeInTheDocument();
    expect(screen.getByLabelText('担当者名（任意）')).toBeInTheDocument();
    expect(screen.queryByLabelText('氏名')).not.toBeInTheDocument();
  });

  it('トグルクリックで recipientType が変わる', () => {
    const onChange = vi.fn();
    render(<RecipientForm state={BASE_STATE} onChange={onChange} />);
    fireEvent.click(screen.getByText('法人'));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ recipientType: '法人' }));
  });
});
