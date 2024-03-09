<template>
  <a-table :columns="columns" :dataSource="dataSource" :pagination="false" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ heap: Record<string, number> }>();

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const dataSource = computed(() =>
  Object.entries(props.heap).map(([name, value]) => ({
    key: name,
    name,
    value,
  }))
);
</script>
