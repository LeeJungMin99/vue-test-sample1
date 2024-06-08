import { defineStore } from "pinia";
import { ref } from "vue";

export const useTicketsStore = defineStore("ticketsStore", () => {
  const tickets = ref([]);

  const addNewTicket = (newTicket) => tickets.value.push(newTicket);

  const removeTicket = (id) => {
    tickets.value = tickets.value.filter((ticket) => ticket.id !== id);
  };

  return { tickets, addNewTicket, removeTicket };
});
