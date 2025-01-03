<template>
    <v-form @submit.prevent="handleSubmit">
      <v-text-field label="Amount" type="number" v-model="amount" required></v-text-field>
      <v-text-field label="Description" v-model="description"></v-text-field>
  
      <v-select
        :items="['Food', 'Transport', 'Entertainment', 'Utilities', 'Others']"
        label="Category"
        v-model="category"
        required
      ></v-select>
  
      <v-date-input v-model="date" label="Select a date" max-width="368"></v-date-input>
  
      <v-btn type="submit" color="primary">
        {{ formMode === 'edit' ? 'Update' : 'Add' }} Expense
      </v-btn>
    </v-form>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineEmits, defineProps } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const emit = defineEmits(['add-expense', 'reset-edit']);
  const props = defineProps({
    editingExpense: { type: Object, required: false },
  });

  console.log('Editing Expense:', props.editingExpense); 
  
  const amount = ref('');
  const description = ref('');
  const category = ref('');
  const date = ref<Date | null>(null);
  const formMode = ref<'add' | 'edit'>('add');
  
  watch(
    () => props.editingExpense,
    (newValue) => {
        console.log('Props changed:', newValue); 
      if (newValue) {
        amount.value = newValue.amount;
        description.value = newValue.description;
        category.value = newValue.category;
        date.value = newValue.date ? new Date(newValue.date) : null;
        formMode.value = 'edit';
      } else {
        resetForm();
      }
    }
  );
  
  const resetForm = () => {
    amount.value = '';
    description.value = '';
    category.value = '';
    date.value = null;
    formMode.value = 'add';
    emit('reset-edit');
  };
  
  const handleSubmit = async () => {
  if (!amount.value || !description.value || !category.value || !date.value) {
    console.log('Please fill in all fields.');
    return;
  }

  const expenseData = {
    amount: amount.value,
    description: description.value,
    category: category.value,
    date: date.value?.toISOString().split('T')[0], // format date to ISO string
  };

  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('User not authenticated.');
      return;
    }

    const expenseId = props.editingExpense?.expense_id;
    const url =
      formMode.value === 'edit'
        ? `http://127.0.0.1:3333/expenses/${expenseId}`
        : 'http://127.0.0.1:3333/expenses';
    const method = formMode.value === 'edit' ? 'patch' : 'post';

    const response = await axios[method](url, expenseData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Update response:', response); // Add logging here to check the response
    emit('add-expense');
    resetForm();
  } catch (error) {
    console.error('Error submitting the form:', error);
  }
};

  </script>
  