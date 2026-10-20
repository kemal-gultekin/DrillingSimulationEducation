import React, { useState, useEffect } from 'react';
import { submissionRepository, assignmentRepository, SubmissionItem, AssignmentItem } from '../repositories';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { StudentProgressState } from '../types';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  FileText,
  Calendar,
  Star
} from 'lucide-react';

interface StudentGradesPanelProps {
  progress?: StudentProgressState;
}

export const StudentGradesPanel: React.FC<StudentGradesPanelProps> = ({ progress }) => {
  const { currentUser } = useAuth();
  const { t, resolveText, lang } = useI18n();

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      submissionRepository.getByStudentId(currentUser.id),
      assignmentRepository.getAll()
    ]).then(([subList, asgList]) => {
      setSubmissions(subList);
      setAssignments(asgList);
      setLoading(false);
    });
  }, [currentUser.id]);

  const gradedSubmissions = submissions.filter((s) => s.status === 'graded');
  const averageGrade = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, curr) => acc + curr.score, 0) / gradedSubmissions.length)
    : 85; // default fallback demo score

  return (
    <div
      id="student-grades-panel"
      className="absolute top-16 left-4 z-20 w-[490px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">
              {lang === 'tr' ? 'Notlarım & Başarı Karnesi' : 'My Grades & Scorecard'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {currentUser.fullName} ({currentUser.studentNumber || 'Öğrenci'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-full border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 font-sans">{lang === 'tr' ? 'Ortalama:' : 'Average:'}</span>
          <span className="text-amber-400 font-bold text-sm">{averageGrade}</span>
          <span className="text-[10px] text-slate-500">/ 100</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* GPA & Competency Summary Cards */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">
              {lang === 'tr' ? 'Ödev Teslimleri' : 'Assignments'}
            </span>
            <span className="text-lg font-bold text-sky-400">{submissions.length}</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">
              {lang === 'tr' ? 'Notlandırılan' : 'Graded'}
            </span>
            <span className="text-lg font-bold text-emerald-400">{gradedSubmissions.length}</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">
              {lang === 'tr' ? 'ISG Puanı' : 'Safety Score'}
            </span>
            <span className="text-lg font-bold text-amber-400">
              {progress ? progress.safetyScore : 90}
            </span>
          </div>
        </div>

        {/* Graded Assignments List */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'tr' ? 'Ödev Sonuçları & Değerlendirmeler' : 'Assignment Results & Evaluations'}</span>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              <div className="text-center py-6 text-slate-500 font-mono">{t('common.loading')}</div>
            ) : submissions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-slate-400">
                {lang === 'tr' 
                  ? 'Henüz teslim edilmiş bir ödeviniz bulunmuyor.' 
                  : 'No submitted assignments found yet.'}
              </div>
            ) : (
              submissions.map((sub) => {
                const linkedAsg = assignments.find((a) => a.id === sub.assignmentId);
                const asgTitle = linkedAsg ? resolveText(linkedAsg.title) : 'Sondaj Simülasyonu Ödevi';
                const isGraded = sub.status === 'graded';

                return (
                  <div key={sub.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-100 text-xs">{asgTitle}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(sub.submittedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        {isGraded ? (
                          <div className="flex items-baseline gap-0.5 font-mono">
                            <span className="text-base font-black text-amber-400">{sub.score}</span>
                            <span className="text-[10px] text-slate-500">/{sub.maxScore}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {lang === 'tr' ? 'Bekliyor' : 'Pending'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Teacher Feedback Note */}
                    {sub.teacherFeedback ? (
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase font-mono">
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'tr' ? 'Öğretmen Geri Bildirimi' : 'Instructor Feedback'}</span>
                        </div>
                        <p className="text-slate-300 italic leading-relaxed">
                          "{sub.teacherFeedback}"
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-500 italic">
                        {lang === 'tr' 
                          ? 'Eğitmen henüz yazılı geri bildirim girmedi.' 
                          : 'Instructor feedback is pending.'}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
