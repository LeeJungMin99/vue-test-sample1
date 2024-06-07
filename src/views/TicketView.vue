<template>
  <Header title="Ticket Details" />
  <Ticket />
</template>

<script setup>
import Header from "@/components/Header.vue";
import Ticket from "../components/Ticket.vue";
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
