import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNavigation } from './components/BottomNavigation';
import { HeroBanner } from './components/HeroBanner';
import { TodaysResultsSection } from './components/TodaysResultsSection';
import { ViewResultsPage } from './components/ViewResultsPage';
import { LotteryCatalog } from './components/LotteryCatalog';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { Footer } from './components/Footer';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { AuthModal } from './components/AuthModal';
import { TicketPurchaseModal } from './components/TicketPurchaseModal';
import { DrawSlot, LotteryGame } from './types';

function MainApp() {
  const {
    user,
    isAdmin,
    activeModal,
    setActiveModal,
    selectedLotteryForBuy,
    setSelectedLotteryForBuy,
  } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [draws, setDraws] = useState<DrawSlot[]>([]);
  const [lotteries, setLotteries] = useState<LotteryGame[]>([]);

  const fetchAppData = async () => {
    try {
      const [drawsRes, lotRes] = await Promise.all([
        fetch('/api/draws/today'),
        fetch('/api/lotteries'),
      ]);

      const drawsData = await drawsRes.json();
      const lotData = await lotRes.json();

      if (drawsData.draws) setDraws(drawsData.draws);
      if (lotData.lotteries) setLotteries(lotData.lotteries);
    } catch (err) {
      console.error('Failed to fetch initial app data:', err);
    }
  };

  useEffect(() => {
    fetchAppData();
    const interval = setInterval(fetchAppData, 8000); // Live poll results
    return () => clearInterval(interval);
  }, []);

  const handleOpenBuyModalForGame = (game: LotteryGame) => {
    if (!user) {
      setActiveModal('login');
      return;
    }
    setSelectedLotteryForBuy(game);
    setActiveModal('buy_ticket');
  };

  const handleOpenBuyModalForSlot = (slot: DrawSlot) => {
    if (!user) {
      setActiveModal('login');
      return;
    }
    const defaultGame = lotteries[0] || {
      id: 'lot-30m',
      title: 'Luxe 30-Min Rapid Jackpot',
      ticketPrice: 50,
      winningDigitsCount: 4,
    };
    setSelectedLotteryForBuy(defaultGame);
    setActiveModal('buy_ticket');
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950">
      
      {/* 18+ Mandatory Compliance Gate */}
      <AgeVerificationModal />

      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Views */}
      <main className="flex-1 pb-16 lg:pb-0">
        {currentTab === 'home' && (
          <>
            <HeroBanner
              onPlayClick={() => {
                if (lotteries.length > 0) handleOpenBuyModalForGame(lotteries[0]);
              }}
              onResultsClick={() => setCurrentTab('results')}
            />

            <TodaysResultsSection
              draws={draws}
              onViewAllResults={() => setCurrentTab('results')}
              onBuyForSlot={handleOpenBuyModalForSlot}
            />

            <LotteryCatalog
              lotteries={lotteries}
              onBuyTicket={handleOpenBuyModalForGame}
            />
          </>
        )}

        {currentTab === 'results' && (
          <ViewResultsPage
            draws={draws}
            onBuyTicketForSlot={handleOpenBuyModalForSlot}
            onRefresh={fetchAppData}
          />
        )}

        {currentTab === 'lotteries' && (
          <LotteryCatalog
            lotteries={lotteries}
            onBuyTicket={handleOpenBuyModalForGame}
          />
        )}

        {currentTab === 'tickets' && (
          <UserDashboard onGoToLotteries={() => setCurrentTab('lotteries')} />
        )}

        {currentTab === 'dashboard' && (
          <UserDashboard onGoToLotteries={() => setCurrentTab('lotteries')} />
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Auth Modal */}
      {(activeModal === 'login' || activeModal === 'register') && (
        <AuthModal
          initialMode={activeModal}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Ticket Purchase Drawer Modal */}
      {activeModal === 'buy_ticket' && selectedLotteryForBuy && (
        <TicketPurchaseModal
          lottery={selectedLotteryForBuy}
          drawSlots={draws}
          onClose={() => {
            setActiveModal('none');
            setSelectedLotteryForBuy(null);
          }}
          onSuccess={() => {
            setActiveModal('none');
            setSelectedLotteryForBuy(null);
            fetchAppData();
          }}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
