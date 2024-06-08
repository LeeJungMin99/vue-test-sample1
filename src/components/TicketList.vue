<template>
  <div class="px-2 w-full">
    <div>
      <ul class="w-full" v-if="store.tickets.length">
        <li
          class="mb-4 w-full"
          v-for="ticket in store.tickets"
          :key="ticket.subject"
        >
          <div class="flex flex-row justify-between">
            <div class="w-full">
              <span>Id: {{ ticket.id }}</span>
              {{}}
              <span class="font-bold"
                >{{
                  categoryData.find((el) => el.value === ticket.category).text
                }}
              </span>
              <p>{{ ticket.subject }}</p>
            </div>
            <div class="w-full flex flex-row justify-end">
              <PageLink
                class="mt-3"
                linkName="Ticket Details"
                path="/ticket"
                :id="ticket.id"
              />
              <button class="px-2" @click="handleDelete(ticket.id)">
                <TrashIcon />
              </button>
            </div>
            <div class="mt-1"></div>
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
import TrashIcon from "./common/TrashIcon.vue";
import { categoryData } from "../constants/data";

const store = useTicketsStore();

const handleDelete = (id) => {
  store.removeTicket(id);
};
</script>
