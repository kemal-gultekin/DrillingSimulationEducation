import { ISubmissionRepository, SubmissionItem } from '../types';

const SUBMISSIONS_STORAGE_KEY = 'petrosim_submissions';

export class LocalStorageSubmissionRepository implements ISubmissionRepository {
  private getStorageData(): SubmissionItem[] {
    try {
      const data = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }

    const initial: SubmissionItem[] = [
      {
        id: 'sub-1',
        assignmentId: 'asg-1',
        studentId: 'std-1',
        studentName: 'Kemal Gültekin',
        submittedAt: '2026-09-28T14:20:00Z',
        score: 95,
        maxScore: 100,
        status: 'graded',
        teacherFeedback: 'Mükemmel kill-sheet hesabı ve soft shut-in prosedürü uygulaması.'
      },
      {
        id: 'sub-2',
        assignmentId: 'asg-1',
        studentId: 'std-2',
        studentName: 'Zeynep Kaya',
        submittedAt: '2026-09-29T10:15:00Z',
        score: 85,
        maxScore: 100,
        status: 'graded',
        teacherFeedback: 'KMW hesaplaması doğru, ICP basınç grafiğini tekrar gözden geçirin.'
      }
    ];

    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  }

  private saveStorageData(items: SubmissionItem[]): void {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  async getAll(): Promise<SubmissionItem[]> {
    return this.getStorageData();
  }

  async getByStudentId(studentId: string): Promise<SubmissionItem[]> {
    const items = this.getStorageData();
    return items.filter((s) => s.studentId === studentId);
  }

  async getByAssignmentId(assignmentId: string): Promise<SubmissionItem[]> {
    const items = this.getStorageData();
    return items.filter((s) => s.assignmentId === assignmentId);
  }

  async create(submission: Omit<SubmissionItem, 'id'>): Promise<SubmissionItem> {
    const items = this.getStorageData();
    const created: SubmissionItem = {
      ...submission,
      id: `sub-${Date.now()}`
    };
    items.unshift(created);
    this.saveStorageData(items);
    return created;
  }

  async grade(submissionId: string, score: number, feedback?: string): Promise<SubmissionItem> {
    const items = this.getStorageData();
    const index = items.findIndex((s) => s.id === submissionId);
    if (index === -1) {
      throw new Error(`Submission with id ${submissionId} not found`);
    }
    const updated: SubmissionItem = {
      ...items[index],
      score,
      teacherFeedback: feedback !== undefined ? feedback : items[index].teacherFeedback,
      status: 'graded'
    };
    items[index] = updated;
    this.saveStorageData(items);
    return updated;
  }
}
