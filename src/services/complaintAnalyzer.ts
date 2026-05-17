import { AnalysisResult, ComplaintInput, ComplaintCategory, UrgencyLevel, RoutingTarget, RecommendedAction } from '../types/complaint';

export async function analyzeComplaint(input: ComplaintInput): Promise<AnalysisResult> {
  const apiKey = import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      id: 'complaint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      input,
      category: '기타',
      urgency: '즉시 확인 필요',
      routingTarget: '관리자/교감',
      recommendedAction: '관리자 공유 필요',
      teacherReviewRequired: true,
      adminReportRequired: true,
      normalizedSummary: '[AI 요약 불가] API 키가 설정되지 않아 AI 요약을 수행할 수 없습니다. 담당자의 직접 검토가 필요합니다.',
      reasoning: 'AI 분석이 동작하지 않아 안전을 위해 수동 검토가 요구됩니다.',
      riskTags: ['AI 분석 실패']
    };
  }

  try {
    const prompt = `
You are 'Guard:Alan' (Guardian Edu), a professional AI safety counselor and routing assistant for school teachers in South Korea.
Analyze the following parent's complaint detail and fill in the structured response.

Parent's Complaint Information:
- Title: "${input.title}"
- Grade & Class: "${input.gradeClass}"
- Channel: "${input.channel}"
- Received Time: "${input.timeType}" (업무시간 = Business Hours, 업무 외 시간 = Non-business Hours)
- Repeated: "${input.isRepeated}" (처음 = First-time, 반복 = Repeated/Recurring)
- Safety Related: "${input.safetyRelated}" (예 = Yes, 아니오 = No, 모르겠음 = Unsure)
- Raw Content: "${input.content}"

Instructions (CRITICAL):
1. "normalizedSummary": Extract the core factual issue and rewrite it into a highly polite, gentle, and formal summary (2-3 sentences max) in KOREAN. Completely eliminate any aggressive tone, swearing, emotional attacks, or explicit threats of legal action (suing, complaining to the education office, calling the police). Focus ONLY on the core constructive request or administrative issue. DO NOT hallucinate, invent, or force-inject non-existent claims or intense emotions (e.g., NEVER write "학부모가 극도로 격앙되어 불만과 이의를 제기했다" or "관리자의 즉각 개입을 요청했다" unless the parent literally explicitly demanded those in the raw text). Ground the summary strictly on the original facts (e.g., child was injured, simple evaluation criteria request) using gentle and objective words.
2. "category": Classify the complaint into one of the following exact strings:
   - '단순 행정 문의'
   - '수업/과제 문의'
   - '성적/평가 문의'
   - '생활지도 문의'
   - '학교폭력/안전 문의'
   - '감정적 항의'
   - '악성 민원 의심'
   - '기타'
3. "urgency": Classify the urgency into one of the following exact strings:
   - '낮음'
   - '보통'
   - '높음'
   - '즉시 확인 필요'
4. "routingTarget": Choose the best target department or person to handle this complaint:
   - '담임교사' (default for general classroom matters)
   - '교과교사' (for subject class, exams, specific assignments)
   - '행정실' (if the category is '단순 행정 문의')
   - '생활지도부' (for general misbehavior, minor peer conflict)
   - '상담교사' (for psychological issues, counseling request)
   - '관리자/교감' (if the category is '악성 민원 의심', or highly aggressive threat)
   - '학교폭력 담당' (if physical violence, bullying, or formal school violence investigation is mentioned)
   - '교육청 또는 외부 기관 검토 필요' (if extreme legal issue or severe emergency outside school bounds)
5. "recommendedAction": Select the most appropriate direct action code:
   - '일반 확인'
   - '업무 시간 내 확인'
   - '빠른 확인 필요'
   - '관리자 공유 필요'
   - '즉시 대응 필요'
   - '기록 보존 필요'
6. "teacherReviewRequired": set to false if the routingTarget is '행정실' (no teacher involvement needed), otherwise set to true.
7. "adminReportRequired": set to true if the complaint contains repeated issues ("반복"), swearing, clear legal threats, or category is '악성 민원 의심'. Otherwise set to false.
8. "reasoning": Provide a clear, professional reasoning for your analysis and routing decision. Write in KOREAN (1-2 sentences).
9. "riskTags": Detect all applicable risk markers from the text:
   - "업무 외 연락" (if timeType is '업무 외 시간')
   - "반복 민원" (if isRepeated is '반복')
   - "학생 안전 관련" (if safetyRelated is '예')
   - "위협성 표현" (if legal threat, suing, or high aggression detected)
   - "강한 항의" (if angry tone detected)
   - "교권 침해 가능성" (if severe swearing, continuous insult, or threat to destroy teacher's career is detected)
   - "관리자 공유 권장" (if highly intensive and requires help from school administrators)
   Return a JSON array of strings containing these tag names.

You MUST strictly output JSON conforming to the requested schema. Do not wrap the JSON in Markdown code block formatting.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                category: {
                  type: 'STRING',
                  enum: ['단순 행정 문의', '수업/과제 문의', '성적/평가 문의', '생활지도 문의', '학교폭력/안전 문의', '감정적 항의', '악성 민원 의심', '기타']
                },
                urgency: {
                  type: 'STRING',
                  enum: ['낮음', '보통', '높음', '즉시 확인 필요']
                },
                routingTarget: {
                  type: 'STRING',
                  enum: ['담임교사', '교과교사', '행정실', '생활지도부', '상담교사', '관리자/교감', '학교폭력 담당', '교육청 또는 외부 기관 검토 필요']
                },
                recommendedAction: {
                  type: 'STRING',
                  enum: ['일반 확인', '업무 시간 내 확인', '빠른 확인 필요', '관리자 공유 필요', '즉시 대응 필요', '기록 보존 필요']
                },
                teacherReviewRequired: { type: 'BOOLEAN' },
                adminReportRequired: { type: 'BOOLEAN' },
                normalizedSummary: { type: 'STRING' },
                reasoning: { type: 'STRING' },
                riskTags: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                }
              },
              required: ['category', 'urgency', 'routingTarget', 'recommendedAction', 'teacherReviewRequired', 'adminReportRequired', 'normalizedSummary', 'reasoning', 'riskTags']
            }
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('Empty response from Gemini API');
    }

    const aiResult = JSON.parse(resultText);

    return {
      id: 'complaint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      input,
      category: aiResult.category as ComplaintCategory,
      urgency: aiResult.urgency as UrgencyLevel,
      routingTarget: aiResult.routingTarget as RoutingTarget,
      recommendedAction: aiResult.recommendedAction as RecommendedAction,
      teacherReviewRequired: aiResult.teacherReviewRequired,
      adminReportRequired: aiResult.adminReportRequired,
      normalizedSummary: aiResult.normalizedSummary,
      reasoning: aiResult.reasoning,
      riskTags: aiResult.riskTags
    };
  } catch (error: any) {
    console.error('Failed to analyze complaint using Gemini API:', error);
    
    // AI API 호출 실패 시, 템플릿 조합이나 거짓 요약 대신 실패 사실을 정직하게 반환합니다.
    return {
      id: 'complaint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      input,
      category: '기타',
      urgency: '즉시 확인 필요',
      routingTarget: '관리자/교감',
      recommendedAction: '관리자 공유 필요',
      teacherReviewRequired: true,
      adminReportRequired: true,
      normalizedSummary: `[AI 요약 실패] AI API 요청 중 오류가 발생했습니다 (${error.message || '알 수 없는 오류'}). 템플릿 조합을 사용하지 않고 원문 그대로를 담당자가 직접 확인해야 합니다.`,
      reasoning: 'AI 분석이 실패하여 정확한 카테고리 분류가 불가능하므로, 안전을 위해 관리자가 직접 원문을 검토해야 합니다.',
      riskTags: ['AI 분석 실패', '직접 확인 요망']
    };
  }
}
