import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { LocalStorageSubmissionRepository } from '../localStorage/LocalStorageSubmissionRepository';
import { LocalStorageAssignmentRepository } from '../localStorage/LocalStorageAssignmentRepository';

class LocalStorageMock {
  private store: Record<string, string> = {};
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }
  removeItem(key: string) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

describe('Repository Layer - Submissions & Assignments', () => {
  let subRepo: LocalStorageSubmissionRepository;
  let asgRepo: LocalStorageAssignmentRepository;

  beforeAll(() => {
    (globalThis as any).localStorage = new LocalStorageMock();
  });

  beforeEach(() => {
    localStorage.clear();
    subRepo = new LocalStorageSubmissionRepository();
    asgRepo = new LocalStorageAssignmentRepository();
  });

  it('loads seeded assignments', async () => {
    const list = await asgRepo.getAll();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('title');
  });

  it('creates and grades a submission', async () => {
    const newSub = await subRepo.create({
      assignmentId: 'asg-test-1',
      studentId: 'std-test-1',
      studentName: 'Ali Demir',
      submittedAt: new Date().toISOString(),
      score: 75,
      maxScore: 100,
      status: 'pending'
    });

    expect(newSub.id).toBeDefined();
    expect(newSub.status).toBe('pending');

    const graded = await subRepo.grade(newSub.id, 92, 'Çok başarılı kill-sheet adımları.');
    expect(graded.score).toBe(92);
    expect(graded.status).toBe('graded');
    expect(graded.teacherFeedback).toBe('Çok başarılı kill-sheet adımları.');

    const studentSubs = await subRepo.getByStudentId('std-test-1');
    expect(studentSubs.length).toBe(1);
    expect(studentSubs[0].score).toBe(92);
  });
});
