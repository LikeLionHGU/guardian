import React from 'react';
import { AnalysisResult } from '../types/complaint';
import { UrgencyBadge, StatusBadge, CategoryBadge } from '../components/Badge';
import { Bot, AlertTriangle, Building, ShieldCheck, ChevronRight, Plus } from 'lucide-react';
import { ActiveTab } from '../App';

interface DashboardProps {
  history: AnalysisResult[];
  onSelectResult: (result: AnalysisResult) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ history, onSelectResult, setActiveTab }) => {
  const autoResolvedCount = history.filter(h => h.routingTarget === '담임교사' && !h.teacherReviewRequired && !h.adminReportRequired).length || 18;
  const teacherReviewCount = history.filter(h => h.teacherReviewRequired).length || 4;
  const adminRoutingCount = history.filter(h => h.routingTarget === '행정실').length || 7;
  const adminCount = history.filter(h => h.adminReportRequired).length || 2;

  return (
    <div className="space-y-8 pb-20 relative min-h-[calc(100vh-4rem)]">
      {/* Greeting Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          안녕하세요, 김지현 선생님
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          오늘의 민원 현황을 확인하세요.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Selected (Blue border) */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">AI FAQ 자동 해결</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{autoResolvedCount}</span>
              <span className="text-sm font-semibold text-slate-600">건</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100/80">
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              ↗ 어제 대비 +3
            </span>
          </div>
        </div>

        {/* Card 2: Teacher Review Needed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">교사 확인 필요</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{teacherReviewCount}</span>
              <span className="text-sm font-semibold text-slate-600">건</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600">
              즉시 대응 권장
            </span>
          </div>
        </div>

        {/* Card 3: Admin Routing */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">행정실 이관 완료</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{adminRoutingCount}</span>
              <span className="text-sm font-semibold text-slate-600">건</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-400">
              처리 완료율 85%
            </span>
          </div>
        </div>

        {/* Card 4: Admin Report Needed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">관리자 검토 필요</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900">{adminCount}</span>
              <span className="text-sm font-semibold text-slate-600">건</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-400">
              1차 검토 승인 대기
            </span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-slate-900">최근 접수된 민원</h2>
          <button
            onClick={() => setActiveTab('inbox')}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            전체 보기
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3.5 px-6">민원 내용</th>
                <th className="py-3.5 px-6">카테고리</th>
                <th className="py-3.5 px-6">현재 상태</th>
                <th className="py-3.5 px-6">위험도</th>
                <th className="py-3.5 px-6 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-800">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    접수된 민원 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                history.slice(0, 6).map(item => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectResult(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 group-hover:text-blue-600 transition-colors max-w-sm truncate">
                      {item.input.title}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge target={item.routingTarget} adminRequired={item.adminReportRequired} />
                    </td>
                    <td className="py-4 px-6">
                      <UrgencyBadge level={item.urgency} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <ChevronRight className="w-5 h-5 text-slate-400 inline-block group-hover:text-blue-600 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button (Right Bottom +) */}
      <div className="fixed right-8 bottom-8 z-30">
        <button
          onClick={() => setActiveTab('input')}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all"
          title="새 민원 분석 요청"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
