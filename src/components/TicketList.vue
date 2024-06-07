<template>
  <div class="px-2">
    <div>
      <ul v-if="store.tickets.length">
        <li class="mb-4" v-for="ticket in store.tickets" :key="ticket.subject">
          <div class="flex flex-row justify-between">
            <div>
              <span class="font-bold">{{ ticket.id }}</span
              >{{}} {{ ticket.category }} - {{ ticket.subject }}
            </div>
            <div class="flex flex-row">
              <a
                href="#"
                class="text-sm font-bold"
                @click.prevent="goToDetails(ticket.id)"
                >Ticket Details</a
              >
              <div class="px-6 mt-1"><TrashIcon /></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-14">
      <a
        href="#"
        class="text-md font-bold underline"
        @click.prevent="goToHomePage"
        >Add New Ticket</a
      >
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useTicketsStore } from "@/stores/TicketStore";
import TrashIcon from "../components/common/TrashIcon.vue";

const router = useRouter();
const goToHomePage = () => {
  router.push("/");
};
const goToDetails = (id) => {
  router.push(`/ticket/${id}`);
};

const store = useTicketsStore();
console.log("🚀 ~ store in list=========:", store.tickets);
</script>
