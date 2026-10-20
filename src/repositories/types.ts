import { LocalizedString, OptionalLocalizedString } from '../i18n/types';
import { StudentProgressState } from '../types';

export interface QuizQuestionItem {
  id: string;
  category: string;
  title: LocalizedString | OptionalLocalizedString | string;
  question: LocalizedString | OptionalLocalizedString | string;
  options: { tr: string[]; en: string[] } | string[];
  correctIndex: number;
  explanation: LocalizedString | OptionalLocalizedString | string;
  equipmentFocusId?: string;
  difficulty: 'Temel' | 'Orta' | 'İleri' | 'Basic' | 'Intermediate' | 'Advanced';
  regulationRef?: string;
  status?: 'draft' | 'published';
  points?: number;
}

export interface AssignmentItem {
  id: string;
  title: LocalizedString | OptionalLocalizedString | string;
  dueDate: string;
  description: LocalizedString | OptionalLocalizedString | string;
  requiredScenarios: string[];
  targetScore: number;
  maxScore?: number;
  enrolledStudentsCount: number;
  submissionRate: number;
  linkedScenarioId?: string;
  linkedEquipmentId?: string;
}

export interface SubmissionItem {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  status: 'pending' | 'graded';
  teacherFeedback?: string;
  details?: Record<string, any>;
}

export interface IQuizRepository {
  getAll(): Promise<QuizQuestionItem[]>;
  getById(id: string): Promise<QuizQuestionItem | null>;
  create(question: Omit<QuizQuestionItem, 'id'>): Promise<QuizQuestionItem>;
  update(id: string, question: Partial<QuizQuestionItem>): Promise<QuizQuestionItem>;
  delete(id: string): Promise<boolean>;
}

export interface IAssignmentRepository {
  getAll(): Promise<AssignmentItem[]>;
  getById(id: string): Promise<AssignmentItem | null>;
  create(assignment: Omit<AssignmentItem, 'id'>): Promise<AssignmentItem>;
  update(id: string, assignment: Partial<AssignmentItem>): Promise<AssignmentItem>;
  delete(id: string): Promise<boolean>;
}

export interface ISubmissionRepository {
  getAll(): Promise<SubmissionItem[]>;
  getByStudentId(studentId: string): Promise<SubmissionItem[]>;
  getByAssignmentId(assignmentId: string): Promise<SubmissionItem[]>;
  create(submission: Omit<SubmissionItem, 'id'>): Promise<SubmissionItem>;
  grade(submissionId: string, score: number, feedback?: string): Promise<SubmissionItem>;
}

export interface IStudentProgressRepository {
  getProgress(): Promise<StudentProgressState>;
  saveProgress(progress: StudentProgressState): Promise<void>;
  resetProgress(): Promise<StudentProgressState>;
}

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: 'student' | 'instructor';
  studentNumber?: string;
  title?: string;
  classCode?: string;
  createdAt: string;
  plainTempPassword?: string;
}

export interface Classroom {
  id: string;
  name: string;
  code: string; // 6-character unique class code e.g. "PET101"
  instructorId: string;
  createdAt: string;
}

export interface IAuthRepository {
  login(username: string, password: string): Promise<UserAccount>;
  registerInstructor(data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    title?: string;
  }): Promise<UserAccount>;
  registerStudent(data: {
    fullName: string;
    username: string;
    password: string;
    classCode: string;
    studentNumber?: string;
  }): Promise<UserAccount>;
  getCurrentUser(): Promise<UserAccount | null>;
  logout(): Promise<void>;
  getClassroomsByInstructor(instructorId: string): Promise<Classroom[]>;
  createClassroom(instructorId: string, name: string, customCode?: string): Promise<Classroom>;
  getClassroomByCode(code: string): Promise<Classroom | null>;
  getStudentsByClassCode(classCode: string): Promise<UserAccount[]>;
  addStudentByInstructor(instructorId: string, classCode: string, fullName: string): Promise<{ student: UserAccount; tempPassword: string }>;
  removeStudent(studentId: string): Promise<boolean>;
  migrateLegacyUserData(): Promise<void>;
}

