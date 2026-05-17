import React, { useState } from 'react';
import { ComplaintInput, ChannelType, TimeType, RepeatedType, SafetyRelatedType } from '../types/complaint';
import { sampleComplaints, SampleComplaint } from '../data/sampleComplaints';
import { Sparkles, Play, BookOpen, AlertCircle, Clock, MessageSquare, AlertTriangle, UserCheck } from 'lucide-react';

interface InputPageProps {
  onAnalyze: (input: ComplaintInput) => Promise<void>;
}

export const InputPage: React.FC<InputPageProps> = ({ onAnalyze }) => {
  const [formData, setFormData] = useState<ComplaintInput>({
    title: '',
    gradeClass: '1학년 1반',
    channel: '전화',
    timeType: '업무시간',
    content: '',
    isRepeated: '처음',
    safetyRelated: '아니오'
  });

  const [loading, setLoading] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedSampleId(null);
  };

  const handleSelectSample = (sample: SampleComplaint) => {
    setSelectedSampleId(sample.sampleId);
    setFormData({
      title: sample.title,
      gradeClass: sample.gradeClass,
      channel: sample.channel,
      timeType: sample.timeType,
      content: sample.content,
      isRepeated: sample.isRepeated,
      safetyRelated: sample.safetyRelated
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('민원 제목과 내용을 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await onAnalyze(formData);
    } catch (err) {
      console.error(err);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl">
      {/* Title & Sample Selection */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">민원 데이터 입력 및 AI 분석 요청</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">실제 접수된 민원 내용을 입력하거나, 준비된 8가지 대표 상황 샘플을 선택해 테스트해보세요.</p>
          </div>
        </div>

        {/* 8 Sample Quick Selection Grid */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>원클릭 데모 샘플 데이터 선택 (8종)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sampleComplaints.map((sample) => (
              <button
                key={sample.sampleId}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-3.5 text-left rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                  selectedSampleId === sample.sampleId
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102 font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
                }`}
              >
                <span className="truncate pr-2">{sample.summaryTitle}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${selectedSampleId === sample.sampleId ? 'bg-white animate-ping' : 'bg-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center space-x-2">
            <span>민원 상세 정보 폼</span>
            {selectedSampleId && (
              <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 font-bold rounded-md">
                샘플 #{selectedSampleId} 로드됨
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-slate-700">민원 제목 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 자녀의 친구 관계 갈등 및 지도 요청 건"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-medium"
                required
              />
            </div>

            {/* Grade/Class */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center space-x-1">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span>해당 학년 및 반</span>
              </label>
              <input
                type="text"
                name="gradeClass"
                value={formData.gradeClass}
                onChange={handleChange}
                placeholder="예: 2학년 3반"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Channel */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>민원 접수 채널</span>
              </label>
              <select
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-medium cursor-pointer"
              >
                <option value="전화">📞 전화</option>
                <option value="문자">💬 문자</option>
                <option value="메신저">💬 메신저 (카톡/하이톡 등)</option>
                <option value="이메일">✉️ 이메일</option>
                <option value="방문">🏢 방문 면담</option>
              </select>
            </div>

            {/* Time Type */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center space-x-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>민원 접수 시간대</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['업무시간', '업무 외 시간'] as TimeType[]).map(type => (
                  <label
                    key={type}
                    className={`flex items-center justify-center py-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${
                      formData.timeType === type
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeType"
                      value={type}
                      checked={formData.timeType === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>{type === '업무시간' ? '☀️ 정규 업무 시간' : '🌙 업무 외 시간 (야간/휴일)'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Repeated */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span>반복 민원 여부</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['처음', '반복'] as RepeatedType[]).map(type => (
                  <label
                    key={type}
                    className={`flex items-center justify-center py-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${
                      formData.isRepeated === type
                        ? type === '반복'
                          ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs font-black'
                          : 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="isRepeated"
                      value={type}
                      checked={formData.isRepeated === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>{type === '처음' ? '🌱 최초 접수' : '⚠️ 동일 사안 반복'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Safety Related */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <span>학생 안전 관련 여부 (폭력, 신체적/정신적 상해 등)</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['예', '아니오', '모르겠음'] as SafetyRelatedType[]).map(type => (
                  <label
                    key={type}
                    className={`flex items-center justify-center py-3 rounded-xl border text-sm font-bold cursor-pointer transition-all ${
                      formData.safetyRelated === type
                        ? type === '예'
                          ? 'bg-red-50 border-red-600 text-red-700 shadow-xs font-black'
                          : 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="safetyRelated"
                      value={type}
                      checked={formData.safetyRelated === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>{type === '예' ? '🚨 안전 관련 (예)' : type === '아니오' ? '✓ 관련 없음' : '❓ 확인 필요'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                학부모 민원 원문 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                placeholder="학부모가 전송한 메시지, 이메일, 전화 통화 메모 등을 가감 없이 입력해주세요. AI가 맥락과 어조를 파악하여 분석합니다."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:outline-none transition-all text-sm font-medium leading-relaxed resize-y"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AI 신경망 분석 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>AI 민원 정밀 분석 실행</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
