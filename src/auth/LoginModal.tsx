import React, { useState } from 'react';
import { useAuth, DEMO_PROFILES } from './AuthContext';
import { useI18n } from '../i18n';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  User, 
  X, 
  Check, 
  ArrowRight, 
  Flame, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles,
  KeyRound,
  Mail,
  ShieldCheck,
  Hash,
  School
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated,
    isLoginModalOpen, 
    closeLoginModal,
    loginWithCredentials,
    registerInstructorAccount,
    registerStudentAccount,
    selectDemoUser
  } = useAuth();
  
  const { t, lang, setLang } = useI18n();

  // Primary Role selection: Student vs Instructor
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  // Mode selection: Sign In vs Register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Common credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student specific registration state
  const [studentFullName, setStudentFullName] = useState('');
  const [classCode, setClassCode] = useState('PET101');
  const [studentNumber, setStudentNumber] = useState('');

  // Instructor specific registration state
  const [instFirstName, setInstFirstName] = useState('');
  const [instLastName, setInstLastName] = useState('');
  const [instEmail, setInstEmail] = useState('');
  const [instTitle, setInstTitle] = useState('');

  // Error and Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If user is already authenticated and modal is NOT open, don't show
  if (isAuthenticated && !isLoginModalOpen) {
    return null;
  }

  const resetFormState = () => {
    setErrorMessage(null);
    setUsername('');
    setPassword('');
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
  };

  const handleAuthModeChange = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setErrorMessage(null);
  };

  const parseErrorMessage = (err: any): string => {
    const msg = err?.message || '';
    if (msg.includes('ERR_USER_NOT_FOUND')) {
      return t('auth.errUserNotFound');
    }
    if (msg.includes('ERR_INVALID_PASSWORD')) {
      return t('auth.errInvalidPassword');
    }
    if (msg.includes('ERR_USERNAME_TAKEN')) {
      const suggested = `${username || 'kullanici'}${Math.floor(10 + Math.random() * 89)}`;
      return t('auth.errUsernameTaken', { suggested });
    }
    if (msg.includes('ERR_INVALID_CLASS_CODE')) {
      return t('auth.errInvalidClassCode');
    }
    return msg || t('common.error');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'login') {
      if (!username.trim() || !password.trim()) {
        setErrorMessage(t('auth.errRequiredFields'));
        return;
      }

      setIsLoading(true);
      try {
        await loginWithCredentials(username.trim(), password);
      } catch (err: any) {
        setErrorMessage(parseErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Register Mode
      if (selectedRole === 'student') {
        if (!studentFullName.trim() || !username.trim() || !password.trim() || !classCode.trim()) {
          setErrorMessage(t('auth.errRequiredFields'));
          return;
        }
        if (password.length < 4) {
          setErrorMessage(t('auth.errPasswordLength'));
          return;
        }

        setIsLoading(true);
        try {
          await registerStudentAccount({
            fullName: studentFullName.trim(),
            username: username.trim(),
            password,
            classCode: classCode.trim().toUpperCase(),
            studentNumber: studentNumber.trim() || undefined
          });
        } catch (err: any) {
          setErrorMessage(parseErrorMessage(err));
        } finally {
          setIsLoading(false);
        }
      } else {
        // Instructor Registration
        if (!instFirstName.trim() || !instLastName.trim() || !instEmail.trim() || !username.trim() || !password.trim()) {
          setErrorMessage(t('auth.errRequiredFields'));
          return;
        }
        if (password.length < 4) {
          setErrorMessage(t('auth.errPasswordLength'));
          return;
        }

        setIsLoading(true);
        try {
          await registerInstructorAccount({
            firstName: instFirstName.trim(),
            lastName: instLastName.trim(),
            email: instEmail.trim(),
            username: username.trim(),
            password,
            title: instTitle.trim() || undefined
          });
        } catch (err: any) {
          setErrorMessage(parseErrorMessage(err));
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div 
      id="login-role-modal"
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-[540px] max-w-full my-auto overflow-hidden shadow-2xl text-slate-200 flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 pb-4 border-b border-slate-800/80 flex items-start justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Flame className="w-6 h-6 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {t('auth.modalTitle')}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  PetroSim
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('auth.modalSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Switcher */}
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 font-mono text-xs">
              <button
                type="button"
                onClick={() => setLang('tr')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  lang === 'tr' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  lang === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Close button if user already has an active session */}
            {isAuthenticated && (
              <button
                onClick={closeLoginModal}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* 1. Main Role Toggle Tabs: Student vs Instructor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {lang === 'tr' ? 'Rolünüzü Seçin:' : 'Select Your Role:'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Student Role Tab */}
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  selectedRole === 'student' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{t('auth.iAmStudent')}</span>
                    {selectedRole === 'student' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'tr' ? 'Simülasyon, Ödevler & Notlar' : 'Rig Simulation, Tasks & Grades'}
                  </p>
                </div>
              </button>

              {/* Instructor Role Tab */}
              <button
                type="button"
                onClick={() => handleRoleChange('instructor')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  selectedRole === 'instructor'
                    ? 'bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  selectedRole === 'instructor' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{t('auth.iAmInstructor')}</span>
                    {selectedRole === 'instructor' && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {lang === 'tr' ? 'Sınıf, Ödev & Quiz Yönetimi' : 'Classroom, Tasks & Grading'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Sub-mode Selector: Sign In vs Register */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleAuthModeChange('login')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? selectedRole === 'student'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{t('auth.loginTab')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleAuthModeChange('register')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? selectedRole === 'student'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('auth.registerTab')}</span>
            </button>
          </div>

          {/* 3. Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* 4. The Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* If Student Registration Mode */}
            {authMode === 'register' && selectedRole === 'student' && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('auth.fullName')} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('auth.fullNamePlaceholder')}
                    value={studentFullName}
                    onChange={(e) => setStudentFullName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">
                      {t('auth.classCode')} <span className="text-amber-400">*</span>
                    </label>
                    <span className="text-[10px] text-amber-300/80 font-mono">
                      (Örn: PET101)
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder={t('auth.classCodePlaceholder')}
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono font-bold tracking-wider text-sm focus:outline-none focus:border-amber-500 uppercase"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {t('auth.classCodeHint')}
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('auth.studentNumber')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('auth.studentNumberPlaceholder')}
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </>
            )}

            {/* If Instructor Registration Mode */}
            {authMode === 'register' && selectedRole === 'instructor' && (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('auth.firstName')} <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('auth.firstNamePlaceholder')}
                      value={instFirstName}
                      onChange={(e) => setInstFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {t('auth.lastName')} <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('auth.lastNamePlaceholder')}
                      value={instLastName}
                      onChange={(e) => setInstLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('auth.email')} <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t('auth.emailPlaceholder')}
                    value={instEmail}
                    onChange={(e) => setInstEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {t('auth.academicTitle')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('auth.academicTitlePlaceholder')}
                    value={instTitle}
                    onChange={(e) => setInstTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </>
            )}

            {/* Username Field (Common to all) */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {t('auth.username')} <span className={selectedRole === 'student' ? 'text-amber-400' : 'text-sky-400'}>*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder={t('auth.usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                className={`w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none font-mono ${
                  selectedRole === 'student' ? 'focus:border-amber-500' : 'focus:border-sky-500'
                }`}
              />
            </div>

            {/* Password Field with Show/Hide Toggle (Common to all) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">
                  {t('auth.password')} <span className={selectedRole === 'student' ? 'text-amber-400' : 'text-sky-400'}>*</span>
                </label>
                {authMode === 'login' && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    (Demo: Petro2026!)
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-10 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none font-mono ${
                    selectedRole === 'student' ? 'focus:border-amber-500' : 'focus:border-sky-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg text-slate-950 ${
                  selectedRole === 'student'
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                    : 'bg-sky-400 hover:bg-sky-300 shadow-sky-500/20'
                } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span>{t('common.loading')}</span>
                ) : (
                  <>
                    <span>
                      {authMode === 'login'
                        ? selectedRole === 'student'
                          ? t('auth.studentLoginTitle')
                          : t('auth.instructorLoginTitle')
                        : selectedRole === 'student'
                          ? t('auth.registerBtn')
                          : t('auth.instructorRegisterTitle')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Mode Switch Helper Link */}
          <div className="text-center">
            {authMode === 'login' ? (
              <button
                type="button"
                onClick={() => handleAuthModeChange('register')}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors underline cursor-pointer"
              >
                {t('auth.switchToRegister')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAuthModeChange('login')}
                className="text-xs text-slate-400 hover:text-white transition-colors underline cursor-pointer"
              >
                {t('auth.switchToLogin')}
              </button>
            )}
          </div>

          {/* Quick Demo Access Bar (One-click login for reviewer testing) */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('auth.demoAccountsTitle')}</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectDemoUser(DEMO_PROFILES[0])}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-xs text-slate-200">Kemal Gültekin</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {lang === 'tr' ? 'Öğrenci • Sınıf: PET101' : 'Student • Class: PET101'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoUser(DEMO_PROFILES[2])}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-bold text-xs text-slate-200">Prof. Dr. Ahmet Yılmaz</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {lang === 'tr' ? 'Eğitmen • Bölüm Başkanı' : 'Instructor • Dept Head'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
