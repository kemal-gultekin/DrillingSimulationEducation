import { IQuizRepository, QuizQuestionItem } from '../types';
import { SAFETY_QUESTIONS } from '../../data/safety';

const QUIZ_STORAGE_KEY = 'petrosim_quizzes';

export class LocalStorageQuizRepository implements IQuizRepository {
  private getStorageData(): QuizQuestionItem[] {
    try {
      const data = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }

    // Initialize with seeded safety questions
    const initial: QuizQuestionItem[] = SAFETY_QUESTIONS.map((q) => ({
      id: q.id,
      category: q.category,
      title: q.title,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      equipmentFocusId: q.equipmentFocusId,
      difficulty: q.difficulty,
      regulationRef: q.regulationRef,
      status: 'published',
      points: 10
    }));

    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  }

  private saveStorageData(items: QuizQuestionItem[]): void {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  async getAll(): Promise<QuizQuestionItem[]> {
    return this.getStorageData();
  }

  async getById(id: string): Promise<QuizQuestionItem | null> {
    const items = this.getStorageData();
    return items.find((q) => q.id === id) || null;
  }

  async create(question: Omit<QuizQuestionItem, 'id'>): Promise<QuizQuestionItem> {
    const items = this.getStorageData();
    const created: QuizQuestionItem = {
      ...question,
      id: `quiz-${Date.now()}`
    };
    items.unshift(created);
    this.saveStorageData(items);
    return created;
  }

  async update(id: string, updates: Partial<QuizQuestionItem>): Promise<QuizQuestionItem> {
    const items = this.getStorageData();
    const index = items.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`Quiz with id ${id} not found`);
    }
    const updated = { ...items[index], ...updates };
    items[index] = updated;
    this.saveStorageData(items);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const items = this.getStorageData();
    const filtered = items.filter((q) => q.id !== id);
    if (filtered.length === items.length) {
      return false;
    }
    this.saveStorageData(filtered);
    return true;
  }
}
