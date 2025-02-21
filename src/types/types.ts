export interface Task {
  id: string;
  category: '生活' | '学习';
  name: string;
  timeRequired: string;
  points: number;
  completed: boolean;
}

export interface WeeklyTasks {
  weekId: string;  // Format: YYYY-WW
  startDate: string;
  endDate: string;
  weekNumber: number;  // 添加周数属性
  tasks: Record<string, Task[]>;  // Key is the day of week (1-7)
  totalPoints: number;
  earnedPoints: number;
}

export interface TaskTemplate {
  category: '生活' | '学习';
  name: string;
  note: string;
  timeRequired: string;
  points: number;
}

export interface UserProgress {
  currentWeek: WeeklyTasks;
  history: WeeklyTasks[];
  lastSync: string;
} 