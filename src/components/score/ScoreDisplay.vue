<template>
  <div class="score-display">
    <div class="score-circle">
      <div class="score">{{ earnedPoints }}</div>
      <div class="label">本周得分</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  earnedPoints: number;
}>();
</script>

<style scoped>
.score-display {
  background: linear-gradient(135deg, #00C853, #69F0AE);
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 200, 83, 0.2);
  text-align: center;
}

.score-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score {
  font-size: 3em;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1;
}

.label {
  font-size: 1.2em;
  color: white;
  margin-top: 8px;
}
</style> 