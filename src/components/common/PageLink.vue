<template>
  <a href="#" class="text-md font-bold underline" @click.prevent="goToPage">{{
    props.linkName
  }}</a>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  linkName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
});

const router = useRouter();

const goToPage = () => {
  if (props.id !== null && props.id !== undefined) {
    return router.push(`${props.path}/${props.id}`);
  }
  router.push(props.path);
};
</script>
