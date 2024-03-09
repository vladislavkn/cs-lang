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
    <div class="spacer" />
    <a
      href="https://github.com/vladislavkn/cs-lang"
      target="_blank"
      class="github"
    >
      <GithubOutlined :style="{ fontSize: '24px' }" /> Check out on GitHub
    </a>
  </a-flex>
</template>

<script setup lang="ts">
import GithubOutlined from "@ant-design/icons-vue/GithubOutlined";
const emit = defineEmits(["run", "reset", "runStep", "stop", "share"]);

const timeout = defineModel("timeout");
</script>

<style scoped>
.toolbar {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid lightgray;
}

.timeout {
  max-width: 200px;
}

.spacer {
  flex: 1 0 auto;
}

.github {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
