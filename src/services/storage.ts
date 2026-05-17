import { AnalysisResult, ComplaintInput } from '../types/complaint';
import { analyzeComplaint } from './complaintAnalyzer';
import { sampleComplaints } from '../data/sampleComplaints';

const STORAGE_KEY = 'guardian_complaint_history';

export const storage = {
  getHistory: (): AnalysisResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load history from storage', e);
      return [];
    }
  },

  saveHistory: (history: AnalysisResult[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to storage', e);
    }
  },

  addResult: (result: AnalysisResult): void => {
    const history = storage.getHistory();
    // 중복 ID 방지 및 최신 데이터 상단 배치
    const filtered = history.filter(h => h.id !== result.id);
    storage.saveHistory([result, ...filtered]);
  },

  clearHistory: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  },

  // 초기 데모 데이터를 로컬스토리지에 주입하는 함수 (비어있을 때만)
  initDemoData: async (): Promise<void> => {
    const history = storage.getHistory();
    if (history.length === 0) {
      console.log('Initializing demo history data...');
      // 샘플 중 4개를 분석하여 초기 기록으로 추가
      const demoSamples = [sampleComplaints[0], sampleComplaints[1], sampleComplaints[3], sampleComplaints[4]];
      const results: AnalysisResult[] = [];
      for (const sample of demoSamples) {
        // sampleId와 summaryTitle은 제외하고 ComplaintInput에 맞춤
        const { sampleId, summaryTitle, ...inputData } = sample;
        const res = await analyzeComplaint(inputData);
        // 타임스탬프를 조금씩 다르게 설정 (몇 시간 전 등)
        const date = new Date();
        date.setHours(date.getHours() - results.length * 2);
        res.timestamp = date.toISOString();
        results.push(res);
      }
      storage.saveHistory(results);
    }
  }
};
