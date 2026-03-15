import { create } from 'zustand';

interface SessionState {
  sessionId: string | null;
  childId: string | null;
  currentGameIndex: number;
  setSession: (sessionId: string, childId: string) => void;
  nextGame: () => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  childId: null,
  currentGameIndex: 0, // 0: Letter Mirror, 1: Number Jump, 2: Focus Catcher
  setSession: (sessionId, childId) => set({ sessionId, childId, currentGameIndex: 0 }),
  nextGame: () => set((state) => ({ currentGameIndex: state.currentGameIndex + 1 })),
  resetSession: () => set({ sessionId: null, childId: null, currentGameIndex: 0 })
}));
