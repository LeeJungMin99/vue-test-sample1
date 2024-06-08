<template>
  <form id="form" @submit.prevent="handleSubmit">
    <div class="flex flex-row">
      <div class="mb-4 px-2 w-full">
        <label class="block mb-2 text-sm" for="input1">Category</label>
        <select
          class="w-full border px-3 py-1 rounded"
          id="category"
          required
          v-model="formData.category"
        >
          <option v-for="el in categories" :key="el.id" :value="el.value">
            {{ el.text }}
          </option>
        </select>
      </div>
      <div class="mb-4 px-2 w-full">
        <label class="block mb-2 text-sm" for="input1">Type</label>
        <select
          id="items-dropdown"
          multiple="true"
          required
          class="w-full border px-4 py-2 rounded"
          v-model="formData.selectedItems"
          @blur="hideDropdown"
          @focus="showDropdown"
        >
          <option value="" disabled selected></option>
          <option v-for="el in filteredItems" :key="el.id" :value="el.value">
            {{ el.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="mb-4 px-2 w-full">
      <label for="text" class="block mb-2 text-sm">Subject</label>
      <input
        required
        type="text"
        id="subject"
        class="w-full p-1"
        v-model="formData.subject"
      />
    </div>
    <div class="mb-4 px-2 w-full">
      <label for="text" class="block mb-2 text-sm">Description</label>
      <input
        required
        type="text"
        id="description"
        class="w-full p-1"
        v-model="formData.description"
      />
    </div>
    <div class="mb-4 px-2 w-full flex flex-col">
      <div class="mb-4">
        <label for="text" class="text-sm py-4">Ticket Files & Documents</label>
      </div>
      <div class="mb-4 w-full">
        <ul v-if="addedFiles.length">
          <li class="py-1" v-for="file in addedFiles" :key="file.name">
            <div class="flex flex-row">
              <p class="text-sm text-blue-900">{{ file.name }}</p>
              <div class="px-4">
                <button @click="removeFile(file.name)"><TrashIcon /></button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <input
          multiple
          type="file"
          id="file"
          class="block w-full text-sm"
          @change="handleFileChange"
        />
      </div>
    </div>
    <div v-if="errors.length" class="text-red-700 font-bold text-sm">
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </div>
    <div class="py-10 px-2 w-full flex justify-between">
      <div><PageLink linkName="All Tickets" path="/ticketlist" /></div>
      <div>
        <button class="px-2 text-sm" @click="initiateForm">Cancel</button>
        <button
          class="bg-slate-900 text-white text-sm font-bold px-2 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useTicketsStore } from "@/stores/TicketStore";
import { categoryData, itemData } from "../constants/data";
import PageLink from "./common/PageLink.vue";
import TrashIcon from "./common/TrashIcon.vue";

const router = useRouter();
const store = useTicketsStore();

const categories = ref([...categoryData]);
const items = ref([...itemData]);

const formData = ref({
  category: "",
  selectedItems: [],
  subject: "",
  description: "",
  addedFiles: [],
});

const submittedData = ref(null);
const addedFiles = ref([]);
const sequence = ref(0);
const errors = ref([]);

const filteredItems = computed(() => {
  if (!formData.value.category) return items.value;
  return items.value.filter(
    (item) => item.category === formData.value.category
  );
});

const hideDropdown = (e) => {
  e.target.style.overflowY = "hidden";
  e.target.style.height = "32px";
};
const showDropdown = (e) => {
  e.target.style.overflowY = "scroll";
  e.target.style.height = "auto";
};

const handleFileChange = (e) => {
  let files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    let nameInArray = files[i].name.split(".");
    sequence.value++;

    const newName =
      nameInArray[0] + sequence.value.toString() + "." + nameInArray[1];
    addedFiles.value.push({
      ...files[i],
      name: newName,
    });
  }
};

const handleSubmit = () => {
  errors.value = [];
  //validateForm();
  if (errors.value.length > 0) return;

  const id = Math.floor(Math.random() * 1000000);
  console.log("form data", formData.value);

  submittedData.value = {
    ...formData.value,

    addedFiles: [...addedFiles.value],
    id,
  };
  store.addNewTicket({ ...submittedData.value });
  router.push(`/ticket/${id}`);
  initiateForm();
};

const validateForm = () => {
  if (addedFiles.value.length < 1) errors.value.push("File is required");
};

const initiateForm = () => {
  formData.value = {
    category: "",
    selectedItems: [],
    subject: "",
    description: "",
    addedFiles: [],
  };
  sequence.value = 0;
};

const removeFile = (filename) => {
  addedFiles.value = addedFiles.value.filter((file) => file.name !== filename);
};
</script>

<style scoped>
#items-dropdown {
  height: 32px;
  overflow-y: hidden;
}
input::file-selector-button {
  font-weight: bold;
  color: rgb(53, 53, 53);
  padding: 0.5em 3em;
  border: thin solid grey;
  border-radius: 4px;
  background-color: rgb(219 234 254);
  cursor: pointer;
}
</style>
