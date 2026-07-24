export interface Card {
  id: string;
  value: string;
  numericValue: number | null;
  type: 'fibonacci' | 'special';
  color: string;
  label: string;
  description: string;
}

export type CardDeckType = 'standard' | 'extended' | 'tshirt';

export interface VoteHistory {
  id: string;
  value: string;
  timestamp: number;
  note?: string;
}

export interface AppSettings {
  deckType: CardDeckType;
  darkMode: boolean;
  soundEnabled: boolean;
  hapticFeedback: boolean;
  tapToReveal: boolean; // default true: cards are hidden at first when shown full screen, so they can reveal it manually
  keepScreenOn: boolean;
}
