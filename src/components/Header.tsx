import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { ActiveTab } from '../App';

interface HeaderProps {
  activeTab: ActiveTab;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, searchTerm, onSearchChange }) => {
  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return '대시보드';
      case 'inbox': return 'AI 분류 민원함';
      case 'input': return '민원 분석 요청';
      case 'result': return '민원 상세 보기';
      case 'about': return '자동 FAQ 내역';
      case 'settings': return '환경 설정';
      default: return '대시보드';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
      {/* Left Title */}
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-bold text-blue-600 tracking-tight">
          {getPageTitle(activeTab)}
        </h2>
      </div>

      {/* Right Controls (Search & Icons) */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative w-64 sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="민원 검색..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border-none text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 text-slate-600">
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative" title="알림">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="도움말">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
