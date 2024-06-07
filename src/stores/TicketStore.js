import { defineStore } from "pinia";
import { ref } from "vue";

export const useTicketsStore = defineStore("ticketsStore", () => {
  const tickets = ref([]);

  const addNewTicket = (newTicket) => tickets.value.push(newTicket);

  return { tickets, addNewTicket };
});
