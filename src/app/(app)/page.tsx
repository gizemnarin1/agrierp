'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Sparkles, PlusCircle, User } from 'lucide-react';

import DashboardTab from '@/components/tabs/DashboardTab';
import AssistantTab from '@/components/tabs/AssistantTab';
import ManualTab from '@/components/tabs/ManualTab';
import ProfileTab from '@/components/tabs/ProfileTab';

const tabs = [
  { id: 'dashboard', name: 'Özet', icon: LayoutDashboard, component: DashboardTab },
  { id: 'assistant', name: 'AI Asistan', icon: Sparkles, component: AssistantTab },
  { id: 'manual', name: 'Manuel Giriş', icon: PlusCircle, component: ManualTab },
  { id: 'profile', name: 'Profil', icon: User, component: ProfileTab },
];

export default function SpaPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleTabChange = (index: number) => {
    setDirection(index > activeTabIndex ? 1 : -1);
    setActiveTabIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTabIndex < tabs.length - 1) {
        handleTabChange(activeTabIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (activeTabIndex > 0) {
        handleTabChange(activeTabIndex - 1);
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const ActiveComponent = tabs[activeTabIndex].component;

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.15 },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 overflow-x-hidden w-full" {...handlers}>
      {/* Content Area */}
      <main className="flex-1 px-4 pt-4 relative w-full overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeTabIndex}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-t border-zinc-200 px-6 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl md:border-x md:border-zinc-200">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTabIndex === index;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(index)}
                className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary-green bg-primary-green-light scale-105 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 hover:scale-102'
                }`}
              >
                <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[11px] tracking-wide">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
