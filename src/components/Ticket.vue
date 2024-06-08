<template>
  <div class="flex flex-row">
    <div class="mb-4 px-2 w-full">
      <label class="block mb-2 text-sm">Category</label>
      <p class="px-4 py-1">{{ ticket.category }}</p>
    </div>
    <div class="mb-4 px-2 w-full">
      <label class="block mb-2 text-sm">Type</label>
      <ul v-if="ticket.selectedItems.length">
        <div class="flex flex-row">
          <li class="py-1" v-for="item in ticket.selectedItems" :key="item">
            <span
              class="text-sm mr-2 text-green-900 bg-blue-200 py-1 px-2 rounded-lg font-bold"
              >{{ item }}</span
            >
          </li>
        </div>
      </ul>
    </div>
  </div>
  <div class="mb-4 px-2 py-2 w-full">
    <label for="text" class="text-sm">Subject</label>
    <p class="mt-2 px-4">{{ ticket.subject }}</p>
  </div>
  <div class="mb-4 px-2 py-2 w-full">
    <label for="text" class="text-sm">Description</label>
    <p class="mt-2 px-4">{{ ticket.description }}</p>
  </div>
  <div class="mb-4 px-2 py-2 w-full flex flex-col">
    <div class="mb-4">
      <label for="text" class="text-sm py-4">Ticket Files & Documents</label>
    </div>
    <div class="mb-4 w-full">
      <ul v-if="ticket.addedFiles.length">
        <li v-for="file in ticket.addedFiles" :key="file.name">
          <div class="flex flex-row">
            <div>
              <span class="text-sm text-blue-900">{{ file.name }}</span>
            </div>
            <div class="px-6 mt-1"><TrashIcon /></div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="px-2 py-1">
    <PageLink linkName="All Tickets" path="/ticketlist" />
  </div>
  <div class="px-2 py-4">
    <PageLink linkName="Add New Ticket" path="/" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useTicketsStore } from "@/stores/TicketStore";
import PageLink from "./common/PageLink.vue";
import TrashIcon from "./common/TrashIcon.vue";

const route = useRoute();
const store = useTicketsStore();

const ticket = store.tickets.find((ticket) => ticket.id == route.params.id);
console.log("🚀 ~ ticket:", ticket);
</script>
