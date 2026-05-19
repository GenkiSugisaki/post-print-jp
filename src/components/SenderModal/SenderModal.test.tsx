
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SenderModal } from './SenderModal';
import type { SenderInfo } from '../../types';

const STORED: SenderInfo = {
  name: '山田太郎',
  postalCode: '100-0001',
  prefecture: '東京都',
  city: '千代田区',
  addressLine1: '1-1',
  addressLine2: '',
  showOnEnvelope: true,
};

describe('SenderModal', () => {
  it('isOpen=falseの場合はレンダリングされない', () => {
    render(<SenderModal isOpen={false} initial={null} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('isOpen=trueの場合はモーダルが表示される', () => {
    render(<SenderModal isOpen={true} initial={null} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('initial=nullの場合はオンボーディングメッセージが表示される', () => {
    render(<SenderModal isOpen={true} initial={null} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText(/一度設定するだけで/)).toBeInTheDocument();
  });

  it('保存ボタンクリックでonSaveが呼ばれる', () => {
    const onSave = vi.fn();
    render(<SenderModal isOpen={true} initial={null} onSave={onSave} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('保存'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('キャンセルボタンクリックでonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    render(<SenderModal isOpen={true} initial={null} onSave={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('キャンセル'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('initial=nullの場合は削除ボタンは表示されない', () => {
    render(
      <SenderModal
        isOpen={true}
        initial={null}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.queryByText('保存した情報を削除')).not.toBeInTheDocument();
  });

  it('initialがあり、onClearが渡された場合は削除ボタンが表示される', () => {
    render(
      <SenderModal
        isOpen={true}
        initial={STORED}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    expect(screen.getByText('保存した情報を削除')).toBeInTheDocument();
  });

  it('削除ボタン → confirm承認 → onClearが呼ばれる', () => {
    const onClear = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(
      <SenderModal
        isOpen={true}
        initial={STORED}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onClear={onClear}
      />,
    );
    fireEvent.click(screen.getByText('保存した情報を削除'));
    expect(onClear).toHaveBeenCalledTimes(1);
    confirmSpy.mockRestore();
  });

  it('削除ボタン → confirm拒否 → onClearは呼ばれない', () => {
    const onClear = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(
      <SenderModal
        isOpen={true}
        initial={STORED}
        onSave={vi.fn()}
        onClose={vi.fn()}
        onClear={onClear}
      />,
    );
    fireEvent.click(screen.getByText('保存した情報を削除'));
    expect(onClear).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
