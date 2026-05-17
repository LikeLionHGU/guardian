import React, { useState } from 'react';
import { AnalysisResult } from '../types/complaint';
import { ActiveTab } from '../App';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Bot, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

interface ResultPageProps {
  result: AnalysisResult | null;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, setActiveTab }) => {
  const [showRawText, setShowRawText] = useState(false);

  if (!result) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-xl mx-auto my-12">
        <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">분석된 상세 데이터가 없습니다</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          대시보드 또는 수신함에서 민원 항목을 클릭하거나, 새로운 민원을 분석해주세요.
        </p>
        <button
          onClick={() => setActiveTab('input')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all"
        >
          민원 분석 요청하기
        </button>
      </div>
    );
  }

  const { input, category, urgency, routingTarget, recommendedAction, normalizedSummary, reasoning, riskTags, timestamp } = result;

  const hasHarmful = riskTags.includes('위협성 표현') || riskTags.includes('강한 항의') || riskTags.includes('교권 침해 가능성');
  
  // 간단한 숫자 변환 해시
  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString().substr(0, 4);
  };
  const complaintNumber = `#2026-${simpleHash(input.title)}`;

  return (
    <div className="space-y-6 pb-20 max-w-7xl">
      {/* Top Status & Step Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
            title="돌아가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-extrabold px-3 py-1 bg-blue-600 text-white rounded-full tracking-wider">
                접수번호: {complaintNumber}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                Status: Complete
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-2">
              {new Date(timestamp).toLocaleString()} 접수 ({input.channel} / {input.timeType})
            </p>
          </div>
        </div>

        {/* 3 Step Visual Bar */}
        <div className="w-full md:w-auto flex items-center justify-center space-x-4 sm:space-x-8 px-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">1</div>
            <span className="text-xs font-bold text-blue-600 mt-1">본인인증</span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-blue-600 mb-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">2</div>
            <span className="text-xs font-bold text-blue-600 mt-1">정보입력</span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-blue-600 mb-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">3</div>
            <span className="text-xs font-bold text-blue-600 mt-1">신청완료</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Report vs Right Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel (2 Columns span) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Refined Deliverable Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-blue-600 px-8 py-5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight">✨ 교사용 AI 정제 전달본</span>
              </div>
              <span className="text-xs font-semibold text-blue-200 bg-blue-700/80 px-2.5 py-1 rounded-lg">AI Analysis V2.0</span>
            </div>

            <div className="p-8 space-y-8">
              {/* Summary Header */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">민원 요약</span>
                <p className="text-xl font-bold text-slate-900 leading-relaxed">
                  {normalizedSummary}
                </p>
              </div>

              {/* 4 Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Category</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">{category}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Handler</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">{routingTarget}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Risk</span>
                  <span className={`text-sm font-bold mt-1 block ${urgency === '높음' || urgency === '즉시 확인 필요' ? 'text-red-600' : 'text-blue-600'}`}>
                    🚨 {urgency === '즉시 확인 필요' ? '즉시 대응' : urgency}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Status</span>
                  <span className="text-sm font-bold text-blue-600 mt-1 block">Complete</span>
                </div>
              </div>

              {/* Harmful Alert Box (if applicable) */}
              {hasHarmful && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start space-x-3 text-red-800">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Harmful Content Detected (Included)</h4>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      원문 내 부적절한 언어 또는 공격성 표현이 감지되었습니다. 정제된 내용을 먼저 검토하십시오.
                    </p>
                  </div>
                </div>
              )}

              {/* Info Notice Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">i</div>
                <div>
                  <h4 className="text-sm font-bold">안내 사항</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    교사에게는 정제된 요약본이 우선 제공되며, 원문은 필요 시 하단에서 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Text Accordion Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="w-full px-8 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3 text-slate-800">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="text-base font-bold">원문 열람하기</span>
              </div>
              {showRawText ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {showRawText && (
              <div className="p-8 border-t border-slate-200 bg-slate-50/50 space-y-4 font-medium text-sm text-slate-800 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-3 border-b border-slate-200">
                  <span>작성자: {input.gradeClass} 학부모</span>
                  <span>접수 채널: {input.channel} ({input.timeType})</span>
                </div>
                {input.content}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* AI Recommendations Box */}
          <div className="bg-indigo-50/80 rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-6">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
              <Bot className="w-5 h-5 text-blue-600" />
              <span>AI 추천 처리</span>
            </div>

            <div className="bg-white rounded-xl p-5 border border-indigo-100/80 shadow-2xs">
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {recommendedAction} - {reasoning.split('.')[0] || '담임교사 1차 공유를 권장합니다.'}.
              </p>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-800">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-900" />
                <span>관련 교육청 지침 및 규정 확인</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-900" />
                <span>해당 학생 면담 및 사실 관계 파악</span>
              </div>
              {hasHarmful && (
                <div className="flex items-center space-x-2 text-red-700">
                  <CheckCircle2 className="w-4 h-4 text-red-600" />
                  <span>관리자 사전 보고 및 법적 보호 요청</span>
                </div>
              )}
            </div>

            <button
              onClick={() => alert('추천 답변 초안이 클립보드에 복사되었습니다.')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>추천 답변 초안 생성</span>
            </button>
          </div>

          {/* Previous History Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900">이전 민원 이력</h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400">2024.03.15</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">학급 준비물 관련 문의</h4>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Resolved</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400">2023.11.20</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">급식 메뉴 영양 정보 요청</h4>
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Archived</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('inbox')}
              className="w-full py-2.5 text-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors block pt-2 border-t border-slate-100"
            >
              전체 이력 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
