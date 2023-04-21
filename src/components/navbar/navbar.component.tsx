import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import React from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { FaTimesCircle } from 'react-icons/fa';
import { FiHelpCircle } from 'react-icons/fi';

import { TradeComponentType } from '../../app.types';
import { wooxBannerAtom } from '../../atoms/marketing.atoms';
import { selectedTradeAtom } from '../../atoms/trade.atoms';
import { useIsChasing } from '../../hooks/trade/use-chase.hooks';
import { twapsAtom } from '../../hooks/trade/use-twap.hooks';
import { useOpenModal } from '../../hooks/use-modal.hooks';
import { useNewVersion } from '../../hooks/use-new-version.hooks';
import { SelectAccountComponent } from '../select-account.component';

import { NavbarActionsComponent } from './navbar-actions.component';
import { NavbarClockComponent } from './navbar-clock.component';
import { NavbarIndicator } from './navbar-indicator.component';
import { NavbarLatencyComponent } from './navbar-latency.component';

export const NavbarComponent = () => {
  const { data: session } = useSession();

  const openSettingsModal = useOpenModal();

  const hasNewVersion = useNewVersion();

  const isChasing = useIsChasing();
  const twapRunning = useAtomValue(twapsAtom).length > 0;

  const setSelectedTrade = useSetAtom(selectedTradeAtom);
  const [displayWOOXBanner, setDisplayWOOXBanner] = useAtom(wooxBannerAtom);

  return (
    <>

      {process.env.STAGE !== 'dev' && hasNewVersion && (
        <div
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 text-white text-center py-2 cursor-pointer border-b-2"
          onClick={() => (window as any).location.reload(true)}
        >
          A new version of <strong>tuleep.trade</strong> is available, click
          here to reload your page.
        </div>
      )}
      {displayWOOXBanner && (
        <div className="bg-gradient-to-r from-[#40ff80] to-[#39e6d7] border-b-2 text-center py-2 relative">
          <a
            href="https://blog.tuleep.trade/woo-x-and-tuleep-trade-competition-1e77e40b4ebb"
            className="font-bold text-dark-bg/75 border-b border-dotted border-1 border-dark-bg"
            target="_blank"
            rel="noreferrer"
          >
            WOO X is now available on tuleep.trade, celebrate with us joining
            our trading competition!
          </a>
          <div
            className="absolute right-3 text-dark-bg/75 top-3 cursor-pointer"
            onClick={() => setDisplayWOOXBanner(false)}
          >
            <FaTimesCircle />
          </div>
        </div>
      )}
      <div className="border-b border-dark-border-gray">
        <div className="py-3 md:py-2 px-4">
          <div className="flex items-center">
            <h1 className="font-bold tracking-widest text-2xl text-dark-text-white">
              <img
                src="/tulip.png"
                alt="tulip"
                className="mr-2 inline w-[30px]"
              />
              <span>tuleep.trade</span>
            </h1>
            {session && (
              <>
                <NavbarLatencyComponent />
                <NavbarActionsComponent />
              </>
            )}
            <div className="ml-auto flex items-center">
              {session && (
                <>
                  <div className="ml-auto">
                    <div className="flex items-center">
                      <div
                        className="text-2xl mr-4 text-dark-text-gray hover:text-dark-text-white transition-colors cursor-pointer"
                        onClick={() => openSettingsModal()}
                      >
                        <AiFillSetting />
                      </div>
                      <SelectAccountComponent />
                    </div>
                  </div>
                  {twapRunning && (
                    <NavbarIndicator
                      label="TWAP"
                      onClick={() => setSelectedTrade(TradeComponentType.Twap)}
                    />
                  )}
                  {isChasing && (
                    <NavbarIndicator
                      label="CHASE"
                      onClick={() => setSelectedTrade(TradeComponentType.Chase)}
                    />
                  )}
                  <NavbarClockComponent />
                </>
              )}
              <a
                className="ml-2 text-3xl text-dark-text-gray hover:text-dark-text-white transition-colors cursor-pointer"
                href="https://docs.tuleep.trade"
                target="_blank"
                rel="noreferrer"
              >
                <FiHelpCircle />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
