export interface EnvelopeDef {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export const ENVELOPES: EnvelopeDef[] = [
  { id: 'nagagata-3', name: '長形3号', widthMm: 120, heightMm: 235, description: 'A4横三つ折り' },
  { id: 'nagagata-4', name: '長形4号', widthMm: 90,  heightMm: 205, description: 'B5横四つ折り' },
];

export const DEFAULT_ENVELOPE_ID = 'nagagata-3';
