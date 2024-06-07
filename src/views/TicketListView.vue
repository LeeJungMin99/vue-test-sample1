<template>
  <Header title="All Tickets" />
  <TicketList />
</template>

<script setup>
import Header from "@/components/Header.vue";
import TicketList from "../components/TicketList.vue";
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
