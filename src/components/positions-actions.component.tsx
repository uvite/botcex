import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import cx from 'clsx';
import { useAtomValue } from 'jotai';
import React from 'react';
import { CgChevronDown } from 'react-icons/cg';
import { FaHospitalSymbol, FaTimesCircle } from 'react-icons/fa';
import { TbCircleMinus, TbCirclePlus, TbExchange } from 'react-icons/tb';
import type { Position } from 'gvm-cex/dist/types';

import { optionsAtom } from '../app-state';
import { useChasePositions } from '../hooks/trade/use-chase.hooks';
import { useIncreasePositions } from '../hooks/use-increase-positions.hooks';
import { useReducePositions } from '../hooks/use-reduce-positions.hooks';
import { useReversePositions } from '../hooks/use-reverse-positions.hooks';

const CustomMenuButton = ({
  className,
  title,
  noChevron,
  onClick,
}: {
  className: string;
  title: React.ReactNode;
  noChevron?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cx(
        'border-2 font-mono font-semibold text-[10px] flex items-center uppercase px-1 rounded-sm cursor-pointer opacity-70 hover:opacity-100 transition-opacity h-[22px]',
        className
      )}
      onClick={onClick}
    >
      <span className={!noChevron ? 'mr-1' : ''}>{title}</span>
      {!noChevron && <CgChevronDown />}
    </div>
  );
};

export const PositionsActionsComponent = ({
  positions,
  displayLongName,
}: {
  displayLongName?: boolean;
  positions: Position[];
}) => {
  const options = useAtomValue(optionsAtom);

  const reversePositions = useReversePositions();
  const reducePositions = useReducePositions();
  const increasePositions = useIncreasePositions();
  const chasePositions = useChasePositions();

  return (
    <span className="flex items-center justify-end">
      <span className="mr-2">
        <Menu
          transition={true}
          menuClassName="bg-dark-bg text-dark-text-white text-sm font-mono font-semibold"
          menuButton={
            <MenuButton>
              <CustomMenuButton
                className="border-orange-500 text-orange-500"
                title={
                  displayLongName ? (
                    'INCREASE ALL'
                  ) : (
                    <TbCirclePlus className="text-[14px]" />
                  )
                }
              />
            </MenuButton>
          }
        >
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => increasePositions({ positions, factor: 0.25 })}
          >
            + 25%
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => increasePositions({ positions, factor: 0.5 })}
          >
            + 50%
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => increasePositions({ positions, factor: 0.75 })}
          >
            + 75%
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => increasePositions({ positions, factor: 1 })}
          >
            + 100%
          </MenuItem>
        </Menu>
      </span>
      <span className="mr-2">
        <Menu
          transition={true}
          menuClassName="bg-dark-bg text-dark-text-white text-sm font-mono font-semibold"
          menuButton={
            <MenuButton>
              <CustomMenuButton
                className="border-purple-500 text-purple-500"
                title={
                  displayLongName ? (
                    'REDUCE ALL'
                  ) : (
                    <TbCircleMinus className="text-[14px]" />
                  )
                }
              />
            </MenuButton>
          }
        >
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => reducePositions({ positions, factor: 0.25 })}
          >
            - 25%
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => reducePositions({ positions, factor: 0.5 })}
          >
            - 50%
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => reducePositions({ positions, factor: 0.75 })}
          >
            - 75%
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => reducePositions({ positions, factor: 1 })}
          >
            - 100%
          </MenuItem>
        </Menu>
      </span>
      <span className="mr-2">
        <CustomMenuButton
          className="text-dark-blue border-dark-blue"
          noChevron={true}
          title={
            displayLongName ? 'REVERSE' : <TbExchange className="text-[14px]" />
          }
          onClick={() => reversePositions({ positions })}
        />
      </span>
      {options.isHedged && (
        <span className="mr-2">
          <CustomMenuButton
            className="text-dark-green border-dark-green"
            noChevron={true}
            title={
              displayLongName ? (
                'HEDGE'
              ) : (
                <FaHospitalSymbol className="text-[12px]" />
              )
            }
            onClick={() =>
              reducePositions({
                positions,
                factor: 1,
                hedge: true,
                forceMarket: true,
              })
            }
          />
        </span>
      )}
      <span>
        <Menu
          transition={true}
          menuClassName="bg-dark-bg text-dark-text-white text-sm font-mono font-semibold"
          menuButton={
            <MenuButton>
              <CustomMenuButton
                className="border-red-500 text-red-500"
                title={
                  displayLongName ? (
                    'CLOSE ALL'
                  ) : (
                    <FaTimesCircle className="text-[11px]" />
                  )
                }
              />
            </MenuButton>
          }
        >
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => reducePositions({ positions, factor: 1 })}
          >
            LIMIT
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() =>
              reducePositions({
                positions,
                factor: 1,
                forceMarket: true,
              })
            }
          >
            MARKET
          </MenuItem>
          <MenuItem
            className="hover:bg-dark-bg-2 text-sm"
            onClick={() => chasePositions({ positions, factor: -1 })}
          >
            CHASE
          </MenuItem>
        </Menu>
      </span>
    </span>
  );
};
