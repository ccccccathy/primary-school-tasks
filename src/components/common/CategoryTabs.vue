<template>
  <el-tabs
    v-model="activeCategory"
    tab-position="left"
    class="category-tabs"
    type="border-card"
  >
    <el-tab-pane
      v-for="category in categories"
      :key="category"
      :label="category"
      :name="category"
    >
      <slot :category="category"></slot>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  categories: string[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const activeCategory = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
.category-tabs {
  background: linear-gradient(135deg, #FFF3E0, #FFFFFF);
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(255, 167, 38, 0.2);
  overflow: hidden;
  border: none;
}

.category-tabs :deep(.el-tabs__header.is-left) {
  margin-right: 0;
  background: linear-gradient(180deg, #FFE0B2, #FFE0B2);
  min-width: 160px;
  padding: 24px 0;
  border-radius: 24px;
  margin: 12px 0 12px 12px;
}

.category-tabs :deep(.el-tabs__nav-wrap.is-left) {
  margin-right: 0;
}

.category-tabs :deep(.el-tabs__item) {
  height: 70px;
  line-height: 70px;
  font-size: 24px;
  color: #FF6D00;
  font-weight: bold;
  text-align: center;
  padding: 0 28px;
  margin: 8px 16px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.category-tabs :deep(.el-tabs__item:hover) {
  background: rgba(255, 167, 38, 0.2);
  transform: scale(1.05);
}

.category-tabs :deep(.el-tabs__item.is-active) {
  background: white;
  color: #FF6D00;
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
}

.category-tabs :deep(.el-tabs__active-bar.is-left) {
  display: none;
}
</style> 