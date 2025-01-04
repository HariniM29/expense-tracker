<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="expenses"
      :items-per-page="itemsPerPage"
      v-model:page="internalPage"
      :server-items-length="totalItems"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn @click="emitEditExpense(item)">Edit</v-btn>
        <v-btn @click="emitDeleteExpense(item)">Delete</v-btn>
      </template>
    </v-data-table>

    <!-- Only one pagination component here -->
    <!-- <v-pagination
      v-model="internalPage"
      :length="pageCount"
      :show-first-last-page="true"
      @input="emitPageUpdate"
    ></v-pagination> -->
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';

const props = defineProps({
  expenses: { type: Array, required: true },
  currentPage: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
});

const emit = defineEmits(['edit-expense', 'delete-expense', 'update:current-page']);
const internalPage = ref(props.currentPage);

watch(
  () => props.currentPage,
  (newValue) => {
    internalPage.value = newValue;
  }
);

const pageCount = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const emitPageUpdate = (newPage) => {
  emit('update:current-page', newPage);
};

const emitEditExpense = (expense) => emit('edit-expense', expense);
const emitDeleteExpense = (expense) => emit('delete-expense', expense);

const headers = [
  { title: 'ID', key: 'expense_id' },
  { title: 'Amount', key: 'amount', align: 'end' },
  { title: 'Description', key: 'description', align: 'end' },
  { title: 'Category', key: 'category', align: 'end' },
  { title: 'Date', key: 'date', align: 'end' },
  { title: 'Actions', key: 'actions', align: 'end' },
];
</script>
