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

      <div class="data-operations">
        <button class="import-btn" @click="importData">
          <i class="fas fa-file-import"></i> 导入数据
        </button>
        <button class="export-btn" @click="exportData">
          <i class="fas fa-file-export"></i> 导出数据
        </button>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept=".json"
          @change="handleFileImport"
        >
      </div>
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

const fileInput = ref<HTMLInputElement | null>(null)

// 导出数据
const exportData = () => {
  if (!currentWeek.value) {
    alert('暂无数据可导出')
    return
  }
  
  const data = JSON.stringify({
    currentWeek: currentWeek.value,
    // 如果还有其他需要导出的store数据，可以在这里添加
  })
  
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `weekly-tasks-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 触发文件选择
const importData = () => {
  fileInput.value?.click()
}

// 处理文件导入
const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      // 将导入的数据更新到store中
      store.$patch(data)
      window.location.reload() // 刷新页面以加载新数据
    } catch (error) {
      alert('导入失败，请确保文件格式正确')
    }
  }
  reader.readAsText(file)
  
  // 清除文件选择，以便下次选择同一文件时也能触发事件
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

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

.celebration-dialog :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(3px);
}

.celebration-dialog :deep(.el-overlay-dialog) {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
}

.celebration-dialog :deep(.el-dialog) {
  margin: 0 !important;
  background: none !important;
  box-shadow: none !important;
  width: fit-content !important;
  position: relative !important;
}

.celebration-dialog :deep(.el-dialog__header),
.celebration-dialog :deep(.el-dialog__body),
.celebration-dialog :deep(.el-dialog__footer),
.celebration-dialog :deep(.el-dialog__content) {
  all: unset !important;
  padding: 0 !important;
  margin: 0 !important;
  background: none !important;
  box-shadow: none !important;
}

.celebration-content {
  padding: 32px;
  text-align: center;
  animation: zoomIn 0.5s ease-out;
  color: white;
  background: linear-gradient(135deg, #4CAF50, #2196F3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 300px;
}

.celebration-icon {
  font-size: 64px;
  color: #FFD700;
  margin-bottom: 16px;
  animation: bounce 1s infinite;
}

.celebration-content h2 {
  color: white;
  font-size: 28px;
  margin: 16px 0 8px;
  font-weight: bold;
}

.celebration-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin: 0;
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

@keyframes spinAndGlow {
  0% {
    transform: rotate(0deg);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.8));
  }
  100% {
    transform: rotate(360deg);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.5));
  }
}

@keyframes pulseText {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes floatText {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes glowingBorder {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
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

.data-operations {
  margin-top: 2rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.import-btn,
.export-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.import-btn {
  background-color: #4CAF50;
  color: white;
}

.export-btn {
  background-color: #2196F3;
  color: white;
}

.import-btn:hover,
.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.import-btn:active,
.export-btn:active {
  transform: translateY(0);
}
</style> 