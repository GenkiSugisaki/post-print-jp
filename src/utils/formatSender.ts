import type { SenderInfo } from '../types';

export interface FormattedSender {
  postalCode: string | null;
  address: string | null;
  building: string | null;
  name: string | null;
}

export function formatSender(sender: SenderInfo | null): FormattedSender | null {
  if (!sender || !sender.showOnEnvelope) return null;

  const postalCode = sender.postalCode || null;

  const prefCity = [sender.prefecture, sender.city].filter(Boolean).join('');
  const addressFull = [prefCity, sender.addressLine1].filter((l) => l.trim() !== '').join('');
  const address = addressFull || null;

  const building = sender.addressLine2.trim() !== '' ? sender.addressLine2 : null;

  const name = sender.name.trim() !== '' ? sender.name : null;

  return { postalCode, address, building, name };
}
