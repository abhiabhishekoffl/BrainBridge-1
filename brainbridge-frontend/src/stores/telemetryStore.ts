import { create } from 'zustand';

export interface TelemetryData {
  game: string;
  reaction_time: number;
  errors: number;
  completion_time: number;
}

interface TelemetryState {
  data: TelemetryData[];
  addTelemetry: (data: TelemetryData) => void;
  clearTelemetry: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  data: [],
  addTelemetry: (newData) => set((state) => ({ data: [...state.data, newData] })),
  clearTelemetry: () => set({ data: [] })
}));
