<template>
  <a-flex class="toolbar" align="center" :gap="8">
    <a-typography-title :level="4" :style="{ margin: 0 }">
      GOTO lang
    </a-typography-title>
    <a-button type="primary" @click="emit('run')">Run</a-button>
    <a-button @click="emit('runStep')">Run Step</a-button>
    <a-button @click="emit('reset')">Reset</a-button>
    <a-button @click="emit('stop')">Stop</a-button>
    <a-button @click="emit('share')">Share</a-button>
    <a-input
      v-model:value="timeout"
      placeholder="Exectution timeout in ms"
      type="number"
      class="timeout"
    />
  </a-flex>
</template>
<script setup lang="ts">
const emit = defineEmits(["run", "reset", "runStep", "stop", "share"]);

const timeout = defineModel("timeout");
</script>

<style scoped>
.toolbar {
  padding: 4px 8px;
}

.timeout {
  max-width: 200px;
}
</style>
