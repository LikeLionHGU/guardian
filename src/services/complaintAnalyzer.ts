import { AnalysisResult, ComplaintInput, ComplaintCategory, UrgencyLevel, RoutingTarget, RecommendedAction } from '../types/complaint';

export async function analyzeComplaint(input: ComplaintInput): Promise<AnalysisResult> {
  const apiKey = import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;

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
    const systemMessage = `You are Guard:Alan (Guardian Edu), a professional AI safety counselor and routing assistant for school teachers in South Korea. Respond only with valid JSON matching the requested schema and do not add any additional explanation.`;
    const userMessage = `Analyze the following parent's complaint detail and return the structured result as JSON only.\n\nParent's Complaint Information:\n- Title: "${input.title}"\n- Grade & Class: "${input.gradeClass}"\n- Channel: "${input.channel}"\n- Received Time: "${input.timeType}" (업무시간 = Business Hours, 업무 외 시간 = Non-business Hours)\n- Repeated: "${input.isRepeated}" (처음 = First-time, 반복 = Repeated/Recurring)\n- Safety Related: "${input.safetyRelated}" (예 = Yes, 아니오 = No, 모르겠음 = Unsure)\n- Raw Content: "${input.content}"\n\nInstructions (CRITICAL):\n1. \"normalizedSummary\": Extract the core factual issue and rewrite it into a highly polite, gentle, and formal summary (2-3 sentences max) in KOREAN. Completely eliminate any aggressive tone, swearing, emotional attacks, or explicit threats of legal action (suing, complaining to the education office, calling the police). Focus ONLY on the core constructive request or administrative issue. DO NOT hallucinate, invent, or force-inject non-existent claims or intense emotions (e.g., NEVER write \"학부모가 극도로 격앙되어 불만과 이의를 제기했다\" or \"관리자의 즉각 개입을 요청했다\" unless the parent literally explicitly demanded those in the raw text). Ground the summary strictly on the original facts (e.g., child was injured, simple evaluation criteria request) using gentle and objective words.\n2. \"category\": Classify the complaint into one of the following exact strings:\n   - '단순 행정 문의'\n   - '수업/과제 문의'\n   - '성적/평가 문의'\n   - '생활지도 문의'\n   - '학교폭력/안전 문의'\n   - '감정적 항의'\n   - '악성 민원 의심'\n   - '기타'\n3. \"urgency\": Classify the urgency into one of the following exact strings:\n   - '낮음'\n   - '보통'\n   - '높음'\n   - '즉시 확인 필요'\n4. \"routingTarget\": Choose the best target department or person to handle this complaint:\n   - '담임교사' (default for general classroom matters)\n   - '교과교사' (for subject class, exams, specific assignments)\n   - '행정실' (if the category is '단순 행정 문의')\n   - '생활지도부' (for general misbehavior, minor peer conflict)\n   - '상담교사' (for psychological issues, counseling request)\n   - '관리자/교감' (if the category is '악성 민원 의심', or highly aggressive threat)\n   - '학교폭력 담당' (if physical violence, bullying, or formal school violence investigation is mentioned)\n   - '교육청 또는 외부 기관 검토 필요' (if extreme legal issue or severe emergency outside school bounds)\n5. \"recommendedAction\": Select the most appropriate direct action code:\n   - '일반 확인'\n   - '업무 시간 내 확인'\n   - '빠른 확인 필요'\n   - '관리자 공유 필요'\n   - '즉시 대응 필요'\n   - '기록 보존 필요'\n6. \"teacherReviewRequired\": set to false if the routingTarget is '행정실' (no teacher involvement needed), otherwise set to true.\n7. \"adminReportRequired\": set to true if the complaint contains repeated issues (\"반복\"), swearing, clear legal threats, or category is '악성 민원 의심'. Otherwise set to false.\n8. \"reasoning\": Provide a clear, professional reasoning for your analysis and routing decision. Write in KOREAN (1-2 sentences).\n9. \"riskTags\": Detect all applicable risk markers from the text:\n   - \"업무 외 연락\" (if timeType is '업무 외 시간')\n   - \"반복 민원\" (if isRepeated is '반복')\n   - \"학생 안전 관련\" (if safetyRelated is '예')\n   - \"위협성 표현\" (if legal threat, suing, or high aggression detected)\n   - \"강한 항의\" (if angry tone detected)\n   - \"교권 침해 가능성\" (if severe swearing, continuous insult, or threat to destroy teacher's career is detected)\n   - \"관리자 공유 권장\" (if highly intensive and requires help from school administrators)\nReturn a JSON array of strings containing these tag names.`;

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0,
      max_tokens: 1024
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const rawResponseText = await response.text();
    if (!response.ok) {
      console.error('OpenAI API request failed:', response.status, rawResponseText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${rawResponseText}`);
    }

    const data = JSON.parse(rawResponseText);
    const resultText = data.choices?.[0]?.message?.content;
    if (!resultText) {
      throw new Error('Empty response from OpenAI API');
    }

    const cleanedText = resultText.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();
    const aiResult = JSON.parse(cleanedText);

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
    console.error('Failed to analyze complaint using OpenAI API:', error);

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
