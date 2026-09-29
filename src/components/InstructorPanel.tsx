import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_ASSIGNMENTS, StudentRecord, Assignment } from '../data/instructor';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Calendar,
  X
} from 'lucide-react';

export const InstructorPanel: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(MOCK_STUDENTS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-11-01');
  const [newDesc, setNewDesc] = useState('');
  const [newTargetScore, setNewTargetScore] = useState(80);

  const averageScore = Math.round(
    students.reduce((acc, s) => acc + s.overallScore, 0) / (students.length || 1)
  );

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle,
      dueDate: newDueDate,
      description: newDesc || 'PetroSim Sondaj Simülasyonu ödevi.',
      requiredScenarios: ['scenario-kick', 'hydrostatic-pressure'],
      targetScore: newTargetScore,
      enrolledStudentsCount: 42,
      submissionRate: 0
    };

    setAssignments((prev) => [created, ...prev]);
    setShowNewAssignmentModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div
      id="instructor-panel"
      className="absolute top-16 left-4 z-20 w-[500px] max-h-[calc(100vh-5.5rem)] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl flex flex-col text-slate-200 overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">Eğitmen Yönetim Portalı</h2>
            <p className="text-[11px] text-slate-400">Petrol & Doğalgaz Mühendisliği Bölümü</p>
          </div>
        </div>

        <button
          id="open-new-assignment-btn"
          onClick={() => setShowNewAssignmentModal(true)}
          className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Yeni Ödev Ata</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Kayıtlı Öğrenci</span>
            <span className="text-xl font-bold text-sky-400">{students.length}</span>
            <span className="text-[10px] text-slate-500 block font-sans">Aktif Dönem</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Sınıf Ortalaması</span>
            <span className="text-xl font-bold text-amber-400">{averageScore}</span>
            <span className="text-[10px] text-slate-500 block font-sans">/ 100 Puan</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Aktif Ödevler</span>
            <span className="text-xl font-bold text-emerald-400">{assignments.length}</span>
            <span className="text-[10px] text-slate-500 block font-sans">Simülasyon</span>
          </div>
        </div>

        {/* Cohort Weak Topics Alert */}
        <div className="p-3 bg-amber-950/25 border border-amber-500/40 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Sınıf Genelinde En Çok Zorlanılan Konular (Cohort Gaps):</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <div className="font-semibold text-slate-200">Choke Manifold Ayarı</div>
              <div className="text-[10px] text-amber-400 font-mono">%48 Hata Oranı</div>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <div className="font-semibold text-slate-200">MAASP & Pabuç Çatlatma</div>
              <div className="text-[10px] text-amber-400 font-mono">%36 Hata Oranı</div>
            </div>
          </div>
        </div>

        {/* Student Roster Table */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Öğrenci Performans Listesi</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Bahar Dönemi</span>
          </div>

          <div className="bg-slate-950/70 rounded-xl border border-slate-800 divide-y divide-slate-800 overflow-hidden">
            {students.map((student) => (
              <div key={student.id} className="p-3 flex items-center justify-between gap-2 hover:bg-slate-900/60 transition-colors">
                <div>
                  <div className="font-bold text-slate-200">{student.fullName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{student.studentNumber} • {student.lastActive}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-medium">Güçlü:</span> {student.strongTopics[0] || 'Temel'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black font-mono text-amber-400">{student.overallScore}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    student.assignmentStatus === 'Tamamlandı'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {student.assignmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Assignments */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Aktif Simülasyon Ödevleri</span>
          </div>

          <div className="space-y-2">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-xs text-white">
                  <span>{asg.title}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    Son Teslim: {asg.dueDate}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{asg.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Hedef Skor: <strong className="text-amber-400 font-mono">{asg.targetScore}+</strong></span>
                  <span>Teslim Oranı: <strong className="text-emerald-400 font-mono">%{asg.submissionRate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Assignment Modal */}
      {showNewAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-md shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Yeni Simülasyon Ödevi Oluştur</h3>
              <button
                onClick={() => setShowNewAssignmentModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ödev Başlığı:</label>
                <input
                  type="text"
                  required
                  placeholder="örn: Well Control & Kick Tolerance Benchmark"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Son Teslim Tarihi:</label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Hedef Başarı Puanı:</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={newTargetScore}
                  onChange={(e) => setNewTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Açıklama ve Kapsam:</label>
                <textarea
                  rows={3}
                  placeholder="Öğrencilerin tamamlaması gereken senaryolar ve hidrostatik hesaplar..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors"
                >
                  Ödevi Ata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
