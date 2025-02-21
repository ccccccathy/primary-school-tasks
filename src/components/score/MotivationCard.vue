<template>
  <div class="motivation-card" v-if="showMotivation">
    <div class="character-nezha" :class="{ 'high-score': completionPercentage >= 60 }">
      <el-icon class="nezha-icon"><Avatar /></el-icon>
      <div class="fire-rings">
        <div class="ring"></div>
        <div class="ring"></div>
      </div>
    </div>
    <div class="character-aobing" :class="{ 'show': completionPercentage >= 80 }">
      <el-icon class="aobing-icon"><UserFilled /></el-icon>
      <div class="water-effect"></div>
    </div>
    <div class="motivation-text">
      {{ motivationText }}
      <div class="stars">
        <el-icon class="star" v-for="i in 3" :key="i"><Star /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Star, Avatar, UserFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  completionPercentage: number;
}>();

const showMotivation = computed(() => {
  return props.completionPercentage >= 0;
});

const motivationText = computed(() => {
  const percentage = props.completionPercentage;
  if (percentage >= 80) return '太棒了！你真是个小天才！🌟 继续保持这样的热情，你一定会成为最闪亮的星星！';
  if (percentage >= 70) return '哇！真了不起！💫 你的努力大家都看到了，继续加油，成功就在前方！';
  if (percentage >= 60) return '好样的！你做得很棒！🌈 坚持就是胜利，你已经证明了自己的能力！';
  if (percentage >= 50) return '不错哦！继续加油！🌞 你的进步大家都看在眼里，再接再厉！';
  if (percentage >= 40) return '有进步！这就对了！🎯 保持这个势头，你会越来越好的！';
  if (percentage >= 30) return '加油！你可以的！🌱 每完成一个任务都是一个小进步，积少成多！'; 
  if (percentage >= 20) return '这是一个好的开始！📚 相信自己，一步一个脚印，慢慢来！';
  if (percentage >= 1) return '开始行动就是胜利！🎈  勇敢迈出第一步，你已经超过了很多人！';
  return '准备好开始新的挑战了吗？🌟 相信你一定能做到！';
});
</script>

<style scoped>
.motivation-card {
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  padding: 24px 32px;
  border-radius: 16px;
  min-width: 280px;
  box-shadow: 0 4px 20px rgba(26, 35, 126, 0.4);
  position: relative;
  overflow: hidden;
}

.motivation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 50%, rgba(255, 87, 34, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 50%, rgba(3, 169, 244, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

.character-nezha {
  position: absolute;
  left: -10px;
  bottom: -10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0.8);
  transition: all 0.5s ease;
}

.nezha-icon {
  font-size: 40px;
  color: #ff5722;
  filter: drop-shadow(0 0 10px rgba(255, 87, 34, 0.5));
}

.fire-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #ff5722;
  border-radius: 50%;
  animation: fireRing 2s ease-in-out infinite;
}

.ring:nth-child(2) {
  width: 50px;
  height: 50px;
  animation-delay: -1s;
}

.character-nezha.high-score {
  transform: scale(1.2);
  animation: nezhaFloat 3s ease-in-out infinite;
}

.character-aobing {
  position: absolute;
  right: -10px;
  bottom: -10px;
  transform: scale(0.8) translateX(100%);
  transition: all 0.5s ease;
  opacity: 0;
}

.aobing-icon {
  font-size: 40px;
  color: #03a9f4;
  filter: drop-shadow(0 0 10px rgba(3, 169, 244, 0.5));
}

.water-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(3, 169, 244, 0.2) 0%, transparent 70%);
  animation: waterPulse 2s ease-in-out infinite;
}

.character-aobing.show {
  transform: scale(1) translateX(0);
  opacity: 1;
  animation: aobingFloat 3s ease-in-out infinite;
}

.motivation-text {
  font-size: 1.4em;
  color: white;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0 60px;
  position: relative;
  z-index: 1;
}

.stars {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.star {
  font-size: 24px;
  color: #ffd700;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
  animation: starTwinkle 1.5s ease-in-out infinite;
}

@keyframes fireRing {
  0% { transform: scale(0.8) rotate(0deg); opacity: 0.8; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.4; }
  100% { transform: scale(0.8) rotate(360deg); opacity: 0.8; }
}

@keyframes waterPulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
}

@keyframes nezhaFloat {
  0%, 100% { transform: scale(1.2) translateY(0) rotate(-5deg); }
  50% { transform: scale(1.2) translateY(-10px) rotate(5deg); }
}

@keyframes aobingFloat {
  0%, 100% { transform: translateY(0) rotate(5deg); }
  50% { transform: translateY(-10px) rotate(-5deg); }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style> 