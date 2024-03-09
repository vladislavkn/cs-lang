<template>
  <div>
    <a-flex vertical :gap="8" class="statList">
      <StatItem label="Line number" :value="props.state.lineIndex + 1" />
      <StatItem label="Status" :value="props.state.status" />
      <StatItem label="Error" :value="props.state.errorMessage" />
    </a-flex>
    <Heap :heap="state.heap" />
  </div>
</template>

<script setup lang="ts">
import StatItem from "./StatItem.vue";
import InterpreterState from "../interpreter/InterpreterState";
import Heap from "./Heap.vue";

const props = defineProps<{ state: InterpreterState }>();
</script>

<style>
.statList {
  width: 320px;
  padding: 0 0.5rem;
  margin-bottom: 1rem;
}
</style>
