import { create } from 'zustand';
import { CHALLENGES } from '../config/challenges';
import type { Challenge } from '../config/challenges';

interface ChallengeState {
  activeChallenge: Challenge | null;
  setActiveChallenge: (id: string | null) => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  activeChallenge: null,
  setActiveChallenge: (id) => {
    const challenge = CHALLENGES.find(c => c.id === id) || null;
    set({ activeChallenge: challenge });
  }
}));
