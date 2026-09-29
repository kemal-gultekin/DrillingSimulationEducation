import React, { useState } from 'react';
import { SAFETY_QUESTIONS } from '../data/safety';
import { SafetyQuestion } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface QuizPanelProps {
  onFocusEquipment: (equipmentId: string) => void;
  onRecordScore: (questionId: string, isCorrect: boolean) => void;
  userAnswers: Record<string, { answeredIndex: number; isCorrect: boolean }>;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({
  onFocusEquipment,
  onRecordScore,
  userAnswers
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'Tüm Konular' },
    { key: 'ppe', label: 'KKD' },
    { key: 'h2s', label: 'H2S Gazı' },
    { key: 'heights', label: 'Yüksekte Çalışma' },
    { key: 'loto', label: 'LOTO' },
    { key: 'rigfloor', label: 'Kule Tabanı (Red Zone)' },
    { key: 'fire', label: 'Yangın Güvenliği' },
    { key: 'confined', label: 'Kapalı Alan' },
    { key: 'environmental', label: 'Çevre & Atık' }
  ];

  const filteredQuestions = SAFETY_QUESTIONS.filter((q) => {
    return selectedCategory === 'all' || q.category === selectedCategory;
  });

  const activeQuestion: SafetyQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];
  const currentAnswerRecord = activeQuestion ? userAnswers[activeQuestion.id] : undefined;

  const totalAnswered = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;

  const handleSelectOption = (optionIndex: number) => {
    if (!activeQuestion || currentAnswerRecord !== undefined) return;
    const isCorrect = optionIndex === activeQuestion.correctIndex;
    onRecordScore(activeQuestion.id, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!activeQuestion) {
    return (
      <div className="absolute top-16 left-4 z-20 w-96 bg-slate-900/95 border border-slate-800 p-4 rounded-xl text-slate-200">
        Bu kategoride soru bulunamadı.
      </div>
    );
  }

  return (
    <div
      id="safety-quiz-panel"
      className="absolute top-16 left-4 z-20 w-[420px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">İSG & Saha Emniyeti Eğitimi</h2>
            <p className="text-[11px] text-slate-400">Petrol & Doğalgaz Sondaj Standartları</p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">{correctCount * 10} Puan</span>
          <span className="text-slate-400 text-[10px]">({correctCount}/{totalAnswered})</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 pt-2.5 pb-1 border-b border-slate-800 flex gap-1 overflow-x-auto scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.key}
            id={`quiz-cat-${cat.key}`}
            onClick={() => {
              setSelectedCategory(cat.key);
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 text-[10px] rounded-full whitespace-nowrap transition-colors border ${
              selectedCategory === cat.key
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Question Content */}
      <div className="p-4 space-y-4">
        {/* Question Counter and Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-amber-400">
              Soru {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {activeQuestion.difficulty}
            </span>
          </div>

          {activeQuestion.regulationRef && (
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-500" />
              {activeQuestion.regulationRef}
            </span>
          )}
        </div>

        {/* Question Title & Text */}
        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800">
          <h3 className="font-bold text-sm text-amber-200 mb-1.5">{activeQuestion.title}</h3>
          <p className="text-xs text-slate-200 leading-relaxed">{activeQuestion.question}</p>
        </div>

        {/* Focus on Related Equipment Button */}
        {activeQuestion.equipmentFocusId && (
          <button
            id="quiz-focus-equipment-btn"
            onClick={() => onFocusEquipment(activeQuestion.equipmentFocusId!)}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            İlgili Sahayı / Ekipmanı 3D'de İncele
          </button>
        )}

        {/* Options */}
        <div className="space-y-2">
          {activeQuestion.options.map((option, idx) => {
            const isSelected = currentAnswerRecord?.answeredIndex === idx;
            const isCorrectOption = activeQuestion.correctIndex === idx;
            const isAnswered = currentAnswerRecord !== undefined;

            let buttonStyle = 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300';
            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 font-medium';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle = 'bg-rose-950/40 border-rose-500/80 text-rose-200';
              } else {
                buttonStyle = 'opacity-50 bg-slate-950/40 border-slate-800/40 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${buttonStyle} ${
                  !isAnswered ? 'cursor-pointer hover:border-slate-700' : 'cursor-default'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isAnswered ? (
                    isCorrectOption ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {String.fromCharCode(65 + idx)}
                      </div>
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                      {String.fromCharCode(65 + idx)}
                    </div>
                  )}
                </div>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation upon Answering */}
        {currentAnswerRecord !== undefined && (
          <div
            id="quiz-explanation-box"
            className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 ${
              currentAnswerRecord.isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {currentAnswerRecord.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Tebrikler, Doğru Yanıt!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">Yanlış Yanıt</span>
                </>
              )}
            </div>
            <div className="text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-semibold text-amber-300 block mb-1">Mühendislik & İSG Gerekçesi:</span>
              <p className="text-slate-300 leading-normal">{activeQuestion.explanation}</p>
            </div>
          </div>
        )}

        {/* Next Question Navigation */}
        <div className="flex justify-between items-center pt-2">
          <button
            id="quiz-prev-btn"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300"
          >
            Önceki
          </button>

          <button
            id="quiz-next-btn"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            <span>{currentIndex === filteredQuestions.length - 1 ? 'Başa Dön' : 'Sonraki Soru'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Guidance Disclaimer */}
        <p className="text-[10px] text-slate-500 italic text-center pt-1 border-t border-slate-800/80">
          Not: İSG içeriği akademik eğitim amaçlıdır; sahaya özel HSE ve şirket prosedürlerinin yerine geçmez.
        </p>
      </div>
    </div>
  );
};
