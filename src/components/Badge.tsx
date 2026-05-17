import React from 'react';
import { UrgencyLevel, ComplaintCategory, RoutingTarget } from '../types/complaint';
import { AlertCircle, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, className = '' }) => {
  if (level === '즉시 확인 필요' || level === '높음') {
    return (
      <span className={`inline-flex items-center space-x-1 text-xs font-bold text-red-600 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>위험도 {level === '즉시 확인 필요' ? '즉시 대응' : '높음'}</span>
      </span>
    );
  } else if (level === '보통') {
    return (
      <span className={`inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 ${className}`}>
        <Clock className="w-3.5 h-3.5 shrink-0" />
        <span>위험도 보통</span>
      </span>
    );
  } else {
    return (
      <span className={`inline-flex items-center text-xs font-medium text-slate-500 px-2.5 py-1 rounded-full bg-slate-100 ${className}`}>
        <span>낮음</span>
      </span>
    );
  }
};

interface StatusBadgeProps {
  target: RoutingTarget;
  adminRequired: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ target, adminRequired, className = '' }) => {
  if (adminRequired || target === '관리자/교감') {
    return (
      <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 border border-indigo-200 ${className}`}>
        관리자 검토
      </span>
    );
  } else if (target === '행정실') {
    return (
      <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
        행정 지원
      </span>
    );
  } else if (target === '생활지도부' || target === '학교폭력 담당') {
    return (
      <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200 ${className}`}>
        학생 지도 이관
      </span>
    );
  } else {
    return (
      <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 border border-blue-200 ${className}`}>
        자동 FAQ 해결 완료
      </span>
    );
  }
};

interface CategoryBadgeProps {
  category: ComplaintCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  let label = category.split('/')[0];
  if (category === '학교폭력/안전 문의') label = '학생 생활';
  if (category === '단순 행정 문의') label = '행정 지원';
  if (category === '성적/평가 문의') label = '학급 운영';

  return (
    <span className={`text-xs font-medium text-slate-700 ${className}`}>
      {label}
    </span>
  );
};
