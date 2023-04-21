// import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const wooxBannerAtom = atomWithStorage('wooxBanner', true, {
  ...createJSONStorage(() => localStorage),
  delayInit: true,
} as any);
