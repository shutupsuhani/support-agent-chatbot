export type CDPPlatform = 'Segment' | 'mParticle' | 'Lytics' | 'Zeotap';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface CDPDocumentation {
  platform: CDPPlatform;
  content: Record<string, string>;
}