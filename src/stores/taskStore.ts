import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task, WeeklyTasks } from "../types/types";
import { db } from "../services/db";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const useTaskStore = defineStore("tasks", () => {
  const currentWeek = ref<WeeklyTasks | null>(null);
  const history = ref<WeeklyTasks[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadData = async () => {
    try {
      isLoading.value = true;
      currentWeek.value = await db.getCurrentWeek();
      history.value = await db.getWeekHistory();
      calculatePoints();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Unknown error occurred";
    } finally {
      isLoading.value = false;
    }
  };

  const toggleTask = async (dayIndex: string, taskId: string) => {
    if (!currentWeek.value || !currentWeek.value.tasks[dayIndex]) return;

    // 在当天的任务列表中找到对应的任务
    const taskToToggle = currentWeek.value.tasks[dayIndex].find((task) => {
      // 通过类别和名称匹配任务
      const templateTask = currentWeek.value?.tasks["1"].find(
        (t) => t.id === taskId
      );
      return (
        task.category === templateTask?.category &&
        task.name === templateTask?.name
      );
    });

    if (!taskToToggle) return;

    // 切换任务状态
    taskToToggle.completed = !taskToToggle.completed;

    // 重新计算分数
    calculatePoints();

    // 保存到数据库
    try {
      await db.updateWeek(currentWeek.value);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to save data";
    }
  };

  const calculatePoints = () => {
    if (!currentWeek.value) return;

    let total = 0;
    let earned = 0;

    const tasks = currentWeek.value.tasks;
    for (const dayIndex in tasks) {
      const dayTasks = tasks[dayIndex] as Task[];
      for (const task of dayTasks) {
        total += task.points;
        if (task.completed) {
          earned += task.points;
        }
      }
    }

    currentWeek.value.totalPoints = total;
    currentWeek.value.earnedPoints = earned;
  };

  const completionPercentage = computed(() => {
    if (!currentWeek.value || currentWeek.value.totalPoints === 0) return 0;
    return Math.round(
      (currentWeek.value.earnedPoints / currentWeek.value.totalPoints) * 100
    );
  });

  const switchWeek = async (offset: number) => {
    try {
      isLoading.value = true;
      const week = await db.switchWeek(offset);
      if (week) {
        currentWeek.value = week;
        calculatePoints();
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to switch week";
    } finally {
      isLoading.value = false;
    }
  };

  const getAllWeeksPoints = (): number => {
    // 从本地存储获取所有周的数据
    const allWeeks = history.value.reduce(
      (total, week) => total + (week.earnedPoints || 0),
      0
    );
    return allWeeks;
  };

  return {
    currentWeek,
    history,
    isLoading,
    error,
    loadData,
    toggleTask,
    completionPercentage,
    switchWeek,
    getAllWeeksPoints,
  };
});
