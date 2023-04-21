import { useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { createExchange } from 'gvm-cex';
import type { Exchange } from 'gvm-cex/dist/exchanges/base';
import { defaultStore } from 'gvm-cex/dist/store/store.base';
import type { OrderFillEvent, StoreData } from 'gvm-cex/dist/types';
import { OrderSide } from 'gvm-cex/dist/types';
import { clone } from 'gvm-cex/dist/utils/clone';

import { appStateAtom } from '../app-state';
import { isMutedAtom } from '../atoms/app.atoms';
import { errorToast } from '../notifications/error.toast';
import { filledOrderToast } from '../notifications/filled-order.toast';
import { getCORSAnywhere } from '../utils/cors-anywhere.utils';

import { selectedAccountAtom } from './use-accounts.hooks';
import { LogSeverity, logsAtom } from './use-logs.hooks';

export const ConnectorContext = createContext<Exchange | null>(null);

export const useExchangeConnector = () => {
  const [connector, setConnector] = useState<Exchange | null>(null);
  const account = useAtomValue(selectedAccountAtom);
  const setAppState = useSetAtom(appStateAtom);
  const log = useSetAtom(logsAtom);

  const throttledSetAppState = useMemo(
    () => throttle((d) => setAppState(clone(d)), 250, { trailing: true }),
    [setAppState]
  );

  // THIS IS A REALLY UGLY HACK
  // I'm using a ref to store the value of isMutedAtom
  // because the toast function is called from the exchange connector
  // and I can't use useAtomValue inside a useEffect

  const isMuted = useAtomValue(isMutedAtom);
  const isMutedRef = useRef(isMuted);

  // eslint-disable-next-line prettier/prettier
  useEffect(() => { isMutedRef.current = isMuted }, [isMuted]);

  useEffect(() => {
    let _connector: Exchange | null = null;

    if (account) {
      log(
        `[EXCHANGE] Loading account [${account.name}] on [${account.exchange}${
          account.testnet ? ' testnet' : ''
        }]`
      );

      _connector = createExchange(account.exchange, {
        key: account.key,
        secret: account.secret,
        testnet: account.testnet,
        applicationId: account.applicationId,
        passphrase: account.passphrase,
        corsAnywhere: getCORSAnywhere(account.exchange, account.testnet),
      });

      _connector.on('update', (data: StoreData) => {
        throttledSetAppState(data);
      });

      _connector.on('fill', (order: OrderFillEvent) => {
        filledOrderToast(order, isMutedRef.current);

        log(
          `[EXCHANGE] ${order.side === OrderSide.Buy ? 'Bought' : 'Sold'} ${
            order.amount
          } ${order.symbol.replace(/USDT$|BUSD$/, '')} @ ${order.price}`
        );
      });

      _connector.on('error', (error: string) => {
        errorToast(error);
        log(`[EXCHANGE] ${error}`, LogSeverity.Error);
      });

      _connector.on('log', (message: string, severity: LogSeverity) => {
        log(`[EXCHANGE] ${message}`, severity);
      });

      _connector.start();

      setConnector(_connector);
    }

    return () => {
      throttledSetAppState.cancel();
      throttledSetAppState(clone(defaultStore));

      if (_connector) {
        _connector.dispose();
        _connector = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.name]);

  return connector;
};
