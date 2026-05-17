import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { InboxPage } from './pages/InboxPage';
import { InputPage } from './pages/InputPage';
import { ResultPage } from './pages/ResultPage';
import { AboutPage } from './pages/AboutPage';
import { AnalysisResult, ComplaintInput } from './types/complaint';
import { analyzeComplaint } from './services/complaintAnalyzer';
import { storage } from './services/storage';

export type ActiveTab = 'dashboard' | 'inbox' | 'input' | 'result' | 'about' | 'settings';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [latestResult, setLatestResult] = useState<AnalysisResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 로컬스토리지 초기화 및 로드
  useEffect(() => {
    const init = async () => {
      await storage.initDemoData();
      const loadedHistory = storage.getHistory();
      setHistory(loadedHistory);
      if (loadedHistory.length > 0) {
        setLatestResult(loadedHistory[0]);
      }
    };
    init();
  }, []);

  // 민원 분석 핸들러
  const handleAnalyze = async (input: ComplaintInput) => {
    const res = await analyzeComplaint(input);
    storage.addResult(res);
    setHistory(storage.getHistory());
    setLatestResult(res);
    setActiveTab('result');
  };

  // 대시보드나 수신함에서 항목 선택 핸들러
  const handleSelectResult = (result: AnalysisResult) => {
    setLatestResult(result);
    setActiveTab('result');
  };

  // 검색 필터링된 히스토리
  const searchedHistory = history.filter(item => {
    if (!searchTerm) return true;
    return item.input.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.input.gradeClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.normalizedSummary.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar (Left Fixed) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasLatestResult={latestResult !== null}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (Top Fixed) */}
        <Header
          activeTab={activeTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              history={searchedHistory}
              onSelectResult={handleSelectResult}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'inbox' && (
            <InboxPage
              history={searchedHistory}
              onSelectResult={handleSelectResult}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'input' && (
            <InputPage
              onAnalyze={handleAnalyze}
            />
          )}
          {activeTab === 'result' && (
            <ResultPage
              result={latestResult}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'about' && (
            <AboutPage
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">환경 설정</h2>
              <p className="text-sm text-slate-500 mb-6">알림, 보안 및 계정 연동 설정을 구성할 수 있습니다.</p>
              <button onClick={() => alert('설정이 저장되었습니다.')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm">설정 저장</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
