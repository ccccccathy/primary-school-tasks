<template>
  <div class="week-table">
    <div class="week-header">
      <div class="task-column">任务</div>
      <div class="points-column">分值</div>
      <div class="time-column">完成时间</div>
      <div v-for="day in weekDays" 
           :key="day.value" 
           class="day-column"
      >
        <span class="day-label">{{ day.label }}</span>
        <el-badge
          :value="getDayCompletionPoints(day.value)"
          type="success"
          class="task-badge"
        />
      </div>
    </div>
    
    <div class="tasks-list">
      <div class="task-rows">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :week-days="weekDays"
          :completed-days="getCompletedDaysForTask(task.id)"
          @toggle-task="(day, taskId, isCompleting) => $emit('toggle-task', day, taskId, isCompleting)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TaskItem from './TaskItem.vue';
import type { Task, DayTasks } from '@/types/task';

interface WeekDay {
  label: string;
  value: string;
}

const props = defineProps<{
  tasks: Task[];
  weekDays: WeekDay[];
  dayTasks: DayTasks;
}>();

const emit = defineEmits<{
  (e: 'toggle-task', day: string, taskId: string, isCompleting: boolean): void;
}>();

const getDayCompletionPoints = (day: string) => {
  if (!props.dayTasks[day]) return 0;
  
  // 获取当天已完成的任务
  const completedTasks = props.dayTasks[day].filter(task => task.completed);
  
  // 计算已完成任务的总分
  const totalPoints = completedTasks.reduce((total, task) => {
    return total + (task.points || 0);
  }, 0);
  
  return totalPoints;
};

const getDayTotalCount = (day: string) => {
  if (!props.dayTasks[day]) return 0;
  return props.dayTasks[day].length;
};

const getCompletedDaysForTask = (taskId: string) => {
  return Object.entries(props.dayTasks)
    .filter(([day, tasks]) => {
      // 在每天的任务中查找相同类别和名称的任务
      const task = tasks.find(t => 
        t.category === props.tasks.find(pt => pt.id === taskId)?.category &&
        t.name === props.tasks.find(pt => pt.id === taskId)?.name
      );
      return task?.completed;
    })
    .map(([day]) => day);
};
</script>

<style scoped>
.week-table {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}


.week-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr repeat(7, 1fr);
  background: linear-gradient(90deg, rgba(255, 87, 34, 0.2), rgba(3, 169, 244, 0.2));
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: bold;
  color: #0d47a1;
  font-size: 1.2em;
  padding: 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.task-column, .points-column, .time-column, .day-column {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.task-badge {
  position: relative;
}

.task-badge::after {
  /* content: '⚡';
  position: absolute;
  right: -15px;
  top: -5px;
  font-size: 12px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(255, 87, 34, 0.5)); */
}

.task-badge:not(:empty)::after {
  opacity: 1;
  transform: scale(1);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.2); filter: brightness(1.2); }
}

.task-badge :deep(.el-badge__content) {
  background: linear-gradient(135deg, #ff5722, #ff9800);
  font-size: 1.1em;
  padding: 4px 8px;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
}
</style> 