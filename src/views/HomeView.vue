<script setup>
import TicketForm from "../components/TicketForm.vue";
import Header from "@/components/Header.vue";
// import { ref } from "vue";
// import { categoryData, itemData } from "../constants/data";
// const categories = ref([...categoryData]);
// const items = ref([...itemData]);
</script>

<template>
  <Header title="Ticket Details" />
  <!-- <TicketForm :categories="categories" :items="items" /> -->
  <TicketForm />
</template>
