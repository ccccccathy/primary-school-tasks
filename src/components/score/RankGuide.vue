<template>
  <div class="rank-guide">
    <!-- 触发按钮 -->
    <el-button 
      class="guide-trigger" 
      type="text"
      @click="dialogVisible = true"
    >
      <i class="fas fa-question-circle"></i> 查看段位说明
    </el-button>

    <!-- 段位说明弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="成长段位说明"
      width="95%"
      :modal="true"
      :close-on-click-modal="true"
      :show-close="true"
      class="rank-dialog"
      top="2vh"
      :lock-scroll="true"
      :destroy-on-close="false"
      :append-to-body="true"
    >
      <div class="dialog-content">
        <div class="ranks-container">
          <div 
            v-for="rank in ranks" 
            :key="rank.name"
            class="rank-item"
            :class="{ 'current-rank': isCurrentRank(rank) }"
          >
            <div class="rank-header">
              <span class="rank-icon">{{ rank.icon }}</span>
              <span class="rank-name">{{ rank.name }}</span>
            </div>
            <div class="rank-points">
              需要积分：{{ rank.minPoints }} - {{ rank.maxPoints || '∞' }}
            </div>
            <div class="rank-description">
              {{ rank.description }}
            </div>
          </div>
        </div>
        
        <div class="tips-section">
          <h3>🌈 小贴士</h3>
          <ul>
            <li>每完成一项任务都能获得相应的积分</li>
            <li>积分会持续累计，帮助你提升段位</li>
            <li>每个段位都有特殊的表情标志</li>
            <li>努力完成任务，解锁更高段位吧！</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ranks } from '@/config/growth-system'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const dialogVisible = ref(false)

const currentPoints = computed(() => {
  return store.getAllWeeksPoints()
})

const isCurrentRank = (rank: typeof ranks[0]) => {
  const points = currentPoints.value
  return points >= rank.minPoints && (!rank.maxPoints || points < rank.maxPoints)
}
</script>

<style scoped>
.rank-guide {
  display: inline-block;
  margin-top: 8px;
}

.guide-trigger {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.guide-trigger:hover {
  color: white;
  transform: scale(1.05);
}

.dialog-content {
  padding: 24px;
  height: 88vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.ranks-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 0;
  margin-bottom: 24px;
}

.rank-item {
  background: linear-gradient(145deg, #f3f4f6, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.rank-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.current-rank {
  border-color: #4CAF50;
  background: linear-gradient(145deg, #E8F5E9, #ffffff);
  position: relative;
}

.current-rank::after {
  content: '当前段位';
  position: absolute;
  top: -10px;
  right: -10px;
  background: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.rank-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.rank-icon {
  font-size: 32px;
}

.rank-name {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  background: linear-gradient(120deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rank-points {
  color: #666;
  font-size: 16px;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  display: inline-block;
}

.rank-description {
  color: #4a5568;
  font-size: 16px;
  line-height: 1.6;
}

.tips-section {
  margin-top: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  border-radius: 16px;
}

.tips-section h3 {
  color: #1976D2;
  margin-bottom: 16px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-section ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.tips-section li {
  color: #1565C0;
  padding-left: 24px;
  position: relative;
  font-size: 16px;
}

.tips-section li::before {
  content: "✨";
  position: absolute;
  left: 0;
}

:deep(.el-dialog) {
  margin: 0 auto !important;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  max-width: 1400px;
  height: 92vh;
  display: flex;
  flex-direction: column;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 16px 24px;
  margin: 0;
  flex-shrink: 0;
}

:deep(.el-dialog__body) {
  padding: 0;
  flex: 1;
  overflow: hidden;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
}

:deep(.el-dialog__headerbtn) {
  top: 16px;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 1.2rem;
}

.dialog-content::-webkit-scrollbar {
  width: 8px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 768px) {
  .dialog-content {
    height: 85vh;
    padding: 16px;
  }

  :deep(.el-dialog) {
    height: 90vh;
    margin: 5vh auto !important;
  }

  .ranks-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .rank-item {
    padding: 16px;
  }

  .rank-name {
    font-size: 18px;
  }

  .rank-icon {
    font-size: 24px;
  }

  .tips-section {
    margin-top: 24px;
    padding: 16px;
  }
}
</style> 