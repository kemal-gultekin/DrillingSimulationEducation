import React from 'react';
import { AppMode, CameraViewMode } from '../types';
import { useI18n } from '../i18n';
import { useAuth } from '../auth/AuthContext';
import { 
  Layers, 
  ShieldAlert, 
  Calculator, 
  AlertOctagon, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Video, 
  Flame,
  Orbit,
  Footprints,
  FileText,
  HelpCircle,
  ClipboardCheck,
  Users,
  LayoutDashboard,
  User,
  RefreshCw,
  LogIn,
  LogOut,
  Keyboard
} from 'lucide-react';

interface NavigationHeaderProps {
  currentMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  onResetCamera: () => void;
  isPumping: boolean;
  onTogglePumps: () => void;
  cameraViewMode: CameraViewMode;
  onChangeCameraViewMode: (mode: CameraViewMode) => void;
  isSubsurfaceMode?: boolean;
  onToggleSubsurface?: () => void;
  onOpenShortcuts?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentMode,
  onChangeMode,
  onResetCamera,
  isPumping,
  onTogglePumps,
  cameraViewMode,
  onChangeCameraViewMode,
  isSubsurfaceMode = false,
  onToggleSubsurface,
  onOpenShortcuts
}) => {
  const { lang, setLang, t } = useI18n();
  const { currentUser, switchRole, openLoginModal, logout } = useAuth();

  // Student specific navigation tabs
  const studentModes: { id: AppMode; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'explore', labelKey: 'nav.explore', icon: <Layers className="w-4 h-4" /> },
    { id: 'safety', labelKey: 'nav.safety', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'engineering', labelKey: 'nav.engineering', icon: <Calculator className="w-4 h-4" /> },
    { id: 'scenarios', labelKey: 'nav.scenarios', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'quizzes', labelKey: 'nav.quizzes', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'my-assignments', labelKey: 'nav.myAssignments', icon: <FileText className="w-4 h-4" /> },
    { id: 'my-grades', labelKey: 'nav.myGrades', icon: <Award className="w-4 h-4" /> }
  ];

  // Instructor specific navigation tabs
  const instructorModes: { id: AppMode; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'instructor-dashboard', labelKey: 'nav.instructorDashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'instructor-quizzes', labelKey: 'nav.instructorQuizzes', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'instructor-assignments', labelKey: 'nav.instructorAssignments', icon: <FileText className="w-4 h-4" /> },
    { id: 'instructor-grading', labelKey: 'nav.instructorGrading', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'instructor-students', labelKey: 'nav.instructorStudents', icon: <Users className="w-4 h-4" /> },
    { id: 'explore', labelKey: 'nav.viewRig', icon: <Layers className="w-4 h-4" /> }
  ];

  const activeModesList = currentUser.role === 'student' ? studentModes : instructorModes;

  return (
    <header
      id="main-navigation-header"
      className="absolute top-0 left-0 right-0 h-14 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 z-30 flex items-center justify-between px-3 md:px-4 text-slate-200 select-none"
    >
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Flame className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>{t('nav.brandTitle')}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {t('nav.brandTag')}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5 font-medium">
              {t('nav.brandSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Role-Specific Mode Navigation Bar */}
      <nav 
        id="role-navigation-bar"
        className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-[55vw]"
      >
        {activeModesList.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`nav-btn-${m.id}`}
              onClick={() => onChangeMode(m.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? currentUser.role === 'instructor'
                    ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                    : 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {m.icon}
              <span>{t(m.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: User Profile, Camera Mode, Pumps, Language Toggle & Camera Reset */}
      <div className="flex items-center gap-2 shrink-0">
        {/* User Profile Pill & Role Switcher */}
        <div 
          id="user-profile-badge"
          className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs"
        >
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
            title={lang === 'tr' ? 'Profil / Rol Değiştir' : 'Profile / Switch Role'}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
              currentUser.role === 'instructor' ? 'bg-sky-500 text-slate-950' : 'bg-amber-500 text-slate-950'
            }`}>
              {currentUser.role === 'instructor' ? <GraduationCap className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="font-bold text-white max-w-[110px] truncate hidden sm:inline">
              {currentUser.fullName}
            </span>
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${
              currentUser.role === 'instructor'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {currentUser.role === 'instructor' ? t('nav.instructorRole') : t('nav.studentRole')}
            </span>
          </button>

          {/* Quick Role Toggle button */}
          <button
            onClick={() => switchRole(currentUser.role === 'student' ? 'instructor' : 'student')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            title={`${t('nav.switchRole')} (${currentUser.role === 'student' ? t('nav.instructorRole') : t('nav.studentRole')})`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Logout Button */}
          <button
            id="logout-btn"
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title={t('auth.logout')}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Camera Mode Toggle: Orbit vs Walk (Available in 3D views) */}
        <div className="hidden xl:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            id="cam-mode-orbit-btn"
            onClick={() => onChangeCameraViewMode('orbit')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              cameraViewMode === 'orbit'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={t('nav.orbitTooltip')}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>{t('nav.orbitView')}</span>
          </button>
          <button
            id="cam-mode-walk-btn"
            onClick={() => onChangeCameraViewMode('walk')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              cameraViewMode === 'walk'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={t('nav.walkTooltip')}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>{t('nav.walkView')}</span>
          </button>
        </div>

        {/* Circulation Pump Toggle */}
        <button
          id="toggle-pumps-btn"
          onClick={onTogglePumps}
          className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            isPumping
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
          title={t('nav.togglePumpsTooltip')}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isPumping ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span>{isPumping ? t('nav.pumpsRunning') : t('nav.pumpsStopped')}</span>
        </button>

        {/* Subsurface Mode Toggle (Yeraltı Görünümü - G tuşu) */}
        {onToggleSubsurface && (
          <button
            id="toggle-subsurface-btn"
            onClick={onToggleSubsurface}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              isSubsurfaceMode
                ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={`${t('subsurface.toggleBtn')} [G]`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSubsurfaceMode ? t('subsurface.exitBtn') : t('subsurface.toggleBtn')}</span>
            <kbd className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-amber-300 font-mono border border-slate-700">G</kbd>
          </button>
        )}

        {/* Shortcuts Modal Button */}
        {onOpenShortcuts && (
          <button
            id="open-shortcuts-btn"
            onClick={onOpenShortcuts}
            className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title={t('shortcuts.shortcutsHelp')}
          >
            <Keyboard className="w-4 h-4" />
          </button>
        )}

        {/* Language Switcher (TR / EN) */}
        <div
          id="language-switcher"
          className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 font-mono text-xs"
          role="group"
          aria-label={t('nav.language')}
        >
          <button
            id="lang-tr-btn"
            onClick={() => setLang('tr')}
            className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              lang === 'tr'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Türkçe"
          >
            TR
          </button>
          <button
            id="lang-en-btn"
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="English"
          >
            EN
          </button>
        </div>

        {/* Camera Reset */}
        <button
          id="reset-camera-btn"
          onClick={onResetCamera}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={t('nav.resetCamera')}
        >
          <Video className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </header>
  );
};
