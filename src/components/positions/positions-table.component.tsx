import cx from 'clsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import { TableVirtuoso } from 'react-virtuoso';
import type { Position } from 'gvm-cex/dist/types';

import { loadedAtom } from '../../app-state';
import { selectedSymbolAtom } from '../../atoms/trade.atoms';
import {
  orderByPositionsAtom,
  orderPositionsFnAtom,
  usePositions,
} from '../../hooks/use-positions.hooks';
import { PositionsActionsComponent } from '../positions-actions.component';
import { GridBlockComponent } from '../ui/grid-block.component';
import { LoadingComponent } from '../ui/loading.component';

import { PositionRowComponent } from './position-row.component';

const columns: Array<{ label: string; key?: keyof Position }> = [
  { label: 'Symbol', key: 'symbol' },
  { label: 'Leverage' },
  { label: 'Size', key: 'notional' },
  { label: 'Entry/Liq' },
  { label: 'uPNL', key: 'unrealizedPnl' },
  { label: 'Mark price' },
];

const TableComponent = (props: Record<string, any>) => (
  <table {...props} className="table-auto w-full" />
);

const TableRowComponent = (
  props: Record<string, any> & {
    context?: {
      selectedSymbol: string;
      setSelectedSymbol: (symbol: string) => void;
    };
  }
) => (
  <tr
    {...props}
    className={cx(
      'text-dark-text-white hover:bg-dark-border-gray/50 transition-colors cursor-pointer ease-out h-[38px]',
      {
        'bg-dark-border-gray':
          props.context?.selectedSymbol === props.item.symbol,
      }
    )}
    onClick={() => props.context?.setSelectedSymbol?.(props.item.symbol)}
  />
);

export const PositionsTableComponent = ({
  movable = true,
}: {
  movable?: boolean;
}) => {
  const positions = usePositions();
  const { positions: loaded } = useAtomValue(loadedAtom);

  const [orderByAttr, orderByDirection] = useAtomValue(orderByPositionsAtom);
  const orderPositions = useSetAtom(orderPositionsFnAtom);

  const [selectedSymbol, setSelectedSymbol] = useAtom(selectedSymbolAtom);

  return (
    <GridBlockComponent
      movable={movable}
      newWindow="Positions"
      title={
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="font-bold mr-2">Positions</span>
            <span className="text-sm text-dark-text-gray font-mono font-semibold">
              ({positions.length})
            </span>
          </div>
          {positions.length > 0 && (
            <div className="ml-auto">
              <PositionsActionsComponent
                positions={positions}
                displayLongName={true}
              />
            </div>
          )}
        </div>
      }
    >
      <div className="px-2 py-3 h-full overflow-auto no-scrollbar select-none">
        {loaded ? (
          <TableVirtuoso
            className="no-scrollbar"
            context={{ selectedSymbol, setSelectedSymbol }}
            data={positions}
            totalCount={positions.length}
            increaseViewportBy={{ top: 300, bottom: 300 }}
            components={{
              Table: TableComponent,
              TableRow: TableRowComponent,
            }}
            fixedHeaderContent={() => (
              <tr className="font-mono text-xs text-dark-text-gray bg-dark-bg-2">
                <th />
                {columns.map((column) => (
                  <th
                    key={column.label}
                    className={cx('pb-4 text-left transition-colors', {
                      'text-dark-text-white': orderByAttr === column.key,
                      'underline underline-offset-4 cursor-pointer decoration-dotted hover:text-dark-text-white/80':
                        Boolean(column.key),
                    })}
                    onClick={() =>
                      column.key ? orderPositions(column.key) : undefined
                    }
                  >
                    <span className="inline-flex items-center">
                      <span>{column.label}</span>
                      {column.key === orderByAttr && (
                        <span className="ml-3">
                          {orderByDirection === 'asc' ? (
                            <RiSortAsc />
                          ) : (
                            <RiSortDesc />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
                <th className="w-[240px]" />
              </tr>
            )}
            itemContent={(_index, position) => (
              <PositionRowComponent position={position} />
            )}
          />
        ) : (
          <LoadingComponent />
        )}
      </div>
    </GridBlockComponent>
  );
};
