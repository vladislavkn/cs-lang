<template>
  <a-flex :gap="8" justify="space-between" align="center">
    <a-typography-text>{{ props.label }}</a-typography-text>
    <a-typography-text code>{{ props.value ?? "NULL" }}</a-typography-text>
  </a-flex>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; value?: string | number }>();
</script>
