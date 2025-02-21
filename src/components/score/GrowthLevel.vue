<template>
  <div class="growth-level">
    <div class="rank-card" :style="{ borderColor: currentRank.color }">
      <div class="rank-header">
        <span class="rank-icon">{{ currentRank.icon }}</span>
        <h3 class="rank-name">{{ currentRank.name }}</h3>
      </div>
      
      <div class="rank-title">{{ currentRank.title }}</div>
      
      <div class="rank-progress">
        <el-progress 
          :percentage="rankProgress"
          :color="currentRank.color"
          :format="progressFormat"
          :stroke-width="10"
        />
      </div>
      
      <div class="rank-description">
        {{ currentRank.description }}
      </div>
      
      <div v-if="pointsToNextRank > 0" class="next-rank-info">
        <p>距离下一段位还需要 {{ pointsToNextRank }} 分</p>
      </div>
    </div>
    
    <div class="rank-animation" v-if="showLevelUpAnimation">
      <div class="level-up-effect">
        <span class="level-up-text">升级啦!</span>
        <div class="fireworks"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getCurrentRank, getPointsToNextRank, getRankProgress } from '@/config/growth-system';

const props = defineProps<{
  points: number
}>();

const currentRank = computed(() => getCurrentRank(props.points));
const rankProgress = computed(() => getRankProgress(props.points));
const pointsToNextRank = computed(() => getPointsToNextRank(props.points));

const showLevelUpAnimation = ref(false);

// 监听积分变化,触发升级动画
watch(() => props.points, (newPoints, oldPoints) => {
  const oldRank = getCurrentRank(oldPoints);
  const newRank = getCurrentRank(newPoints);
  
  if (newRank.name !== oldRank.name) {
    showLevelUpAnimation.value = true;
    setTimeout(() => {
      showLevelUpAnimation.value = false;
    }, 3000);
  }
});

const progressFormat = (percentage: number) => {
  return `${props.points}分`;
};
</script>

<style scoped>
.growth-level {
  position: relative;
}

.rank-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.rank-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.rank-icon {
  font-size: 2em;
  animation: floating 2s ease-in-out infinite;
}

.rank-name {
  font-size: 1.5em;
  margin: 0;
  color: white;
}

.rank-title {
  font-size: 1.2em;
  color: #FFD700;
  margin: 10px 0;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

.rank-progress {
  margin: 20px 0;
}

.rank-description {
  color: #E0E0E0;
  font-size: 1em;
  margin: 10px 0;
}

.next-rank-info {
  margin-top: 15px;
  color: #BDBDBD;
  font-size: 0.9em;
}

.level-up-effect {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  text-align: center;
}

.level-up-text {
  font-size: 3em;
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  animation: scaleUp 0.5s ease-out;
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes scaleUp {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.fireworks {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: fireworks 2s ease-out;
}

@keyframes fireworks {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}
</style> 