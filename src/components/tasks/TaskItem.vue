<template>
  <div class="task-row">
    <div class="task-column">
      <div class="task-name">{{ task.name }}</div>
      <div v-if="task.note" class="task-note">{{ task.note }}</div>
    </div>
    <div class="points-column">
      <div class="points-circle">
        {{ task.points }}
      </div>
    </div>
    <div class="time-column">
      <span class="task-time" v-if="task.timeRequired">{{ task.timeRequired }}</span>
      <span class="task-time" v-else>-</span>
    </div>
    <div v-for="day in weekDays" 
         :key="day.value"
         class="day-column"
    >
      <div :class="['checkbox', { completed: isTaskCompleted(day.value) }]"
           @click="handleClick(day.value)"
      >
        <el-icon v-if="isTaskCompleted(day.value)" 
                 class="check-icon" 
                 :size="20"
                 @click.stop="handleUncheck(day.value)"
        >
          <Select />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Select } from '@element-plus/icons-vue';
import type { Task } from '@/types/task';

interface WeekDay {
  label: string;
  value: string;
}

const props = defineProps<{
  task: Task;
  weekDays: WeekDay[];
  completedDays: string[];
}>();

const emit = defineEmits<{
  (e: 'toggle-task', day: string, taskId: string, isCompleting: boolean): void;
}>();

const handleClick = (day: string) => {
  if (!isTaskCompleted(day)) {
    emit('toggle-task', day, props.task.id, true);
  }
};

const handleUncheck = (day: string) => {
  emit('toggle-task', day, props.task.id, false);
};

const isTaskCompleted = (day: string) => {
  return props.completedDays.includes(day);
};
</script>

<style scoped>
.task-row {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr repeat(7, 1fr);
  border-bottom: 2px solid #FFE0B2;
  min-height: 80px;
  transition: all 0.3s ease;
}

.task-row:hover {
  background-color: #FFF8E1;
}

.task-name {
  font-size: 1.2em;
  color: #FF6D00;
  padding: 0 16px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.task-name:hover {
  transform: scale(1.05);
}
.task-note{
  font-size: 0.9em;
  color: #558B2F;
  padding: 0 16px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.task-time {
  color: #558B2F;
  font-size: 1em;
}

.points-circle {
  background: linear-gradient(135deg, #FF6D00, #FFB74D);
  color: white;
  font-weight: bold;
  font-size: 1em;
  padding: 4px 10px;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(255, 109, 0, 0.3);
  transition: all 0.3s ease;
}

.points-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(255, 109, 0, 0.4);
}

.checkbox {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid #FFB74D;
  background: white;
}

.checkbox:hover {
  transform: scale(1.1);
  border-color: #FF9800;
  box-shadow: 0 2px 6px rgba(255, 152, 0, 0.3);
}

.checkbox.completed {
  background-color: #FF9800;
  transform: scale(1.05);
  border-color: #FF9800;
}

.check-icon {
  color: white;
  font-size: 20px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.task-column, .points-column, .time-column, .day-column {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 2px solid #A5D6A7;
  text-align: center;
}
</style> 