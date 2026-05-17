import React from 'react';
import { ShieldCheck, HeartPulse, Split, Lock, Scale, Sparkles, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from '../App';

interface AboutPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 pb-20 max-w-7xl">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-600" />
          <span>발표용 MVP 소개 자료</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          선생님의 마음을 지키는 <br className="hidden sm:inline" />
          <span className="text-blue-600">AI 스마트 민원 라우팅 시스템</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
          감정적 항의와 불만 메시지가 교사에게 닿기 전, AI가 먼저 어조와 핵심을 분석하여 최적의 담당 부서로 자동 이관합니다.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden border border-blue-500/20">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-4">
          <span className="text-xs uppercase font-black tracking-widest text-blue-300 bg-blue-800/80 px-3 py-1 rounded-md">PROBLEM</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            무방비하게 노출되는 교사의 감정적 소모와 심야 연락
          </h2>
          <p className="text-blue-100 text-sm sm:text-base font-medium leading-relaxed">
            교사는 정규 업무 시간 외에도 개인 연락처, 메신저 등을 통해 학부모의 자극적이고 감정적인 민원을 여과 없이 접하게 됩니다. 이는 교권 침해 및 교사의 심리적 탈진(Burn-out)을 초래하는 핵심 원인입니다.
          </p>
        </div>
      </div>

      {/* 2. Solution Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">1차 방어: AI 감정 정화 필터</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            학부모가 전송한 거친 어조, 비난, 고소/신고 위협성 발언을 AI가 실시간으로 분석합니다. 교사에게는 감정적 단어를 배제하고 사실 관계만을 담은 &ldquo;순화된 요약&rdquo;을 제공하여 정신적 충격을 완화합니다.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <Split className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">2차 방어: 스마트 라우팅 및 관리자 개입</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            급식, 서류 등 단순 행정은 &ldquo;행정실&rdquo;로 직통 배정하여 교사 확인을 생략합니다. 반면 학교폭력이나 아동학대 신고 위협 등 고위험 민원은 &ldquo;관리자 및 생활지도부&rdquo;로 자동 보고하여 조직적 대응을 가능하게 합니다.
          </p>
        </div>
      </div>

      {/* 3. Expected Benefits Grid (4 Cards) */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">시스템 도입의 4대 핵심 기대 효과</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-start space-x-4">
            <HeartPulse className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-900">교사의 감정적 부담 완화</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                감정 노동의 최전선에 있던 교사가 필터링된 리포트를 확인함으로써 심리적 안정감과 교육에 집중할 수 있는 에너지를 되찾습니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-start space-x-4">
            <Lock className="w-8 h-8 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-900">업무 시간과 사생활의 완벽한 분리</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                업무 외 시간에 접수된 메시지는 별도 뱃지가 부착되며, 즉시 대응이 불필요한 사안은 업무 시간 내 확인으로 안내하여 사생활을 보호합니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-start space-x-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-900">민원 대응 우선순위 명확화</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                단순 문의와 긴급 안전/폭력 사안을 구분하여, 촌각을 다투는 위험 상황에 학교의 자원이 우선 투입되도록 지원합니다.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-start space-x-4">
            <Scale className="w-8 h-8 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-900">관리자 보고 건 자동 분류</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                법적 조치나 고위험 어조가 포함된 민원은 자동으로 교감/교장 등 관리자에게 알림을 발송하여 개인이 아닌 학교 차원의 법적/행정적 보호망을 가동합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Policy Alignment */}
      <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden text-center space-y-6">
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs uppercase font-black tracking-widest text-blue-200 px-3 py-1 bg-blue-700/80 rounded-md inline-block">POLICY ALIGNMENT</span>
        <h2 className="text-2xl sm:text-3xl font-black text-white max-w-2xl mx-auto tracking-tight leading-snug">
          &ldquo;이 서비스는 단순한 앱이 아니라 교권 보호 제도와 함께 작동합니다&rdquo;
        </h2>
        <p className="text-blue-100 text-sm sm:text-base max-w-3xl mx-auto font-medium leading-relaxed">
          AI 라우터 시스템은 교육청의 민원 통합 관리 조례 및 교원 보호 공제 사업과 연계되어야 합니다.
          악성 민원 의심 판정 시 자동으로 녹취 안내 및 교권보호위원회 개최 사전 고지 시스템과 연동되도록 확장이 가능합니다.
        </p>

        <div className="pt-4">
          <button
            onClick={() => setActiveTab('input')}
            className="px-8 py-4 bg-white text-blue-600 font-extrabold text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            지금 AI 민원 분석 테스트해보기
          </button>
        </div>
      </div>
    </div>
  );
};
