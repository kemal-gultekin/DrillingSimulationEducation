import React, { useState, useEffect } from 'react';
import { assignmentRepository, submissionRepository, AssignmentItem, SubmissionItem } from '../repositories';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n';
import { AppMode } from '../types';
import { 
  FileText, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Clock, 
  Play, 
  ArrowRight,
  Award,
  AlertCircle
} from 'lucide-react';

interface StudentAssignmentsPanelProps {
  onNavigateToMode?: (mode: AppMode) => void;
}

export const StudentAssignmentsPanel: React.FC<StudentAssignmentsPanelProps> = ({
  onNavigateToMode
}) => {
  const { currentUser } = useAuth();
  const { t, resolveText, lang } = useI18n();

  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      assignmentRepository.getAll(),
      submissionRepository.getByStudentId(currentUser.id)
    ]).then(([asgList, subList]) => {
      setAssignments(asgList);
      setSubmissions(subList);
      setLoading(false);
    });
  }, [currentUser.id]);

  const handleStartAssignment = (asg: AssignmentItem) => {
    // If linked to a scenario or has required scenarios, switch to scenarios mode
    if (onNavigateToMode) {
      if (asg.requiredScenarios && asg.requiredScenarios.length > 0) {
        onNavigateToMode('scenarios');
      } else {
        onNavigateToMode('engineering');
      }
    }
  };

  return (
    <div
      id="student-assignments-panel"
      className="absolute top-16 left-4 z-20 w-[480px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">
              {lang === 'tr' ? 'Ödevlerim & Saha Görevleri' : 'My Assignments & Tasks'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {lang === 'tr' 
                ? 'Eğitmenler tarafından atanan aktif sondaj simülasyon ödevleri' 
                : 'Active drilling tasks assigned by course instructors'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full border border-slate-700">
          {assignments.length} {lang === 'tr' ? 'Ödev' : 'Tasks'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3.5 text-xs">
        {loading ? (
          <div className="text-center py-8 text-slate-400 font-mono">
            {t('common.loading')}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-mono">
            {t('common.empty')}
          </div>
        ) : (
          assignments.map((asg) => {
            const asgTitle = resolveText(asg.title);
            const asgDesc = resolveText(asg.description);
            const submission = submissions.find((s) => s.assignmentId === asg.id);
            const isCompleted = submission && submission.status === 'graded';
            const isPending = submission && submission.status === 'pending';

            return (
              <div
                key={asg.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-950/70 border-emerald-500/30'
                    : isPending
                    ? 'bg-slate-950/70 border-amber-500/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {lang === 'tr' ? 'Tamamlandı' : 'Completed'} ({submission.score}/{submission.maxScore})
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          <Clock className="w-3 h-3" />
                          {lang === 'tr' ? 'Değerlendirmede' : 'Under Review'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          {lang === 'tr' ? 'Teslim Bekliyor' : 'Pending Submission'}
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-slate-400">
                        {t('instructor.targetScore')} {asg.targetScore}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-100">{asgTitle}</h4>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  {asgDesc}
                </p>

                {/* Submission Feedback if graded */}
                {submission?.teacherFeedback && (
                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-200 mb-3 space-y-0.5">
                    <span className="font-bold block text-emerald-400 text-[10px] uppercase font-mono">
                      {lang === 'tr' ? 'Eğitmen Değerlendirmesi:' : 'Instructor Feedback:'}
                    </span>
                    <p className="italic">"{submission.teacherFeedback}"</p>
                  </div>
                )}

                {/* Footer and Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('instructor.dueDate')} {asg.dueDate}</span>
                  </div>

                  <button
                    onClick={() => handleStartAssignment(asg)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>
                      {isCompleted
                        ? (lang === 'tr' ? 'Tekrar Alıştır' : 'Practice Again')
                        : (lang === 'tr' ? 'Görevi Başlat' : 'Start Task')}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
