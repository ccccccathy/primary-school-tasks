import type { WeeklyTasks, Task, TaskTemplate } from '../types/types';
import { taskTemplates } from '../config/taskTemplates';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

// 定义学期时间范围
const SEMESTER = {
  start: '2025-02-13',
  end: '2025-07-06',
  firstWeekDays: 4, // 第一周的天数
};

const STORAGE_KEY = 'weekly_tasks';

class TaskDatabase {
  private tasks: Record<string, WeeklyTasks>;
  private currentWeekIndex: number = 0;
  private weekStartDates: string[] = [];

  constructor() {
    this.tasks = this.loadTasks();
    this.initializeWeekDates();
  }

  private initializeWeekDates() {
    const startDate = dayjs(SEMESTER.start);
    const endDate = dayjs(SEMESTER.end);
    let currentDate = startDate;
    
    // 添加第一周（2025-02-13 到 2025-02-16）
    this.weekStartDates.push(startDate.format('YYYY-MM-DD'));
    currentDate = dayjs('2025-02-17'); // 第二周开始日期

    // 添加后续周的开始日期
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      this.weekStartDates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(7, 'day');
    }
  }

  private loadTasks(): Record<string, WeeklyTasks> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading tasks:', error);
      return {};
    }
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  private isDateInSemester(date: dayjs.Dayjs): boolean {
    return date.isBetween(SEMESTER.start, SEMESTER.end, 'day', '[]');
  }

  private getWeekEndDate(startDate: string): string {
    // 如果是第一周
    if (startDate === SEMESTER.start) {
      return '2025-02-16';
    }
    // 其他周
    return dayjs(startDate).add(6, 'day').format('YYYY-MM-DD');
  }

  async getCurrentWeek(): Promise<WeeklyTasks> {
    const now = dayjs();
    if (!this.isDateInSemester(now)) {
      return this.getWeekByDate(dayjs(SEMESTER.start));
    }
    
    // 找到当前日期所属的周
    const weekStartDate = this.weekStartDates.find(date => {
      const endDate = this.getWeekEndDate(date);
      return now.isBetween(date, endDate, 'day', '[]');
    }) || SEMESTER.start;
    
    this.currentWeekIndex = this.weekStartDates.indexOf(weekStartDate);
    return this.getWeekByDate(dayjs(weekStartDate));
  }

  private getWeekByDate(date: dayjs.Dayjs): WeeklyTasks {
    const weekId = date.format('YYYY-MM-DD');
    let week = this.tasks[weekId];
    
    if (!week) {
      week = this.createNewWeek(weekId);
      this.tasks[weekId] = week;
      this.saveTasks();
    }
    
    return week;
  }

  private createNewWeek(weekId: string): WeeklyTasks {
    const isFirstWeek = weekId === SEMESTER.start;
    const daysInWeek = isFirstWeek ? SEMESTER.firstWeekDays : 7;
    
    // 初始化每天的任务
    const tasks: Record<string, Task[]> = {};
    for (let day = 1; day <= daysInWeek; day++) {
      // 为每天创建新的任务实例
      tasks[day] = taskTemplates.map(template => ({
        ...template,
        id: uuidv4(),  // 使用 UUID 生成唯一ID
        completed: false
      }));
    }

    const weekNumber = this.weekStartDates.indexOf(weekId) + 1;
    const newWeek: WeeklyTasks = {
      weekId,
      startDate: weekId,
      endDate: this.getWeekEndDate(weekId),
      weekNumber,
      tasks,
      totalPoints: 0,
      earnedPoints: 0
    };

    return newWeek;
  }

  async updateWeek(week: WeeklyTasks): Promise<void> {
    try {
      // 更新内存中的任务数据
      this.tasks[week.weekId] = {
        ...week,
        tasks: { ...week.tasks }  // 创建任务对象的深拷贝
      };
      
      // 保存到 localStorage
      this.saveTasks();
    } catch (error) {
      console.error('Error updating week:', error);
      throw new Error('Failed to update week data');
    }
  }

  async getWeekHistory(): Promise<WeeklyTasks[]> {
    const currentWeekId = dayjs().format('YYYY-MM-DD');
    return Object.values(this.tasks)
      .filter(week => week.weekId < currentWeekId)
      .sort((a, b) => b.weekId.localeCompare(a.weekId));
  }

  async switchWeek(offset: number): Promise<WeeklyTasks | null> {
    const targetIndex = this.currentWeekIndex + offset;
    
    // 检查是否超出范围
    if (targetIndex < 0 || targetIndex >= this.weekStartDates.length) {
      return null;
    }
    
    this.currentWeekIndex = targetIndex;
    const targetDate = this.weekStartDates[targetIndex];
    return this.getWeekByDate(dayjs(targetDate));
  }

  // 获取总周数
  getTotalWeeks(): number {
    return this.weekStartDates.length;
  }

  // 获取当前是第几周
  getCurrentWeekNumber(): number {
    return this.currentWeekIndex + 1;
  }
}

export const db = new TaskDatabase(); 