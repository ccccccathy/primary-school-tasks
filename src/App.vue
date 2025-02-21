<template>
  <div class="app-container">
    <el-config-provider :locale="zhCn">
      <header class="header">
        <div class="header-content">
          <!-- 顶部周导航 -->
          <WeekNavigation
            :week-number="currentWeek?.weekNumber || 1"
            :start-date="currentWeek?.startDate || ''"
            :end-date="currentWeek?.endDate || ''"
            @switch-week="switchWeek"
          />
          
          <!-- 统计信息区域 -->
          <div class="stats-grid">
            <!-- 本周得分 -->
            <div class="stats-item weekly-score">
              <ScoreDisplay :earned-points="earnedPoints" />
            </div>
            
            <!-- 总分和段位 -->
            <div class="stats-item rank-info">
              <div class="total-points">
                <span class="label">总积分</span>
                <span class="value">{{ totalPoints }}</span>
              </div>
              <div class="rank-display">
                <span class="label">当前段位</span>
                <div class="rank-badge">
                  <span class="rank-name">{{ getRankName(totalPoints) }}</span>
                  <span class="rank-icon">{{ getRankEmoji(totalPoints) }}</span>
                </div>
                <RankGuide />
              </div>
            </div>

            <!-- 激励卡片 -->
            <div class="stats-item motivation">
              <MotivationCard :completion-percentage="completionPercentage" />
            </div>
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

      <div v-if="showCelebration" class="custom-celebration-overlay">
        <div class="custom-celebration-modal">
          <div class="celebration-content">
            <div class="star-icon">⭐</div>
            <h2>太棒了！</h2>
            <p>继续加油哦！</p>
          </div>
        </div>
      </div>

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
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// Components
import WeekNavigation from './components/layout/WeekNavigation.vue';
import ScoreDisplay from './components/score/ScoreDisplay.vue';
import MotivationCard from './components/score/MotivationCard.vue';
import CategoryTabs from './components/common/CategoryTabs.vue';
import TaskList from './components/tasks/TaskList.vue';
import GrowthLevel from './components/score/GrowthLevel.vue';
import RankGuide from './components/score/RankGuide.vue';

// 导入成长体系
import { getCurrentRank } from './config/growth-system';

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

const totalPoints = computed(() => {
  return store.getAllWeeksPoints();
});

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

const toggleTask = async (day: string, taskId: string, isCompleting: boolean) => {
  await store.toggleTask(day, taskId);
  // 只有在完成任务时才显示庆祝动画
  if (isCompleting) {
    showCelebration.value = true;
    setTimeout(() => {
      showCelebration.value = false;
    }, 1500);
  }
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

// 修改获取段位名称的函数
const getRankName = (points: number) => {
  const rank = getCurrentRank(points);
  return rank.name;
}

// 修改获取段位表情的函数
const getRankEmoji = (points: number) => {
  const rank = getCurrentRank(points);
  return rank.icon;
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
  padding: 24px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.stats-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.stats-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.total-points, .rank-display {
  text-align: center;
  color: white;
  margin-bottom: 12px;
}

.label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.value {
  font-size: 36px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
}

.rank-name {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.rank-icon {
  font-size: 28px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-item {
    padding: 16px;
  }
}

.custom-celebration-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.custom-celebration-modal {
  padding: 32px;
  text-align: center;
  animation: zoomIn 0.5s ease-out;
}

.celebration-content {
  padding: 32px;
  text-align: center;
  color: white;
  background: linear-gradient(135deg, #4CAF50, #2196F3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 300px;
}

.star-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 1s infinite;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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