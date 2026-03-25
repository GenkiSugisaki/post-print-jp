
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SenderModal } from './SenderModal';

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
});
