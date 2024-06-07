<template>
  <main>
    <div class="flex flex-col min-h-screen bg-blue-100 items-center pt-10">
      <div class="flex flex-col space-y-3 w-3/5">
        <RouterView />
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterView } from "vue-router";
</script>
