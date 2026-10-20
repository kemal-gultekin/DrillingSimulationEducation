import React, { useState, useEffect } from 'react';
import { SAFETY_QUESTIONS } from '../data/safety';
import { quizRepository, QuizQuestionItem } from '../repositories';
import { useI18n } from '../i18n';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Eye, 
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
  const { t, resolveText, resolveArray } = useI18n();
  const [questions, setQuestions] = useState<QuizQuestionItem[]>(() => 
    SAFETY_QUESTIONS.map((q) => ({
      id: q.id,
      category: q.category,
      title: q.title,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      equipmentFocusId: q.equipmentFocusId,
      difficulty: q.difficulty,
      regulationRef: q.regulationRef,
      status: 'published',
      points: 10
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    quizRepository.getAll().then((items) => {
      if (items && items.length > 0) {
        setQuestions(items);
      }
    });
  }, []);

  const categories = [
    { key: 'all', labelKey: 'safety.allCategories' },
    { key: 'ppe', labelKey: 'safety.catPpe' },
    { key: 'h2s', labelKey: 'safety.catH2s' },
    { key: 'heights', labelKey: 'safety.catHeights' },
    { key: 'loto', labelKey: 'safety.catLoto' },
    { key: 'rigfloor', labelKey: 'safety.catRigfloor' },
    { key: 'fire', labelKey: 'safety.catFire' },
    { key: 'confined', labelKey: 'safety.catConfined' },
    { key: 'environmental', labelKey: 'safety.catEnvironmental' }
  ];

  const filteredQuestions = questions.filter((q) => {
    return selectedCategory === 'all' || q.category === selectedCategory;
  });

  const activeQuestion: QuizQuestionItem | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];
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
        {t('common.empty')}
      </div>
    );
  }

  const questionTitle = resolveText(activeQuestion.title);
  const questionText = resolveText(activeQuestion.question);
  const options = resolveArray(activeQuestion.options);
  const explanation = resolveText(activeQuestion.explanation);

  return (
    <div
      id="safety-quiz-panel"
      className="absolute top-16 left-4 z-20 w-[420px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{t('safety.title')}</h2>
            <p className="text-[11px] text-slate-400">{t('safety.subtitle')}</p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">{correctCount * 10} {t('safety.score')}</span>
          <span className="text-slate-400 text-[10px]">({correctCount}/{totalAnswered})</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 pt-2.5 pb-1 border-b border-slate-800 flex gap-1 overflow-x-auto scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.key}
            id={`quiz-cat-${c.key}`}
            onClick={() => {
              setSelectedCategory(c.key);
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === c.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Question Counter & Difficulty Badge */}
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span className="font-semibold text-slate-300">
            {t('safety.questionOf', { current: currentIndex + 1, total: filteredQuestions.length })}
          </span>
          <div className="flex items-center gap-2">
            {activeQuestion.regulationRef && (
              <span className="flex items-center gap-1 text-[10px] text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
                <BookOpen className="w-3 h-3" />
                {activeQuestion.regulationRef}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                activeQuestion.difficulty === 'Temel' || activeQuestion.difficulty === 'Basic'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : activeQuestion.difficulty === 'Orta' || activeQuestion.difficulty === 'Intermediate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {activeQuestion.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Question Prompt */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-sm text-white leading-snug">{questionTitle}</h3>
          <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {questionText}
          </p>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-2">
          {options.map((option, idx) => {
            const hasAnswered = currentAnswerRecord !== undefined;
            const isCorrectOption = idx === activeQuestion.correctIndex;
            const isSelectedOption = hasAnswered && currentAnswerRecord.answeredIndex === idx;

            let optionStyle = 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 cursor-pointer';

            if (hasAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 font-semibold';
              } else if (isSelectedOption && !currentAnswerRecord.isCorrect) {
                optionStyle = 'bg-rose-950/40 border-rose-500/80 text-rose-200';
              } else {
                optionStyle = 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${optionStyle}`}
              >
                <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="leading-relaxed flex-1">{option}</span>
                {hasAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {hasAnswered && isSelectedOption && !currentAnswerRecord.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Educational Feedback & Explanation */}
        {currentAnswerRecord !== undefined && (
          <div
            id="quiz-feedback-box"
            className={`p-3.5 rounded-xl border space-y-2 ${
              currentAnswerRecord.isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              {currentAnswerRecord.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t('safety.correctAnswer')}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>{t('safety.wrongAnswer')}</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              <span className="font-semibold block text-slate-200 mb-0.5">{t('safety.explanation')}</span>
              {explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex gap-2 pt-1">
          {activeQuestion.equipmentFocusId && (
            <button
              id="quiz-focus-equipment-btn"
              onClick={() => onFocusEquipment(activeQuestion.equipmentFocusId!)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors cursor-pointer text-xs"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{t('safety.inspectEquipment')}</span>
            </button>
          )}

          <button
            id="quiz-next-question-btn"
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer text-xs"
          >
            <span>{t('safety.nextQuestion')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
