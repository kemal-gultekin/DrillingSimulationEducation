import { LocalStorageQuizRepository } from './localStorage/LocalStorageQuizRepository';
import { LocalStorageAssignmentRepository } from './localStorage/LocalStorageAssignmentRepository';
import { LocalStorageSubmissionRepository } from './localStorage/LocalStorageSubmissionRepository';
import { LocalStorageProgressRepository } from './localStorage/LocalStorageProgressRepository';
import { LocalStorageAuthRepository } from './localStorage/LocalStorageAuthRepository';

export * from './types';
export * from './localStorage/LocalStorageQuizRepository';
export * from './localStorage/LocalStorageAssignmentRepository';
export * from './localStorage/LocalStorageSubmissionRepository';
export * from './localStorage/LocalStorageProgressRepository';
export * from './localStorage/LocalStorageAuthRepository';

// Singleton service instances adhering to interfaces
export const authRepository = new LocalStorageAuthRepository();
export const quizRepository = new LocalStorageQuizRepository();
export const assignmentRepository = new LocalStorageAssignmentRepository();
export const submissionRepository = new LocalStorageSubmissionRepository();
export const progressRepository = new LocalStorageProgressRepository();

