import { ComplaintInput } from '../types/complaint';

export interface SampleComplaint extends ComplaintInput {
  sampleId: number;
  summaryTitle: string; // 화면의 샘플 선택 버튼에 보여줄 짧은 제목
}

export const sampleComplaints: SampleComplaint[] = [
  {
    sampleId: 1,
    summaryTitle: '🔥 폭력 피해 및 학폭위 개최 요구 (긴급)',
    title: '아이가 반 친구에게 맞아서 안경이 깨졌습니다',
    gradeClass: '2학년 3반',
    channel: '전화',
    timeType: '업무시간',
    content: '우리 애가 오늘 같은 반 친구한테 맞아서 눈가에 멍이 들고 안경이 깨져서 돌아왔어요. 학교에서 도대체 학생 관리를 어떻게 하시는 건가요? 당장 가해 학생 부모 불러주시고 학교폭력 위원회 즉시 열어주세요. 병원 진단서 끊어놓겠습니다.',
    isRepeated: '처음',
    safetyRelated: '예'
  },
  {
    sampleId: 2,
    summaryTitle: '🚨 교사 비난 및 교육청 신고 위협 (악성 의심)',
    title: '학생 지도 방식에 문제가 많네요. 당장 전화하세요',
    gradeClass: '1학년 1반',
    channel: '메신저',
    timeType: '업무 외 시간',
    content: '선생님이 우리 애를 망쳐놨네요. 애 기죽이려고 학교 보냅니까? 왜 우리 아이만 혼내시는지 도무지 이해할 수 없습니다. 내일 당장 전화하시고 공식적으로 사과하지 않으면 교육청에 민원 넣고 아동학대로 고소하겠습니다.',
    isRepeated: '반복',
    safetyRelated: '아니오'
  },
  {
    sampleId: 3,
    summaryTitle: '📊 수행평가 점수 산출 기준 이의 제기 (교과)',
    title: '수학 수행평가 감점 기준 확인 요청드립니다',
    gradeClass: '3학년 2반',
    channel: '이메일',
    timeType: '업무시간',
    content: '어제 공지된 수학 수행평가 점수를 보았습니다. 우리 아이가 풀이 과정까지 모두 작성했는데 3점이 감점된 이유를 명확하게 알기 어렵습니다. 채점 기준표와 아이의 답안지를 확인하고 싶으니 면담 일정 잡아주세요.',
    isRepeated: '처음',
    safetyRelated: '아니오'
  },
  {
    sampleId: 4,
    summaryTitle: '🏢 스쿨뱅킹 및 급식비 계좌 변경 문의 (행정)',
    title: '급식비 자동이체 출금 계좌 변경 신청 문의',
    gradeClass: '1학년 4반',
    channel: '전화',
    timeType: '업무시간',
    content: '안녕하세요, 1학년 4반 학부모입니다. 3월 급식비 납부 관련해서 스쿨뱅킹 출금 계좌를 다른 은행으로 변경하려고 합니다. 행정실에 직접 서류를 제출해야 하는지, 아니면 온라인으로 신청서 양식이 있는지 안내 부탁드립니다.',
    isRepeated: '처음',
    safetyRelated: '아니오'
  },
  {
    sampleId: 5,
    summaryTitle: '🌙 심야 시간 친구 관계 갈등 상담 (업무 외)',
    title: '늦은 시간에 죄송합니다. 아이가 속상해하네요',
    gradeClass: '2학년 5반',
    channel: '메신저',
    timeType: '업무 외 시간',
    content: '선생님 늦은 밤에 연락드려 정말 죄송합니다. 오늘 민수가 반에서 단짝 친구랑 사소한 오해로 다투고 집에 와서 밥도 안 먹고 방에서 울고만 있네요. 크게 다친 건 아닌데 내일 학교에서 아이들 화해할 수 있게 신경 좀 써주시면 감사하겠습니다.',
    isRepeated: '처음',
    safetyRelated: '모르겠음'
  },
  {
    sampleId: 6,
    summaryTitle: '📚 과도한 영어 단어 숙제량 조절 요청 (반복)',
    title: '영어 과제량이 여전히 너무 많아서 아이가 지쳐있어요',
    gradeClass: '3학년 1반',
    channel: '문자',
    timeType: '업무시간',
    content: '지난 학부모 상담 때도 말씀드렸는데, 매일 외워가야 하는 영어 단어 시험 숙제량이 여전히 너무 많습니다. 아이가 학원 다녀와서 매일 새벽 1시까지 단어만 외우느라 수면 부족에 시달리고 있습니다. 교과 담당 선생님께 숙제량 조절을 다시 한번 건의드립니다.',
    isRepeated: '반복',
    safetyRelated: '아니오'
  },
  {
    sampleId: 7,
    summaryTitle: '📄 생활기록부 사본 및 재학증명서 당일 발급 문의',
    title: '재학증명서 당일 발급 가능 여부 문의',
    gradeClass: '1학년 2반',
    channel: '방문',
    timeType: '업무시간',
    content: '외부 장학금 신청 서류 준비 때문에 아이의 재학증명서와 학교 생활기록부 사본이 급하게 필요합니다. 오늘 오후 3시쯤 학교 행정실을 방문하면 당일 바로 발급받을 수 있는지 확인 부탁드립니다.',
    isRepeated: '처음',
    safetyRelated: '아니오'
  },
  {
    sampleId: 8,
    summaryTitle: '⚽ 체육 줄넘기 수행평가 준비물 규격 문의',
    title: '체육 시간 줄넘기 준비물 규격 관련 질문',
    gradeClass: '2학년 1반',
    channel: '문자',
    timeType: '업무시간',
    content: '이번 주 목요일 체육 시간에 진행하는 줄넘기 수행평가 관련해서 안내문 보았습니다. 학교에서 지정한 브랜드나 규격이 따로 있는 것인지, 아니면 집에 있는 일반 와이어 줄넘기를 가져가도 감점이 없는지 궁금합니다.',
    isRepeated: '처음',
    safetyRelated: '아니오'
  }
];
