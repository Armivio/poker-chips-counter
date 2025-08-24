import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { SessionData, Player } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const createSession = async (code: string, password?: string): Promise<string> => {
  const sessionId = uuidv4();
  const sessionData: SessionData = {
    code,
    password,
    players: {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
  };

  await setDoc(doc(db, 'sessions', sessionId), sessionData);
  return sessionId;
};

export const joinSession = async (code: string, password?: string): Promise<string | null> => {
  const sessionDoc = await getDoc(doc(db, 'sessions', code));
  
  if (!sessionDoc.exists()) {
    throw new Error('Session not found');
  }

  const sessionData = sessionDoc.data() as SessionData;
  
  if (sessionData.password && sessionData.password !== password) {
    throw new Error('Invalid password');
  }

  if (!sessionData.isActive) {
    throw new Error('Session is not active');
  }

  return sessionDoc.id;
};

export const addPlayer = async (sessionId: string, playerName: string): Promise<Player> => {
  const player: Player = {
    id: uuidv4(),
    name: playerName,
    chips: 0,
    buyIns: [],
    totalBuyIn: 0,
    createdAt: new Date(),
  };

  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    [`players.${player.id}`]: player,
    updatedAt: serverTimestamp(),
  });

  return player;
};

export const updatePlayerChips = async (sessionId: string, playerId: string, chips: number): Promise<void> => {
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    [`players.${playerId}.chips`]: chips,
    updatedAt: serverTimestamp(),
  });
};

export const addBuyIn = async (sessionId: string, playerId: string, amount: number): Promise<void> => {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);
  
  if (!sessionDoc.exists()) {
    throw new Error('Session not found');
  }

  const sessionData = sessionDoc.data() as SessionData;
  const player = sessionData.players[playerId];
  
  if (!player) {
    throw new Error('Player not found');
  }

  const newBuyIn = {
    id: uuidv4(),
    amount,
    timestamp: new Date(),
  };

  const updatedBuyIns = [...player.buyIns, newBuyIn];
  const updatedTotalBuyIn = player.totalBuyIn + amount;

  await updateDoc(sessionRef, {
    [`players.${playerId}.buyIns`]: updatedBuyIns,
    [`players.${playerId}.totalBuyIn`]: updatedTotalBuyIn,
    [`players.${playerId}.chips`]: player.chips + amount,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToSession = (sessionId: string, callback: (sessionData: SessionData | null) => void) => {
  return onSnapshot(doc(db, 'sessions', sessionId), (doc) => {
    if (doc.exists()) {
      callback(doc.data() as SessionData);
    } else {
      callback(null);
    }
  });
};