import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Exchange } from '../app.types';

export interface Account {
  exchange: Exchange;
  key: string;
  secret: string;
  name: string;
  testnet: boolean;
  selected: boolean;
  applicationId?: string;
  passphrase?: string;
}

export const accountsAtom = atomWithStorage<Account[]>('accounts', []);

export const addAccountAtom = atom(null, (get, set, account: Account) => {
  const prev = get(accountsAtom).map((p) => ({ ...p, selected: false }));
  const merged = [...prev, { ...account, selected: true }];
  set(accountsAtom, merged);
});

export const removeAccountAtom = atom(null, (get, set, accountName: string) => {
  const prev = get(accountsAtom);
  const without = prev.filter((p) => p.name !== accountName);
  set(accountsAtom, without);
});

export const selectedAccountAtom = atom(
  (get) => {
    const accounts = get(accountsAtom);
    return accounts.find((acc) => acc.selected) || accounts[0] || undefined;
  },
  (get, set, accountName: string) => {
    const accounts = get(accountsAtom);
    const account = accounts.find((acc) => acc.name === accountName);

    if (account) {
      set(
        accountsAtom,
        accounts.map((acc) => ({ ...acc, selected: acc.name === accountName }))
      );
    }
  }
);
