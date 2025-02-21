<template>
  <div class="app-container">
    <el-config-provider :locale="zhCn">
      <header class="header">
        <div class="header-content">
          <WeekNavigation
            :week-number="currentWeek?.weekNumber || 1"
            :start-date="currentWeek?.startDate || ''"
            :end-date="currentWeek?.endDate || ''"
            @switch-week="switchWeek"
          />

          <div class="score-section">
            <ScoreDisplay :earned-points="earnedPoints" />
            <MotivationCard :completion-percentage="completionPercentage" />
          </div>
        </div>
      </header>

      <main class="main-content">
        <CategoryTabs
          v-model="activeCategory"
          :categories="categories"
        >
          <template #default="{ category }">
            <TaskList
              :tasks="getAllTasksByCategory(category)"
              :week-days="weekDays"
              :day-tasks="currentWeek?.tasks || {}"
              @toggle-task="toggleTask"
            />
          </template>
        </CategoryTabs>
      </main>

      <el-dialog
        v-model="showCelebration"
        :show-close="false"
        :modal="true"
        class="celebration-dialog"
        width="300px"
        align-center
      >
        <div class="celebration-content">
          <el-icon class="celebration-icon"><StarFilled /></el-icon>
          <h2>太棒了！</h2>
          <p>继续加油哦！</p>
        </div>
      </el-dialog>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTaskStore } from './stores/taskStore';
import { storeToRefs } from 'pinia';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { StarFilled } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// Components
import WeekNavigation from './components/layout/WeekNavigation.vue';
import ScoreDisplay from './components/score/ScoreDisplay.vue';
import MotivationCard from './components/score/MotivationCard.vue';
import CategoryTabs from './components/common/CategoryTabs.vue';
import TaskList from './components/tasks/TaskList.vue';

dayjs.locale('zh-cn');

const store = useTaskStore();
const { currentWeek, completionPercentage } = storeToRefs(store);

const showCelebration = ref(false);
const categories = ['生活', '学习'];
const activeCategory = ref('生活');

const weekDays = [
  { label: '周一', value: '1' },
  { label: '周二', value: '2' },
  { label: '周三', value: '3' },
  { label: '周四', value: '4' },
  { label: '周五', value: '5' },
  { label: '周六', value: '6' },
  { label: '周日', value: '7' },
];

const earnedPoints = computed(() => currentWeek.value?.earnedPoints || 0);

const getAllTasksByCategory = (category: string) => {
  if (!currentWeek.value) return [];
  
  // 获取当前周的所有任务
  const allDayTasks = currentWeek.value.tasks;
  
  // 获取任意一天的任务作为模板
  const anyDay = Object.keys(allDayTasks)[0];
  if (!anyDay) return [];
  
  // 获取该类别的任务模板
  const categoryTasks = allDayTasks[anyDay].filter(task => task.category === category);
  
  // 为每个任务创建一个副本，保持原始ID
  return categoryTasks.map(task => ({
    ...task,
    completed: false // 重置完成状态，由 getCompletedDaysForTask 来控制显示
  }));
};

const toggleTask = async (day: string, taskId: string) => {
  await store.toggleTask(day, taskId);
  showCelebration.value = true;
  setTimeout(() => {
    showCelebration.value = false;
  }, 1500);
};

const switchWeek = async (offset: number) => {
  await store.switchWeek(offset);
};

onMounted(() => {
  store.loadData();
});
</script>

<style scoped>
.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  font-family: "Comic Sans MS", cursive, sans-serif;
  position: relative;
  overflow: hidden;
}

.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 87, 34, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 80% 80%, rgba(3, 169, 244, 0.1) 0%, transparent 30%);
  animation: floatBackground 60s linear infinite;
  pointer-events: none;
}

.header {
  margin-bottom: 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header::after {
  content: '⚡';
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 40px;
  animation: bounce 2s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(255, 87, 34, 0.8);
}

.header-content {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.score-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 16px;
}

.celebration-dialog :deep(.el-dialog) {
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.celebration-dialog :deep(.el-dialog)::before {
  content: '🌊';
  position: absolute;
  right: -10px;
  bottom: -10px;
  font-size: 40px;
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(100%);
  filter: drop-shadow(0 0 10px rgba(3, 169, 244, 0.5));
}

.celebration-content {
  padding: 32px;
  text-align: center;
  animation: zoomIn 0.5s ease-out;
  position: relative;
  color: white;
}

.celebration-content::before {
  content: '🔥';
  position: absolute;
  left: -10px;
  top: 50%;
  font-size: 30px;
  animation: spinAndFloat 3s linear infinite;
  transform-origin: center;
  filter: drop-shadow(0 0 10px rgba(255, 87, 34, 0.5));
}

.celebration-icon {
  font-size: 64px;
  color: #ffd700;
  margin-bottom: 16px;
  animation: spin 2s infinite linear;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
}

.celebration-content h2 {
  color: #ffd700;
  font-size: 28px;
  margin: 16px 0 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.celebration-content p {
  color: #fff;
  font-size: 18px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes floatBackground {
  from { background-position: 0 0; }
  to { background-position: 100% 100%; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes spinAndFloat {
  0% { transform: translateY(-50%) rotate(0deg); }
  50% { transform: translateY(-70%) rotate(180deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .score-section {
    flex-direction: column;
  }
}
</style> 