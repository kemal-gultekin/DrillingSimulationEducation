import { IAuthRepository, UserAccount, Classroom } from '../types';
import { hashPassword, generateSalt, generateClassCode, generateTempPassword, slugifyUsername } from '../../utils/crypto';

const USERS_STORAGE_KEY = 'petrosim_users_v2';
const CLASSES_STORAGE_KEY = 'petrosim_classes_v2';
const ACTIVE_USER_KEY = 'petrosim_active_user';

export class LocalStorageAuthRepository implements IAuthRepository {
  private users: UserAccount[] = [];
  private classrooms: Classroom[] = [];
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);

      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
      if (storedClasses) {
        this.classrooms = JSON.parse(storedClasses);
      }
    } catch {
      // fallback
    }

    // If empty, initialize default seed accounts and classroom
    if (!this.users || this.users.length === 0) {
      const defaultSalt = 'petro_salt_seed_2026';
      const defaultPassHash = await hashPassword('Petro2026!', defaultSalt);

      const defaultInstructor: UserAccount = {
        id: 'inst-1',
        username: 'ahmet.yilmaz',
        passwordHash: defaultPassHash,
        salt: defaultSalt,
        fullName: 'Prof. Dr. Ahmet Yılmaz',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@petrosim.edu',
        role: 'instructor',
        title: 'Sondaj ve Kuyu Mühendisliği Ana Bilim Dalı',
        createdAt: '2026-09-01T08:00:00.000Z'
      };

      const defaultClassroom: Classroom = {
        id: 'cls-1',
        name: 'PET-301 Sondaj Mühendisliği I',
        code: 'PET101',
        instructorId: 'inst-1',
        createdAt: '2026-09-01T08:30:00.000Z'
      };

      const defaultStudent1: UserAccount = {
        id: 'std-1',
        username: 'kemal.gultekin',
        passwordHash: defaultPassHash,
        salt: defaultSalt,
        fullName: 'Kemal Gültekin',
        firstName: 'Kemal',
        lastName: 'Gültekin',
        email: 'kemal.g@petrosim.edu',
        role: 'student',
        studentNumber: 'PETRO-2024-041',
        classCode: 'PET101',
        createdAt: '2026-09-05T10:00:00.000Z'
      };

      const defaultStudent2: UserAccount = {
        id: 'std-2',
        username: 'zeynep.kaya',
        passwordHash: defaultPassHash,
        salt: defaultSalt,
        fullName: 'Zeynep Kaya',
        firstName: 'Zeynep',
        lastName: 'Kaya',
        email: 'zeynep.k@petrosim.edu',
        role: 'student',
        studentNumber: 'PETRO-2024-019',
        classCode: 'PET101',
        createdAt: '2026-09-06T11:30:00.000Z'
      };

      this.users = [defaultInstructor, defaultStudent1, defaultStudent2];
      this.classrooms = [defaultClassroom];
      this.persistUsers();
      this.persistClasses();
    }

    this.initialized = true;
  }

  private persistUsers(): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch {
      // ignore
    }
  }

  private persistClasses(): void {
    try {
      localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(this.classrooms));
    } catch {
      // ignore
    }
  }

  async login(username: string, password: string): Promise<UserAccount> {
    await this.ensureInitialized();
    const cleanUsername = username.trim().toLowerCase();

    const user = this.users.find(
      (u) => u.username.toLowerCase() === cleanUsername
    );

    if (!user) {
      throw new Error('ERR_USER_NOT_FOUND');
    }

    const testHash = await hashPassword(password, user.salt);
    if (testHash !== user.passwordHash) {
      throw new Error('ERR_INVALID_PASSWORD');
    }

    // Persist session
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }

    return user;
  }

  async registerInstructor(data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    title?: string;
  }): Promise<UserAccount> {
    await this.ensureInitialized();
    const cleanUsername = data.username.trim().toLowerCase();

    const existing = this.users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      throw new Error('ERR_USERNAME_TAKEN');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

    const newInstructor: UserAccount = {
      id: `inst-${Date.now()}`,
      username: cleanUsername,
      passwordHash,
      salt,
      fullName,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      role: 'instructor',
      title: data.title?.trim() || 'Sondaj ve Kuyu Mühendisliği',
      createdAt: new Date().toISOString()
    };

    // Auto-create initial classroom for new instructor
    const classCode = generateClassCode();
    const newClassroom: Classroom = {
      id: `cls-${Date.now()}`,
      name: `${data.lastName} - Sondaj Simülasyonu Sınıfı`,
      code: classCode,
      instructorId: newInstructor.id,
      createdAt: new Date().toISOString()
    };

    this.users.push(newInstructor);
    this.classrooms.push(newClassroom);
    this.persistUsers();
    this.persistClasses();

    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newInstructor));
    } catch {
      // ignore
    }

    return newInstructor;
  }

  async registerStudent(data: {
    fullName: string;
    username: string;
    password: string;
    classCode: string;
    studentNumber?: string;
  }): Promise<UserAccount> {
    await this.ensureInitialized();
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanClassCode = data.classCode.trim().toUpperCase();

    // Verify class code exists
    const classroom = this.classrooms.find((c) => c.code.toUpperCase() === cleanClassCode);
    if (!classroom) {
      throw new Error('ERR_INVALID_CLASS_CODE');
    }

    // Verify username uniqueness
    const existing = this.users.find((u) => u.username.toLowerCase() === cleanUsername);
    if (existing) {
      throw new Error('ERR_USERNAME_TAKEN');
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(data.password, salt);
    const cleanFullName = data.fullName.trim();

    const newStudent: UserAccount = {
      id: `std-${Date.now()}`,
      username: cleanUsername,
      passwordHash,
      salt,
      fullName: cleanFullName,
      role: 'student',
      classCode: classroom.code,
      studentNumber: data.studentNumber?.trim() || `PETRO-${Math.floor(1000 + Math.random() * 9000)}`,
      email: `${cleanUsername}@petrosim.edu`,
      createdAt: new Date().toISOString()
    };

    this.users.push(newStudent);
    this.persistUsers();

    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newStudent));
    } catch {
      // ignore
    }

    return newStudent;
  }

  async getCurrentUser(): Promise<UserAccount | null> {
    await this.ensureInitialized();
    try {
      const active = localStorage.getItem(ACTIVE_USER_KEY);
      if (active) {
        const parsed = JSON.parse(active);
        // Refresh with latest data from repository
        const fresh = this.users.find((u) => u.id === parsed.id);
        return fresh || parsed;
      }
    } catch {
      // ignore
    }
    return null;
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem(ACTIVE_USER_KEY);
    } catch {
      // ignore
    }
  }

  async getClassroomsByInstructor(instructorId: string): Promise<Classroom[]> {
    await this.ensureInitialized();
    return this.classrooms.filter((c) => c.instructorId === instructorId);
  }

  async createClassroom(instructorId: string, name: string, customCode?: string): Promise<Classroom> {
    await this.ensureInitialized();
    const code = (customCode?.trim().toUpperCase()) || generateClassCode();
    
    // Ensure unique code
    let finalCode = code;
    let attempt = 1;
    while (this.classrooms.some((c) => c.code === finalCode)) {
      finalCode = `${code.substring(0, 4)}${attempt++}`;
    }

    const newClass: Classroom = {
      id: `cls-${Date.now()}`,
      name: name.trim() || 'Yeni Sondaj Sınıfı',
      code: finalCode,
      instructorId,
      createdAt: new Date().toISOString()
    };

    this.classrooms.push(newClass);
    this.persistClasses();
    return newClass;
  }

  async getClassroomByCode(code: string): Promise<Classroom | null> {
    await this.ensureInitialized();
    const clean = code.trim().toUpperCase();
    return this.classrooms.find((c) => c.code.toUpperCase() === clean) || null;
  }

  async getStudentsByClassCode(classCode: string): Promise<UserAccount[]> {
    await this.ensureInitialized();
    const clean = classCode.trim().toUpperCase();
    return this.users.filter((u) => u.role === 'student' && u.classCode?.toUpperCase() === clean);
  }

  async addStudentByInstructor(instructorId: string, classCode: string, fullName: string): Promise<{ student: UserAccount; tempPassword: string }> {
    await this.ensureInitialized();
    const cleanClassCode = classCode.trim().toUpperCase();
    const classroom = this.classrooms.find((c) => c.code.toUpperCase() === cleanClassCode);
    if (!classroom) {
      throw new Error('ERR_INVALID_CLASS_CODE');
    }

    // Auto-generate username and temp password
    const baseSlug = slugifyUsername(fullName);
    let candidateUsername = baseSlug;
    let suffix = 1;
    while (this.users.some((u) => u.username.toLowerCase() === candidateUsername.toLowerCase())) {
      candidateUsername = `${baseSlug}${suffix++}`;
    }

    const tempPassword = generateTempPassword();
    const salt = generateSalt();
    const passwordHash = await hashPassword(tempPassword, salt);

    const student: UserAccount = {
      id: `std-${Date.now()}`,
      username: candidateUsername,
      passwordHash,
      salt,
      fullName: fullName.trim(),
      role: 'student',
      classCode: classroom.code,
      studentNumber: `PETRO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      email: `${candidateUsername}@petrosim.edu`,
      createdAt: new Date().toISOString(),
      plainTempPassword: tempPassword // Visible to instructor so they can copy and hand to the student
    };

    this.users.push(student);
    this.persistUsers();

    return { student, tempPassword };
  }

  async removeStudent(studentId: string): Promise<boolean> {
    await this.ensureInitialized();
    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== studentId);
    if (this.users.length !== initialLen) {
      this.persistUsers();
      return true;
    }
    return false;
  }

  async migrateLegacyUserData(): Promise<void> {
    await this.ensureInitialized();
    // Legacy migration check: ensure submissions with studentId 'std-1' or 'std-2'
    // are preserved and any submission that stored studentName only has a mapped studentId
    try {
      const submissionsKey = 'petrosim_submissions';
      const stored = localStorage.getItem(submissionsKey);
      if (stored) {
        const subs = JSON.parse(stored);
        let changed = false;
        for (const sub of subs) {
          if (!sub.studentId) {
            // Find by name or default
            const match = this.users.find((u) => u.fullName.toLowerCase() === (sub.studentName || '').toLowerCase());
            sub.studentId = match ? match.id : 'std-1';
            changed = true;
          }
        }
        if (changed) {
          localStorage.setItem(submissionsKey, JSON.stringify(subs));
        }
      }
    } catch {
      // ignore
    }
  }
}
