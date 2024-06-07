<template>
  <div class="w-full">
    <h2 class="text-lg font-bold mb-4 px-2">{{ title }}</h2>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
  },
});
</script>
