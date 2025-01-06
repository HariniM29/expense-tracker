<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field 
      label="Amount" 
      type="number" 
      v-model="amount" 
      required
    ></v-text-field>
    
    <v-text-field 
      label="Description" 
      v-model="description" 
    ></v-text-field>

    <v-select
      :items="['Food', 'Transport', 'Entertainment', 'Utilities', 'Others']"
      label="Category"
      v-model="category"
      required
    ></v-select>

    <v-date-picker v-model="date" label="Select a date" required></v-date-picker>

    <v-btn type="submit" color="primary">
      {{ formMode === 'edit' ? 'Update' : 'Add' }} Expense
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';
import axios from 'axios';

const emit = defineEmits(['add-expense', 'reset-edit']);
const props = defineProps({
  editingExpense: { type: Object, required: false },
});

const amount = ref('');
const description = ref('');
const category = ref('');
const date = ref<Date | null>(null);
const formMode = ref<'add' | 'edit'>('add');

// Watch for changes in the `editingExpense` prop
watch(
  () => props.editingExpense,
  (newValue) => {
    if (newValue) {
      // Populate form fields when editing an existing expense
      amount.value = newValue.amount;
      description.value = newValue.description;
      category.value = newValue.category;
      date.value = newValue.date ? new Date(newValue.date) : null;
      formMode.value = 'edit';  // Set form mode to 'edit'
    } else {
      // Reset form if no expense is being edited
      resetForm();
    }
  },
  { immediate: true } // This ensures it runs on mount as well
);

// Reset form to initial state
const resetForm = () => {
  amount.value = '';
  description.value = '';
  category.value = '';
  date.value = null;
  formMode.value = 'add';  // Reset form mode to 'add'
  emit('reset-edit');
};

// Handle form submission (add or update)
const handleSubmit = async () => {
  if (!amount.value || !description.value || !category.value) {
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

    console.log('Expense submitted:', response);
    emit('add-expense'); // Update the expense list
    resetForm(); // Reset form after submission
  } catch (error) {
    console.error('Error submitting the form:', error);
  }
};
</script>
