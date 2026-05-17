import React from 'react';
import { LayoutDashboard, Inbox, FilePlus2, ShieldCheck, HelpCircle, Settings, X } from 'lucide-react';
import { ActiveTab } from '../App';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasLatestResult: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, hasLatestResult, isMobileOpen, onMobileClose }) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'inbox', label: '수신함', icon: Inbox },
    { id: 'input', label: '민원 분석 요청', icon: FilePlus2 },
    { id: 'result', label: '관리자 검토', icon: ShieldCheck, disabled: !hasLatestResult },
    { id: 'about', label: '자동 FAQ 내역', icon: HelpCircle },
    { id: 'settings', label: '설정', icon: Settings }
  ];

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 h-screen sticky top-0 z-40 select-none shadow-xs">
        {/* Top Section: Logo & Menu */}
        <div className="py-6 px-4">
          {/* Logo */}
          <div className="mb-8 px-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <h1 className="text-2xl font-black text-blue-600 tracking-tight">Guard:Alan</h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wider">교사용 대시보드</p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              if (item.disabled && !isActive) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                      ? 'bg-blue-50/90 text-blue-600 font-bold border border-blue-100 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Teacher Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
              alt="김지현 선생님"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-900 truncate">김지현 선생님</h4>
              <p className="text-xs font-semibold text-slate-400 truncate">서초초등학교</p>
            </div>
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={onMobileClose} />
          <aside className="relative w-72 max-w-full h-full bg-white border-r border-slate-200 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-black text-blue-600 tracking-tight">Guard:Alan</h1>
                <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wider">교사용 대시보드</p>
              </div>
              <button
                type="button"
                onClick={onMobileClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="메뉴 닫기"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-4">
              <nav className="space-y-1.5">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  if (item.disabled && !isActive) return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as ActiveTab);
                        onMobileClose();
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                          ? 'bg-blue-50/90 text-blue-600 font-bold border border-blue-100 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-3 p-2 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt="김지현 선생님"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">김지현 선생님</h4>
                  <p className="text-xs font-semibold text-slate-400 truncate">서초초등학교</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
