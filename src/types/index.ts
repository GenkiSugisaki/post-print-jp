export interface Prefecture {
  code: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}

export interface SenderInfo {
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  showOnEnvelope: boolean;
}

export type RecipientType = '個人' | '法人';
export type LayoutMode = '縦書き' | '横書き';

export interface AppState {
  prefecture: Prefecture | null;
  city: City | null;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  recipientType: RecipientType;
  companyName: string;
  department: string;
  personName: string;
  envelopeId: string;
  layout: LayoutMode;
  senderModalOpen: boolean;
}
