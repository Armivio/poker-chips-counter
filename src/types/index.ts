export interface Player {
  id: string;
  name: string;
  chips: number;
  buyIns: BuyIn[];
  totalBuyIn: number;
  createdAt: Date;
}

export interface BuyIn {
  id: string;
  amount: number;
  timestamp: Date;
}

export interface Session {
  id: string;
  code: string;
  password?: string;
  players: Player[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface SessionData {
  code: string;
  password?: string;
  players: { [playerId: string]: Player };
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
}