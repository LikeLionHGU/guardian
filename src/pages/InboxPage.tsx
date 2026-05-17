import React, { useState } from 'react';
import { AnalysisResult } from '../types/complaint';
import { UrgencyBadge, CategoryBadge, StatusBadge } from '../components/Badge';
import { ChevronLeft, ChevronRight, User, Sparkles, Filter } from 'lucide-react';
import { ActiveTab } from '../App';

interface InboxPageProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const InboxPage: React.FC<InboxPageProps> = ({ history, onSelectResult, setActiveTab }) => {
  const [subTab, setSubTab] = useState<'all' | 'teacher' | 'admin' | 'routing' | 'auto'>('all');
  const [page, setPage] = useState(1);

  const filteredHistory = history.filter(item => {
    if (subTab === 'teacher') return item.teacherReviewRequired;
    if (subTab === 'admin') return item.adminReportRequired;
    if (subTab === 'routing') return item.routingTarget === '행정실';
    if (subTab === 'auto') return !item.teacherReviewRequired && !item.adminReportRequired;
    return true;
  });

  const totalCount = history.length || 24;
  const autoCount = history.filter(h => !h.teacherReviewRequired && !h.adminReportRequired).length || 18;
  const urgentCount = history.filter(h => h.urgency === '높음' || h.urgency === '즉시 확인 필요').length || 3;

  return (
    <div className="space-y-8 pb-20 max-w-7xl">
      {/* Sub Tabs */}
      <div className="border-b border-slate-200 flex space-x-8 text-sm font-bold text-slate-500 overflow-x-auto">
        <button
          onClick={() => setSubTab('all')}
          className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap ${subTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'}`}
        >
          전체
        </button>
        <button
          onClick={() => setSubTab('teacher')}
          className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap ${subTab === 'teacher' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'}`}
        >
          교사 확인 필요
        </button>
        <button
          onClick={() => setSubTab('routing')}
          className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap ${subTab === 'routing' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'}`}
        >
          행정실 이관
        </button>
        <button
          onClick={() => setSubTab('admin')}
          className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap ${subTab === 'admin' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'}`}
        >
          관리자 검토
        </button>
        <button
          onClick={() => setSubTab('auto')}
          className={`pb-3.5 border-b-2 transition-colors whitespace-nowrap ${subTab === 'auto' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-800'}`}
        >
          자동 해결 완료
        </button>
      </div>

      {/* 4 Summary Cards (Inbox specific) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">오늘 접수된 민원</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-extrabold text-blue-600">{totalCount}</span>
            <span className="text-sm font-semibold text-slate-600">건</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">AI 자동 해결</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{autoCount}</span>
            <span className="text-sm font-semibold text-slate-600">건</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">집중 검토 필요</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-extrabold text-red-600">{urgentCount}</span>
            <span className="text-sm font-semibold text-slate-600">건</span>
          </div>
        </div>

        {/* Selected Card with Dashed Border */}
        <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-blue-500 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">평균 처리 시간</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">12</span>
            <span className="text-sm font-semibold text-slate-600">분</span>
          </div>
        </div>
      </div>

      {/* Complaint List Cards */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-xs">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">분류된 민원 내역이 없습니다</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">다른 탭을 선택하거나 새로운 민원을 입력해보세요.</p>
            <button
              onClick={() => setActiveTab('input')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xs hover:bg-blue-700"
            >
              민원 분석 시작하기
            </button>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1 min-w-0 cursor-pointer" onClick={() => onSelectResult(item)}>
                {/* Badges */}
                <div className="flex items-center space-x-2.5">
                  <UrgencyBadge level={item.urgency} />
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    <CategoryBadge category={item.category} />
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-blue-600 transition-colors truncate">
                  &ldquo;{item.input.title}&rdquo;
                </h3>

                {/* Footer Tags */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.routingTarget} 권장</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-blue-600">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>AI 정제 완료</span>
                  </div>
                  <StatusBadge target={item.routingTarget} adminRequired={item.adminReportRequired} className="scale-90 origin-left" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => onSelectResult(item)}
                  className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  내용 확인
                </button>
                <button
                  onClick={() => onSelectResult(item)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  답변 작성
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredHistory.length > 0 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setPage(1)} className={`w-9 h-9 rounded-full font-extrabold text-sm flex items-center justify-center transition-all ${page === 1 ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-50'}`}>
            1
          </button>
          <button onClick={() => setPage(2)} className={`w-9 h-9 rounded-full font-extrabold text-sm flex items-center justify-center transition-all ${page === 2 ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-50'}`}>
            2
          </button>
          <button onClick={() => setPage(3)} className={`w-9 h-9 rounded-full font-extrabold text-sm flex items-center justify-center transition-all ${page === 3 ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-50'}`}>
            3
          </button>
          <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
