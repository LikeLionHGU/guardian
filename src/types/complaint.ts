export type ChannelType = '전화' | '문자' | '메신저' | '이메일' | '방문';
export type TimeType = '업무시간' | '업무 외 시간';
export type RepeatedType = '처음' | '반복';
export type SafetyRelatedType = '예' | '아니오' | '모르겠음';

export interface ComplaintInput {
  title: string;
  gradeClass: string;
  channel: ChannelType;
  timeType: TimeType;
  content: string;
  isRepeated: RepeatedType;
  safetyRelated: SafetyRelatedType;
}

export type ComplaintCategory =
  | '단순 행정 문의'
  | '수업/과제 문의'
  | '성적/평가 문의'
  | '생활지도 문의'
  | '학교폭력/안전 문의'
  | '감정적 항의'
  | '악성 민원 의심'
  | '기타';

export type UrgencyLevel = '낮음' | '보통' | '높음' | '즉시 확인 필요';

export type RoutingTarget =
  | '담임교사'
  | '교과교사'
  | '행정실'
  | '생활지도부'
  | '상담교사'
  | '관리자/교감'
  | '학교폭력 담당'
  | '교육청 또는 외부 기관 검토 필요';

export type RecommendedAction =
  | '일반 확인'
  | '업무 시간 내 확인'
  | '빠른 확인 필요'
  | '관리자 공유 필요'
  | '즉시 대응 필요'
  | '기록 보존 필요';

export interface AnalysisResult {
  id: string;
  timestamp: string; // ISO string
  input: ComplaintInput;
  category: ComplaintCategory;
  urgency: UrgencyLevel;
  routingTarget: RoutingTarget;
  recommendedAction: RecommendedAction;
  teacherReviewRequired: boolean;
  adminReportRequired: boolean;
  normalizedSummary: string;
  reasoning: string;
  riskTags: string[];
}
