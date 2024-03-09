<template>
  <Toolbar
    @run="run"
    @reset="reset"
    @stop="stop"
    @run-step="runStep"
    @share="shareCode"
    v-model:timeout="runTimeout"
  />
  <a-flex class="container">
    <CodeTextarea v-model="code" :line-index="state.lineIndex" />
    <StatList :state="state" />
  </a-flex>
</template>

<script setup lang="ts">
import CodeTextarea from "./components/CodeTextarea.vue";
import Toolbar from "./components/Toolbar.vue";
import useInterpreter from "./composables/useInterpreter";
import StatList from "./components/StatList.vue";
import useCodeWithSharing from "./composables/useCodeWithSharing";

const { code, shareCode } = useCodeWithSharing();
const { run, reset, stop, runStep, state, runTimeout } = useInterpreter(code);
</script>

<style>
body {
  margin: 0;
}

.container {
  border-bottom: 1px solid lightgray;
}
</style>
