import { Switch } from '@headlessui/react';
import { ControlledMenu, MenuItem, useClick } from '@szhsin/react-menu';
import cx from 'clsx';
import { useAtom } from 'jotai';
import React, { useRef, useState } from 'react';
import { TbAppWindow } from 'react-icons/tb';

import { AppBlock } from '../../app.types';
import { hiddenBlocksAtom } from '../../atoms/app.atoms';

const labels: Partial<Record<AppBlock, string>> = {
  [AppBlock.TickerInfo]: 'Ticker infos',
  [AppBlock.Logs]: 'Terminal logs',
  [AppBlock.OrderBook]: 'Order book',
};

export const NavbarToggleBlocksComponent = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const anchorProps = useClick(isOpen, setIsOpen);

  const [hiddenBlocks, setHiddenBlocks] = useAtom(hiddenBlocksAtom);

  const toggleBlock = (block: AppBlock) => () => {
    if (hiddenBlocks.includes(block)) {
      setHiddenBlocks(hiddenBlocks.filter((b) => b !== block));
    } else {
      setHiddenBlocks([...hiddenBlocks, block]);
    }
  };

  return (
    <div className="w-14 h-[45px] mr-4">
      <button
        ref={ref}
        type="button"
        className={cx(
          'flex flex-col items-center justify-center border rounded-sm w-full h-full cursor-pointer select-none last:mr-0 border-dark-border-gray-2 text-dark-border-gray-2 hover:border-dark-blue hover:text-dark-blue',
          { 'border-dark-blue': isOpen }
        )}
        {...anchorProps}
      >
        <div className="text-2xl">
          <TbAppWindow />
        </div>
        <div className="font-mono text-[10px] uppercase text-center font-semibold">
          <div>Layout</div>
        </div>
      </button>

      <ControlledMenu
        anchorRef={ref}
        state={isOpen ? 'open' : 'closed'}
        transition={true}
        menuClassName="bg-dark-bg text-dark-text-white text-sm font-semibold rounded-md"
        onClose={() => setIsOpen(false)}
        onItemClick={(event) => {
          // eslint-disable-next-line no-param-reassign
          event.keepOpen = true;
        }}
      >
        {Object.entries(AppBlock).map(([key, value]) => (
          <MenuItem
            key={key}
            className="hover:bg-dark-bg-2 px-4"
            onClick={toggleBlock(value)}
          >
            <div className="flex items-center w-full">
              <div className="flex-1 ">
                <span className="capitalize mr-8">
                  {labels[value] || value}
                </span>
              </div>
              <div>
                <Switch
                  className={cx(
                    hiddenBlocks.includes(value)
                      ? 'bg-dark-blue/50'
                      : 'bg-dark-blue',
                    'relative inline-flex h-[19px] w-[37px] shrink-0 cursor-pointer rounded-full border-[1px] border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-[1px]  focus-visible:ring-white focus-visible:ring-opacity-75'
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      !hiddenBlocks.includes(value)
                        ? 'translate-x-[1.125rem]'
                        : 'translate-x-0',
                      'pointer-events-none inline-block h-[17px] w-[17px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>
            </div>
          </MenuItem>
        ))}
      </ControlledMenu>
    </div>
  );
};
