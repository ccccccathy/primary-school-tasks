<template>
  <div class="week-navigation">
    <div class="nav-button prev-week">
      <el-button 
        type="primary" 
        :icon="ArrowLeft" 
        size="large"
        @click="emit('switch-week', -1)"
      />
    </div>

    <div class="current-week-info">
      <div class="week-number">开学第{{ weekNumber }}周</div>
      <div class="week-date">{{ formatDateRange }}</div>
    </div>

    <div class="nav-button next-week">
      <el-button 
        type="primary" 
        :icon="ArrowRight" 
        size="large"
        @click="emit('switch-week', 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

const props = defineProps<{
  weekNumber: number;
  startDate: string;
  endDate: string;
}>();

const emit = defineEmits<{
  (e: 'switch-week', offset: number): void;
}>();

const formatDateRange = computed(() => {
  const start = dayjs(props.startDate).format('MM月DD日');
  const end = dayjs(props.endDate).format('MM月DD日');
  return `${start} - ${end}`;
});
</script>

<style scoped>
.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  min-width: 500px;
}

.current-week-info {
  padding: 0 15px;
  text-align: center;
  min-width: 300px;
}

.week-number {
  font-size: 3em;
  font-weight: bold;
  color: #FF6D00;
  text-shadow: 3px 3px 0 #FFE0B2;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #FF6D00, #FF9800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transform: scale(1);
  transition: transform 0.3s ease;
  white-space: nowrap;
}

.week-number:hover {
  transform: scale(1.1);
}

.week-date {
  font-size: 1.2em;
  color: #fff;
  text-shadow: 
    1px 1px 3px rgba(0, 0, 0, 0.5),
    -1px -1px 3px rgba(0, 0, 0, 0.3);
}

.nav-button :deep(.el-button) {
  font-size: 2em;
  width: 60px;
  height: 60px;
  padding: 0;
  border-radius: 50%;
  color: #81C784;
  background: white;
  border: 2px solid #81C784;
  transition: all 0.3s ease;
}

.nav-button :deep(.el-button:hover) {
  color: white;
  background: #81C784;
  transform: scale(1.1);
}

.nav-button :deep(.el-button .el-icon) {
  margin: 0;
}
</style> 