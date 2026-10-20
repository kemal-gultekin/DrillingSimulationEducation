import React, { useState, useEffect } from 'react';
import { MOCK_STUDENTS, StudentRecord } from '../data/instructor';
import { 
  assignmentRepository, 
  quizRepository, 
  submissionRepository,
  authRepository,
  AssignmentItem, 
  QuizQuestionItem,
  SubmissionItem,
  UserAccount,
  Classroom
} from '../repositories';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  PlusCircle, 
  AlertTriangle, 
  Calendar,
  X,
  Languages,
  HelpCircle,
  Trash2,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  MessageSquare,
  TrendingUp,
  Award,
  Copy,
  Check,
  UserPlus,
  KeyRound,
  Sparkles,
  School
} from 'lucide-react';

export type InstructorSection = 'dashboard' | 'quizzes' | 'assignments' | 'grading' | 'students';

interface InstructorPanelProps {
  activeSection?: InstructorSection;
  onChangeSection?: (section: InstructorSection) => void;
}

export const InstructorPanel: React.FC<InstructorPanelProps> = ({
  activeSection = 'dashboard',
  onChangeSection
}) => {
  const { t, resolveText, resolveArray, lang } = useI18n();

  const [currentTab, setCurrentTab] = useState<InstructorSection>(activeSection);

  useEffect(() => {
    setCurrentTab(activeSection);
  }, [activeSection]);

  const setTab = (tab: InstructorSection) => {
    setCurrentTab(tab);
    if (onChangeSection) {
      onChangeSection(tab);
    }
  };

  const { currentUser } = useAuth();

  const [students] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestionItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // Classroom and Enrolled Students state
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [enrolledAccounts, setEnrolledAccounts] = useState<UserAccount[]>([]);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [newStudentNameInput, setNewStudentNameInput] = useState<string>('');
  const [createdStudentResult, setCreatedStudentResult] = useState<{ student: UserAccount; tempPassword: string } | null>(null);
  const [credsCopied, setCredsCopied] = useState<boolean>(false);

  // Modals
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [showNewQuizModal, setShowNewQuizModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<SubmissionItem | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState<number>(90);
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState<string>('');

  // Form states for Bilingual Assignment creation
  const [asgTab, setAsgTab] = useState<'tr' | 'en'>('tr');
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-11-01');
  const [newTargetScore, setNewTargetScore] = useState(80);

  // Form states for Bilingual Quiz creation
  const [quizTab, setQuizTab] = useState<'tr' | 'en'>('tr');
  const [qTitleTr, setQTitleTr] = useState('');
  const [qTitleEn, setQTitleEn] = useState('');
  const [qQuestionTr, setQQuestionTr] = useState('');
  const [qQuestionEn, setQQuestionEn] = useState('');
  const [qOptionsTr, setQOptionsTr] = useState<string[]>(['', '', '', '']);
  const [qOptionsEn, setQOptionsEn] = useState<string[]>(['', '', '', '']);
  const [qExplanationTr, setQExplanationTr] = useState('');
  const [qExplanationEn, setQExplanationEn] = useState('');
  const [qCategory, setQCategory] = useState<string>('ppe');
  const [qCorrectIndex, setQCorrectIndex] = useState<number>(0);
  const [qDifficulty, setQDifficulty] = useState<'Temel' | 'Orta' | 'İleri'>('Temel');
  const [qPoints, setQPoints] = useState<number>(10);

  // Helper to load classroom & enrolled students
  const loadClassroomData = async () => {
    try {
      const clsList = await authRepository.getClassroomsByInstructor(currentUser.id);
      let activeCls = clsList[0];
      if (!activeCls) {
        // Fallback default classroom
        activeCls = (await authRepository.getClassroomByCode('PET101')) || {
          id: 'cls-1',
          name: 'PET-301 Sondaj Mühendisliği I',
          code: 'PET101',
          instructorId: currentUser.id,
          createdAt: new Date().toISOString()
        };
      }
      setClassroom(activeCls);

      const accounts = await authRepository.getStudentsByClassCode(activeCls.code);
      setEnrolledAccounts(accounts);
    } catch (e) {
      console.error('Error loading classroom data:', e);
    }
  };

  // Load assignments, quizzes, and submissions from repositories on mount
  useEffect(() => {
    Promise.all([
      assignmentRepository.getAll(),
      quizRepository.getAll(),
      submissionRepository.getAll()
    ]).then(([asgData, quizData, subData]) => {
      setAssignments(asgData);
      setQuizzes(quizData);
      setSubmissions(subData);
    });

    loadClassroomData();
  }, [currentUser.id]);

  const averageScore = Math.round(
    students.reduce((acc, s) => acc + s.overallScore, 0) / (students.length || 1)
  );

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitleTr = titleTr.trim();
    const finalTitleEn = titleEn.trim();

    if (!finalTitleTr && !finalTitleEn) {
      alert('Lütfen en az bir dilde ödev başlığı giriniz / Please provide a title in at least one language.');
      return;
    }

    const created = await assignmentRepository.create({
      title: {
        tr: finalTitleTr || finalTitleEn,
        en: finalTitleEn || finalTitleTr
      },
      dueDate: newDueDate,
      description: {
        tr: descTr.trim() || descEn.trim() || 'PetroSim Sondaj Simülasyonu ödevi.',
        en: descEn.trim() || descTr.trim() || 'PetroSim Drilling Simulation assignment.'
      },
      requiredScenarios: ['scenario-kick', 'hydrostatic-pressure'],
      targetScore: newTargetScore,
      maxScore: 100,
      enrolledStudentsCount: students.length,
      submissionRate: 0
    });

    setAssignments((prev) => [created, ...prev]);
    setShowNewAssignmentModal(false);
    setTitleTr('');
    setTitleEn('');
    setDescTr('');
    setDescEn('');
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitleTr = qTitleTr.trim();
    const finalTitleEn = qTitleEn.trim();
    const finalQuestionTr = qQuestionTr.trim();
    const finalQuestionEn = qQuestionEn.trim();

    if (!finalQuestionTr && !finalQuestionEn) {
      alert('Lütfen en az bir dilde soru metni giriniz / Please provide a question text in at least one language.');
      return;
    }

    const mergedOptionsTr: string[] = [];
    const mergedOptionsEn: string[] = [];

    for (let i = 0; i < 4; i++) {
      const optTr = (qOptionsTr[i] || '').trim();
      const optEn = (qOptionsEn[i] || '').trim();
      const fallbackVal = optTr || optEn || `Seçenek ${i + 1}`;
      mergedOptionsTr.push(optTr || fallbackVal);
      mergedOptionsEn.push(optEn || fallbackVal);
    }

    const created = await quizRepository.create({
      category: qCategory,
      title: {
        tr: finalTitleTr || finalTitleEn || 'Saha ISG Sorusu',
        en: finalTitleEn || finalTitleTr || 'Rig HSE Question'
      },
      question: {
        tr: finalQuestionTr || finalQuestionEn,
        en: finalQuestionEn || finalQuestionTr
      },
      options: {
        tr: mergedOptionsTr,
        en: mergedOptionsEn
      },
      correctIndex: qCorrectIndex,
      explanation: {
        tr: qExplanationTr.trim() || qExplanationEn.trim() || 'Doğru prosedür ve ISG kuralı.',
        en: qExplanationEn.trim() || qExplanationTr.trim() || 'Standard drilling safety procedure.'
      },
      difficulty: qDifficulty,
      status: 'published',
      points: qPoints
    });

    setQuizzes((prev) => [created, ...prev]);
    setShowNewQuizModal(false);

    setQTitleTr('');
    setQTitleEn('');
    setQQuestionTr('');
    setQQuestionEn('');
    setQOptionsTr(['', '', '', '']);
    setQOptionsEn(['', '', '', '']);
    setQExplanationTr('');
    setQExplanationEn('');
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm(t('instructor.deleteQuizConfirm'))) {
      const success = await quizRepository.delete(id);
      if (success) {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
      }
    }
  };

  const openGradingModal = (sub: SubmissionItem) => {
    setGradingSubmission(sub);
    setGradeScoreInput(sub.score);
    setGradeFeedbackInput(sub.teacherFeedback || '');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = await submissionRepository.grade(
      gradingSubmission.id,
      gradeScoreInput,
      gradeFeedbackInput.trim()
    );

    setSubmissions((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    setGradingSubmission(null);
  };

  const handleCopyClassCode = () => {
    const code = classroom?.code || 'PET101';
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentNameInput.trim()) return;
    const code = classroom?.code || 'PET101';
    try {
      const result = await authRepository.addStudentByInstructor(currentUser.id, code, newStudentNameInput.trim());
      setCreatedStudentResult(result);
      setNewStudentNameInput('');
      await loadClassroomData();
    } catch (err: any) {
      alert(err?.message || 'Öğrenci eklenirken bir hata oluştu');
    }
  };

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`${t('auth.removeStudentConfirm')}\n(${studentName})`)) {
      await authRepository.removeStudent(studentId);
      await loadClassroomData();
    }
  };

  const handleCopyCredentials = () => {
    if (!createdStudentResult) return;
    const text = `PetroSim Giriş Bilgileri:\nAd Soyad: ${createdStudentResult.student.fullName}\nKullanıcı Adı: ${createdStudentResult.student.username}\nGeçici Şifre: ${createdStudentResult.tempPassword}\nSınıf Kodu: ${classroom?.code || 'PET101'}`;
    navigator.clipboard.writeText(text);
    setCredsCopied(true);
    setTimeout(() => setCredsCopied(false), 2000);
  };

  return (
    <div
      id="instructor-panel"
      className="absolute top-16 left-4 z-20 w-[540px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">{t('instructor.title')}</h2>
              <p className="text-[11px] text-slate-400">{t('instructor.subtitle')}</p>
            </div>
          </div>

          {currentTab === 'assignments' && (
            <button
              id="open-new-assignment-btn"
              onClick={() => setShowNewAssignmentModal(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('instructor.newAssignmentBtn')}</span>
            </button>
          )}

          {currentTab === 'quizzes' && (
            <button
              id="open-new-quiz-btn"
              onClick={() => setShowNewQuizModal(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('instructor.newQuizBtn')}</span>
            </button>
          )}
        </div>

        {/* 5-Tab Navigation (Panel, Quiz Yönetimi, Ödev Yönetimi, Teslimler & Notlandırma, Öğrenci Listesi) */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] overflow-x-auto">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'tr' ? 'Panel' : 'Dashboard'}
          </button>

          <button
            onClick={() => setTab('quizzes')}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'quizzes'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'tr' ? 'Quizler' : 'Quizzes'} ({quizzes.length})
          </button>

          <button
            onClick={() => setTab('assignments')}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'assignments'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'tr' ? 'Ödevler' : 'Assignments'} ({assignments.length})
          </button>

          <button
            onClick={() => setTab('grading')}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'grading'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'tr' ? 'Notlandırma' : 'Grading'} ({submissions.length})
          </button>

          <button
            onClick={() => setTab('students')}
            className={`flex-1 py-1.5 px-2 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              currentTab === 'students'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'tr' ? 'Öğrenciler' : 'Students'} ({students.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* VIEW 1: DASHBOARD (Panel - Sınıf İlerlemesi) */}
        {currentTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">{t('instructor.enrolledStudents')}</span>
                <span className="text-lg font-bold text-sky-400">{students.length}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">{t('instructor.classAverage')}</span>
                <span className="text-lg font-bold text-amber-400">{averageScore}</span>
                <span className="text-[9px] text-slate-500 block font-sans">/ 100</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">{t('instructor.activeAssignments')}</span>
                <span className="text-lg font-bold text-emerald-400">{assignments.length}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">{lang === 'tr' ? 'Teslimler' : 'Submissions'}</span>
                <span className="text-lg font-bold text-purple-400">{submissions.length}</span>
              </div>
            </div>

            {/* Cohort Weak Topics Alert */}
            <div className="p-3.5 bg-amber-950/25 border border-amber-500/40 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{t('instructor.cohortWeakTopics')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="font-semibold text-slate-200">Choke Manifold Basınç Ayarı</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">48% Hata Payı • Müdahale Önerilir</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="font-semibold text-slate-200">MAASP Limit Tavan Hesabı</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">36% Hata Payı • Tekrar Tavsiyesi</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTab('quizzes')}
                className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'tr' ? 'Quiz Soru Bankası' : 'Quiz Question Bank'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {quizzes.length} {lang === 'tr' ? 'soru kayıtlı ve yayında' : 'active questions in database'}
                </p>
              </button>

              <button
                onClick={() => setTab('grading')}
                className="p-3 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'tr' ? 'Ödev Notlandırma' : 'Grade Submissions'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {submissions.filter(s => s.status === 'pending').length} {lang === 'tr' ? 'teslim inceleme bekliyor' : 'pending reviews'}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: QUIZ MANAGEMENT */}
        {currentTab === 'quizzes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('instructor.quizList')}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {t('instructor.totalQuestionsCount', { count: quizzes.length })}
              </span>
            </div>

            <div className="space-y-2">
              {quizzes.map((quiz) => {
                const qTitle = resolveText(quiz.title);
                const qText = resolveText(quiz.question);
                const qOptions = resolveArray(quiz.options);
                const qExpl = resolveText(quiz.explanation);

                return (
                  <div key={quiz.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                            {quiz.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {quiz.difficulty} • {quiz.points || 10} pts
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-xs">{qTitle}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{qText}</p>

                    {/* Options Preview */}
                    <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                      {qOptions.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded border flex items-center gap-1.5 ${
                            oIdx === quiz.correctIndex
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="font-mono text-[9px] w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                            {oIdx + 1}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                      ))}
                    </div>

                    {qExpl && (
                      <p className="text-[10px] text-slate-400 italic border-l border-amber-500/40 pl-2 mt-1">
                        {qExpl}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: ASSIGNMENT MANAGEMENT */}
        {currentTab === 'assignments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('instructor.assignmentsList')}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {assignments.length} {lang === 'tr' ? 'Aktif Ödev' : 'Active'}
              </span>
            </div>

            <div className="space-y-2">
              {assignments.map((asg) => {
                const asgTitle = resolveText(asg.title);
                const asgDesc = resolveText(asg.description);
                return (
                  <div key={asg.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-200 text-xs">{asgTitle}</h4>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {t('instructor.targetScore')} {asg.targetScore}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">{asgDesc}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {t('instructor.dueDate')} {asg.dueDate}
                      </span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {t('instructor.submissionRate')} {asg.submissionRate}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: SUBMISSIONS AND GRADING (Teslimler ve Notlandırma) */}
        {currentTab === 'grading' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('instructor.submissionsTitle')}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {submissions.length} {lang === 'tr' ? 'Teslim' : 'Submissions'}
              </span>
            </div>

            <div className="space-y-2">
              {submissions.map((sub) => {
                const linkedAsg = assignments.find((a) => a.id === sub.assignmentId);
                const asgTitle = linkedAsg ? resolveText(linkedAsg.title) : 'Sondaj Simülasyonu Ödevi';
                const isGraded = sub.status === 'graded';

                return (
                  <div key={sub.id} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 text-xs">{sub.studentName}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                            isGraded
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {isGraded ? t('instructor.statusGraded') : t('instructor.statusPending')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{asgTitle}</p>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(sub.submittedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-lg font-black font-mono text-amber-400">{sub.score}</span>
                          <span className="text-[10px] text-slate-500 font-mono">/{sub.maxScore}</span>
                        </div>

                        <button
                          onClick={() => openGradingModal(sub)}
                          className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors cursor-pointer border border-slate-700"
                        >
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>{t('instructor.gradeAction')}</span>
                        </button>
                      </div>
                    </div>

                    {sub.teacherFeedback && (
                      <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[10px] text-slate-300 italic">
                        "{sub.teacherFeedback}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: STUDENT ROSTER (Öğrenci Listesi & Sınıf Yönetimi) */}
        {currentTab === 'students' && (
          <div className="space-y-3.5">
            {/* Classroom Banner & Code Card */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-3.5 rounded-2xl border border-sky-500/30 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {classroom?.name || 'Sondaj Mühendisliği Sınıfı'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'tr' 
                        ? 'Öğrencileriniz bu sınıf kodu ile kayıt olarak ödev ve quizlere erişebilir'
                        : 'Students can register using this class code to access assignments and quizzes'}
                    </p>
                  </div>
                </div>

                {/* Class Code & Copy Button */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="px-3 py-1.5 bg-slate-950 border border-amber-500/40 rounded-xl flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400">
                      {t('auth.classCodeLabel')}
                    </span>
                    <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                      {classroom?.code || 'PET101'}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyClassCode}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                      codeCopied
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                    title={t('auth.copyCode')}
                  >
                    {codeCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{codeCopied ? t('auth.copied') : t('auth.copyCode')}</span>
                  </button>
                </div>
              </div>

              {/* Roster Actions Toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>
                    {enrolledAccounts.length} {t('auth.studentCount')}
                  </span>
                </div>

                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('auth.addStudentBtn')}</span>
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-2">
              {enrolledAccounts.length === 0 ? (
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('auth.noStudentsInClass')}
                  </p>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition-colors cursor-pointer mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t('auth.addStudentBtn')}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-950/70 rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden shadow-inner">
                  {enrolledAccounts.map((student) => {
                    // Match with submissions score if available
                    const studentSubs = submissions.filter((s) => s.studentId === student.id);
                    const avgScore = studentSubs.length > 0
                      ? Math.round(studentSubs.reduce((acc, c) => acc + c.score, 0) / studentSubs.length)
                      : 88;

                    return (
                      <div 
                        key={student.id} 
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm shrink-0">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {student.fullName}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                @{student.username}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span>{student.studentNumber || 'Öğrenci'}</span>
                              <span>•</span>
                              <span>
                                {student.createdAt ? new Date(student.createdAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US') : '2026'}
                              </span>
                              {student.plainTempPassword && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-300 font-semibold bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-500/30">
                                    {t('auth.tempPassword')} {student.plainTempPassword}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-auto">
                          <div className="text-right">
                            <div className="text-base font-black font-mono text-amber-400 leading-none">
                              {avgScore}
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">
                              {studentSubs.length} {lang === 'tr' ? 'teslim' : 'submissions'}
                            </span>
                          </div>

                          {/* Delete Student Action */}
                          <button
                            onClick={() => handleRemoveStudent(student.id, student.fullName)}
                            className="p-1.5 rounded-lg hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
                            title={t('auth.removeStudent')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[480px] max-w-full p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  {t('instructor.gradeSubmissionModalTitle')}
                </h3>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-200 text-sm">{gradingSubmission.studentName}</div>
                <div className="text-[11px] text-slate-400">
                  {assignments.find(a => a.id === gradingSubmission.assignmentId)?.title ? resolveText(assignments.find(a => a.id === gradingSubmission.assignmentId)!.title) : 'Ödev'}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t('instructor.scoreInputLabel')}
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScoreInput}
                  onChange={(e) => setGradeScoreInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-base font-bold text-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t('instructor.feedbackInputLabel')}
                </label>
                <textarea
                  rows={4}
                  value={gradeFeedbackInput}
                  onChange={(e) => setGradeFeedbackInput(e.target.value)}
                  placeholder={t('instructor.feedbackPlaceholder')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {t('instructor.cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t('instructor.saveGradeBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal (Bilingual TR/EN input with automatic fallback) */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[480px] max-w-full p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">{t('instructor.createModalTitle')}</h3>
              </div>
              <button
                onClick={() => setShowNewAssignmentModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              {/* Bilingual Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAsgTab('tr')}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    asgTab === 'tr' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('instructor.modalTabTr')}
                </button>
                <button
                  type="button"
                  onClick={() => setAsgTab('en')}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    asgTab === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('instructor.modalTabEn')}
                </button>
              </div>

              {/* Tab Content: TR */}
              {asgTab === 'tr' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.assignmentTitleTr')}
                    </label>
                    <input
                      type="text"
                      required={!titleEn.trim()}
                      placeholder="Örn: 10,000 ft TVD Kuyu Kontrolü ve Kill-Sheet"
                      value={titleTr}
                      onChange={(e) => setTitleTr(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.assignmentDescTr')}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Öğrencinin tamamlaması gereken senaryolar ve yönergeler..."
                      value={descTr}
                      onChange={(e) => setDescTr(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab Content: EN */}
              {asgTab === 'en' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.assignmentTitleEn')}
                    </label>
                    <input
                      type="text"
                      required={!titleTr.trim()}
                      placeholder="e.g. 10,000 ft TVD Well Control & Kill-Sheet"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.assignmentDescEn')}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Scenarios and procedures the student must execute..."
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Notice */}
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-amber-300/80">
                {t('instructor.fallbackNotice')}
              </div>

              {/* Common Fields: Due Date & Target Score */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('instructor.dueDateLabel')}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('instructor.targetScoreLabel')}
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newTargetScore}
                    onChange={(e) => setNewTargetScore(parseInt(e.target.value) || 80)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {t('instructor.cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t('instructor.saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Quiz Question Modal (Bilingual TR/EN input with automatic fallback) */}
      {showNewQuizModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[520px] max-w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">{t('instructor.createQuizModalTitle')}</h3>
              </div>
              <button
                onClick={() => setShowNewQuizModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3.5 text-xs">
              {/* Bilingual Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setQuizTab('tr')}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    quizTab === 'tr' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('instructor.modalTabTr')}
                </button>
                <button
                  type="button"
                  onClick={() => setQuizTab('en')}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    quizTab === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('instructor.modalTabEn')}
                </button>
              </div>

              {/* TR Tab Fields */}
              {quizTab === 'tr' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.quizTitleTr')}
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Kuyu Başı Basınç Emniyeti ve Valf Kontrolü"
                      value={qTitleTr}
                      onChange={(e) => setQTitleTr(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.quizQuestionTr')}
                    </label>
                    <textarea
                      rows={2}
                      required={!qQuestionEn.trim()}
                      placeholder="Soru metnini giriniz..."
                      value={qQuestionTr}
                      onChange={(e) => setQQuestionTr(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-300 font-semibold">
                      Seçenekler (TR)
                    </label>
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center font-mono text-[10px] text-slate-400">{idx + 1}.</span>
                        <input
                          type="text"
                          placeholder={`${t('instructor.quizOptionTr', { number: idx + 1 })}`}
                          value={qOptionsTr[idx] || ''}
                          onChange={(e) => {
                            const updated = [...qOptionsTr];
                            updated[idx] = e.target.value;
                            setQOptionsTr(updated);
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.quizExplanationTr')}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Sorunun teknik açıklaması ve yönetmelik gerekçesi..."
                      value={qExplanationTr}
                      onChange={(e) => setQExplanationTr(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* EN Tab Fields */}
              {quizTab === 'en' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.quizTitleEn')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wellhead Pressure Safety & Valve Integrity"
                      value={qTitleEn}
                      onChange={(e) => setQTitleEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.quizQuestionEn')}
                    </label>
                    <textarea
                      rows={2}
                      required={!qQuestionTr.trim()}
                      placeholder="Enter the question text..."
                      value={qQuestionEn}
                      onChange={(e) => setQQuestionEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-300 font-semibold">
                      Options (EN)
                    </label>
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center font-mono text-[10px] text-slate-400">{idx + 1}.</span>
                        <input
                          type="text"
                          placeholder={`${t('instructor.quizOptionEn', { number: idx + 1 })}`}
                          value={qOptionsEn[idx] || ''}
                          onChange={(e) => {
                            const updated = [...qOptionsEn];
                            updated[idx] = e.target.value;
                            setQOptionsEn(updated);
                          }}
                          className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('instructor.quizExplanationEn')}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Technical explanation and standard reference..."
                      value={qExplanationEn}
                      onChange={(e) => setQExplanationEn(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Notice */}
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-amber-300/80">
                {t('instructor.fallbackNotice')}
              </div>

              {/* Shared Metadata Fields: Category, Correct Option, Difficulty, Points */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('instructor.quizCategory')}
                  </label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="ppe">PPE / KKD</option>
                    <option value="h2s">H2S Gazı</option>
                    <option value="fire">Yangın Mücadele</option>
                    <option value="heights">Yüksekte Çalışma</option>
                    <option value="loto">LOTO İzolasyon</option>
                    <option value="rigfloor">Kule Tabanı (Red Zone)</option>
                    <option value="emergency">Acil Durum</option>
                    <option value="chemicals">Kimyasallar</option>
                    <option value="environmental">Çevre & Atık</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('instructor.quizCorrectIndex')}
                  </label>
                  <select
                    value={qCorrectIndex}
                    onChange={(e) => setQCorrectIndex(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer font-bold text-amber-400"
                  >
                    <option value={0}>1. Seçenek (Option 1)</option>
                    <option value={1}>2. Seçenek (Option 2)</option>
                    <option value={2}>3. Seçenek (Option 3)</option>
                    <option value={3}>4. Seçenek (Option 4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('instructor.quizDifficulty')}
                  </label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Temel">Temel (Basic)</option>
                    <option value="Orta">Orta (Intermediate)</option>
                    <option value="İleri">İleri (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('instructor.quizPoints')}
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={qPoints}
                    onChange={(e) => setQPoints(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewQuizModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {t('instructor.cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {t('instructor.saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal (Ad Soyad ile otomatik kullanıcı adı ve şifre üretme) */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[440px] max-w-full p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  {t('auth.addStudentModalTitle')}
                </h3>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t('auth.addStudentModalDesc')}
            </p>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {t('auth.fullName')} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('auth.studentNamePlaceholder')}
                  value={newStudentNameInput}
                  onChange={(e) => setNewStudentNameInput(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{t('auth.classCodeLabel')}</span>
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {classroom?.code || 'PET101'}
                </span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {t('auth.addStudentBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Created Student Credentials Result Modal */}
      {createdStudentResult && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-[450px] max-w-full p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  {t('auth.generatedCredentialsTitle')}
                </h3>
              </div>
              <button
                onClick={() => setCreatedStudentResult(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
              {t('auth.createStudentSuccess')}
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('auth.fullName')}:</span>
                <span className="text-white font-bold">{createdStudentResult.student.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('auth.username')}:</span>
                <span className="text-amber-400 font-bold">{createdStudentResult.student.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('auth.tempPassword')}:</span>
                <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {createdStudentResult.tempPassword}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('auth.classCode')}:</span>
                <span className="text-sky-300 font-bold">{classroom?.code || 'PET101'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  credsCopied
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {credsCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{credsCopied ? t('auth.copied') : t('auth.copyCredentials')}</span>
              </button>

              <button
                type="button"
                onClick={() => setCreatedStudentResult(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
