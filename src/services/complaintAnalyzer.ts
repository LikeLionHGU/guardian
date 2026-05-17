import { AnalysisResult, ComplaintInput, ComplaintCategory, UrgencyLevel, RoutingTarget, RecommendedAction } from '../types/complaint';

export async function analyzeComplaint(input: ComplaintInput): Promise<AnalysisResult> {
  const textToAnalyze = `${input.title} ${input.content}`.toLowerCase();

  // 1. 키워드 사전
  const adminKeywords = ['급식', '납부', '서류', '신청', '일정', '준비물', '행정', '증명서', '스쿨뱅킹', '방과후', '계좌', '이체', '양식'];
  const gradeKeywords = ['성적', '점수', '평가', '시험', '수행평가', '등급', '중간고사', '기말고사', '채점', '정답', '감점', '기준'];
  const safetyKeywords = ['친구', '싸움', '따돌림', '괴롭힘', "폭력", "위협", "다쳤다", "병원", "학폭", "왕따", "때렸", "사고", "안전", "멍", "피", "상처", "치료"];
  
  // 공격성 및 법적 조치 위협 키워드
  const aggressiveKeywords = ['당장', '왜', '문제 있다', '가만 안 둔다', '신고', '교육청', '고소', '경찰', '책임져', '망쳐', '어떻게 할건가요', '사과하세요', '엉망', '아동학대', '민원 넣'];
  
  // 욕설 및 원색적 비난 키워드
  const swearKeywords = ['시발', '씨발', '개새', '병신', '미친', '좆', '닥쳐', '죽여', '쓰레기', '지랄', '새끼', '꺼져', '쳐돌', '싸가지', '눈깔', '주둥이', '돌았', '엿', '개소리', '잡것', '쌍욕'];

  // 2. 초기 상태 판별 변수
  let category: ComplaintCategory = '생활지도 문의';
  let urgency: UrgencyLevel = '보통';
  let routingTarget: RoutingTarget = '담임교사';
  let recommendedAction: RecommendedAction = '일반 확인';
  let teacherReviewRequired = true;
  let adminReportRequired = false;
  const riskTags: Set<string> = new Set();
  const reasoningList: string[] = [];

  // 입력 항목 기반 리스크 태그 및 기본 판별
  if (input.timeType === '업무 외 시간') riskTags.add('업무 외 연락');
  if (input.isRepeated === '반복') {
    riskTags.add('반복 민원');
    adminReportRequired = true;
  }
  if (input.safetyRelated === '예') {
    urgency = '즉시 확인 필요';
    riskTags.add('학생 안전 관련');
  }

  // 비속어 및 욕설 감지
  const hasSwear = swearKeywords.some(kw => textToAnalyze.includes(kw));
  const hasAggressive = aggressiveKeywords.some(kw => textToAnalyze.includes(kw));

  if (hasSwear) {
    adminReportRequired = true;
    urgency = '즉시 확인 필요';
    riskTags.add('위협성 표현');
    riskTags.add('강한 항의');
    riskTags.add('교권 침해 가능성');
    riskTags.add('관리자 공유 권장');
  } else if (hasAggressive) {
    adminReportRequired = true;
    riskTags.add('강한 항의');
    riskTags.add('관리자 공유 권장');
  }

  // 3. 도메인 속성 감지
  const hasSafety = safetyKeywords.some(kw => textToAnalyze.includes(kw)) || input.safetyRelated === '예';
  const hasGrade = gradeKeywords.some(kw => textToAnalyze.includes(kw));
  const hasAdmin = adminKeywords.some(kw => textToAnalyze.includes(kw));

  // 카테고리 및 라우팅 대상 정밀 판별
  if (hasSafety) {
    category = hasSwear ? '악성 민원 의심' : '학교폭력/안전 문의';
    routingTarget = '생활지도부';
    if (textToAnalyze.includes('학폭') || textToAnalyze.includes('폭력') || textToAnalyze.includes('신고') || textToAnalyze.includes('경찰')) {
      routingTarget = '학교폭력 담당';
    }
    urgency = '즉시 확인 필요';
    recommendedAction = hasSwear ? '관리자 공유 필요' : '즉시 대응 필요';
    reasoningList.push('학생 간 갈등 및 신체적/정신적 상해(다침, 병원 등) 관련 키워드가 감지되었습니다. 진상 파악 및 생활지도부/학폭 담당 연계가 최우선으로 요구됩니다.');
    if (hasSwear) {
      reasoningList.push('또한 원문 내에 비속어 및 격앙된 어조가 포함되어 있어 교사 단독 대응을 금지하며, 관리자 사전 공유 및 보호 조치가 동반되어야 합니다.');
    }
  } else if (hasSwear) {
    category = '악성 민원 의심';
    routingTarget = '관리자/교감';
    urgency = '즉시 확인 필요';
    recommendedAction = '관리자 공유 필요';
    reasoningList.push('원문 내에 비속어, 원색적 욕설 및 극도의 공격성 표현이 다수 감지되었습니다. 교사 개인의 감정적 대응을 엄격히 금지하며, 즉시 관리자 및 교권보호위원회 연계가 요구됩니다.');
  } else if (hasAggressive && (textToAnalyze.includes('가만 안 둔다') || textToAnalyze.includes('고소') || textToAnalyze.includes('교육청') || textToAnalyze.includes('아동학대'))) {
    category = '악성 민원 의심';
    routingTarget = '관리자/교감';
    urgency = '즉시 확인 필요';
    recommendedAction = '관리자 공유 필요';
    riskTags.add('교권 침해 가능성');
    reasoningList.push('직접적인 법적 조치(신고, 고소) 및 상급 기관(교육청) 언급 등 감정 강도가 매우 높아 교사 단독 대응보다 관리자 동석 및 공유가 권장됩니다.');
  } else if (hasAggressive) {
    category = '감정적 항의';
    routingTarget = '담임교사';
    urgency = '높음';
    recommendedAction = '빠른 확인 필요';
    reasoningList.push('학부모의 감정적 항의와 강한 불만 표현이 포함되어 있어, 감정적 확산을 막기 위해 신속하고 차분한 초기 대응이 필요합니다.');
  } else if (hasGrade) {
    category = '성적/평가 문의';
    routingTarget = '교과교사';
    recommendedAction = '빠른 확인 필요';
    reasoningList.push('시험, 수행평가 등 성적 및 평가 기준에 대한 구체적 문의 사항으로, 해당 교과 담당 교사를 통한 정확한 사실 확인 및 피드백이 필요합니다.');
  } else if (hasAdmin) {
    category = '단순 행정 문의';
    routingTarget = '행정실';
    if (urgency === '보통') urgency = '낮음';
    recommendedAction = '업무 시간 내 확인';
    teacherReviewRequired = false;
    reasoningList.push('급식, 일정, 증명서 등 행정 실무에 해당하는 문의로 행정실 직통 라우팅을 통해 처리 가능하므로 교사의 직접 검토 필요성이 낮습니다.');
  } else if (textToAnalyze.includes('수업') || textToAnalyze.includes('숙제') || textToAnalyze.includes('과제')) {
    category = '수업/과제 문의';
    routingTarget = '교과교사';
    recommendedAction = '업무 시간 내 확인';
    reasoningList.push('교과 수업 내용 및 과제 제출 등에 관한 일반적 문의 사항입니다.');
  } else {
    category = '생활지도 문의';
    routingTarget = '담임교사';
    recommendedAction = '일반 확인';
    reasoningList.push('학생의 학급 내 생활, 친구 관계, 태도 등에 대한 문의로 담임교사의 세심한 관찰과 안내가 필요합니다.');
  }

  // 4. 사안(팩트) 중심의 동적 순화 요약 생성
  let coreIssue = '자녀의 학급 생활 및 지도 방식';
  if (hasSafety) coreIssue = '자녀의 신체적 상해 및 교우 관계 갈등 사안';
  else if (hasGrade) coreIssue = '평가 결과 및 수행평가 채점 기준 사안';
  else if (hasAdmin) coreIssue = `${input.title} 등 행정 실무 처리 사안`;

  let normalizedSummary = '';
  if (hasSwear) {
    normalizedSummary = `학부모가 극도로 격앙된 어조로 ${coreIssue}에 대한 강한 불만과 이의를 제기했으며, 관리자 및 유관 부서의 즉각적인 개입과 사실 조사를 요청했습니다.`;
  } else if (hasAggressive) {
    normalizedSummary = `학부모가 ${coreIssue}에 대해 강경한 어조로 불만을 표명했으며, 조속한 사실 확인 및 책임 있는 안내를 요청했습니다.`;
  } else if (hasSafety) {
    normalizedSummary = `학부모가 ${coreIssue}에 대해 우려를 표명하며, 학교 측의 면밀한 사실 조사 및 보호 조치를 요청했습니다.`;
  } else if (hasGrade) {
    normalizedSummary = `학부모가 ${coreIssue}에 대한 구체적인 설명과 상담 면담을 요청했습니다.`;
  } else if (hasAdmin) {
    normalizedSummary = `학부모가 ${coreIssue}에 대한 정확한 절차 안내 및 처리를 요청했습니다.`;
  } else {
    normalizedSummary = `학부모가 ${coreIssue}에 대한 문의 및 상담을 요청했습니다.`;
  }

  const reasoning = reasoningList.length > 0 ? reasoningList.join(' ') : '입력된 내용을 바탕으로 민원 성격을 분석하여 적절한 담당자와 긴급도를 배정했습니다.';

  return {
    id: 'complaint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    input,
    category,
    urgency,
    routingTarget,
    recommendedAction,
    teacherReviewRequired,
    adminReportRequired,
    normalizedSummary,
    reasoning,
    riskTags: Array.from(riskTags)
  };
}
