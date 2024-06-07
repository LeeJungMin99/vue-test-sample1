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
              <PageLink
                linkName="Ticket Details"
                path="/ticket"
                :id="ticket.id"
              />
              <div class="px-6 mt-1"><TrashIcon /></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-14">
      <PageLink linkName="Add New Ticket" path="/" />
    </div>
  </div>
</template>

<script setup>
import { useTicketsStore } from "@/stores/TicketStore";
import PageLink from "./common/PageLink.vue";
import TrashIcon from "../components/common/TrashIcon.vue";

const store = useTicketsStore();
console.log("🚀 ~ store in list=========:", store.tickets);
</script>
