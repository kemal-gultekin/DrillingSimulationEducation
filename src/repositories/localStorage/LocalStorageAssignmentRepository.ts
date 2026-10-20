import { IAssignmentRepository, AssignmentItem } from '../types';
import { MOCK_ASSIGNMENTS } from '../../data/instructor';

const ASSIGNMENTS_STORAGE_KEY = 'petrosim_assignments';

export class LocalStorageAssignmentRepository implements IAssignmentRepository {
  private getStorageData(): AssignmentItem[] {
    try {
      const data = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }

    // Seed from MOCK_ASSIGNMENTS
    const initial: AssignmentItem[] = MOCK_ASSIGNMENTS.map((asg) => ({
      id: asg.id,
      title: asg.title,
      dueDate: asg.dueDate,
      description: asg.description,
      requiredScenarios: asg.requiredScenarios,
      targetScore: asg.targetScore,
      maxScore: 100,
      enrolledStudentsCount: asg.enrolledStudentsCount,
      submissionRate: asg.submissionRate
    }));

    try {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  }

  private saveStorageData(items: AssignmentItem[]): void {
    try {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  async getAll(): Promise<AssignmentItem[]> {
    return this.getStorageData();
  }

  async getById(id: string): Promise<AssignmentItem | null> {
    const items = this.getStorageData();
    return items.find((a) => a.id === id) || null;
  }

  async create(assignment: Omit<AssignmentItem, 'id'>): Promise<AssignmentItem> {
    const items = this.getStorageData();
    const created: AssignmentItem = {
      ...assignment,
      id: `asg-${Date.now()}`
    };
    items.unshift(created);
    this.saveStorageData(items);
    return created;
  }

  async update(id: string, updates: Partial<AssignmentItem>): Promise<AssignmentItem> {
    const items = this.getStorageData();
    const index = items.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Assignment with id ${id} not found`);
    }
    const updated = { ...items[index], ...updates };
    items[index] = updated;
    this.saveStorageData(items);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const items = this.getStorageData();
    const filtered = items.filter((a) => a.id !== id);
    if (filtered.length === items.length) {
      return false;
    }
    this.saveStorageData(filtered);
    return true;
  }
}
