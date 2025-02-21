export interface Task {
  id: string;
  name: string;
  note: string;
  points: number;
  category: string;
  timeRequired?: string;
  completed: boolean;
}

export interface DayTasks {
  [day: string]: Task[];
}

export interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  tasks: DayTasks;
  earnedPoints: number;
  totalPoints: number;
} 