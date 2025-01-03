<template>
    <v-data-table
      :headers="headers"
      :items="expenses"
      item-value="expense_id"
      :items-per-page="itemsPerPage"
        v-model:page="currentPage"
    >
<template v-slot:[`item.actions`]="{item}">
    <v-btn @click="emitEditExpense(item)">Edit</v-btn>
    <v-btn @click="emitDeleteExpense(item)">Delete</v-btn>

</template>

</v-data-table>
    
  </template>
  
  <script setup>
import { defineProps, defineEmits, ref } from 'vue';
  
const props = defineProps({
  expenses: { type: Array, required: true },
});
const emit = defineEmits(['edit-expense', 'delete-expense']);
const emitEditExpense = (expense) => emit('edit-expense', expense);
const emitDeleteExpense = (id) => emit('delete-expense', id);

  const headers = [
    {title:'id',key:'expense_id'},
    { title: 'Amount', key: 'amount', align: 'end' },
    { title: 'Description', key: 'description', align: 'end' },
    { title: 'Category', key: 'category', align: 'end' },
    { title: 'Date', key: 'date', align: 'end' },
    {title:'Actions',key:'actions',align:'end'}


  ]
  
 
  const currentPage = ref(1);

  
  </script>
  