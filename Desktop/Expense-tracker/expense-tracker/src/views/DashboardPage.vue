<template>
  <v-container>
    <!-- Add Button -->
    <v-btn @click="toggleFormVisibility" color="primary">
      {{ showForm ? 'Close Form' : 'Add New Expense' }}
    </v-btn>

    <!-- Search and Category Filter -->
    <v-text-field v-model="search" label="Search"></v-text-field>
    <v-select
      v-model="selectedCategory"
      :items="categories"
      label="Category"
    ></v-select>

    <!-- Expense Table -->
    <ExpenseTable
      :expenses="filteredExpenses"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      @update:current-page="updateCurrentPage"
      @delete-expense="deleteExpense"
      @edit-expense="editExpense"
    ></ExpenseTable>

    <!-- Expense Form Modal -->
    <v-dialog v-model="showForm" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingExpense ? 'Edit Expense' : 'Add New Expense' }}</span>
        </v-card-title>
        <v-card-text>
          <ExpenseForm
            :editingExpense="editingExpense"
            @add-expense="fetchExpenses"
            @reset-edit="resetEditing"
          ></ExpenseForm>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="toggleFormVisibility">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ExpenseTable from '@/components/ExpenseTable.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';
import axios from 'axios';

const expenses = ref([]);
const search = ref('');
const selectedCategory = ref('');
const showForm = ref(false);
const editingExpense = ref(null); // Holds the expense being edited
const currentPage = ref(1);
const itemsPerPage = ref(4);
const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Others'];

// Toggle visibility of the form
const toggleFormVisibility = () => {
  showForm.value = !showForm.value;
};

// Filtered expenses based on search and category
const filteredExpenses = computed(() => {
  return expenses.value.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = selectedCategory.value ? expense.category === selectedCategory.value : true;
    return matchesSearch && matchesCategory;
  });
});

// Fetch expenses from the API
const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get('http://127.0.0.1:3333/expenses', {
      params: {
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: search.value,
        category: selectedCategory.value,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    expenses.value = response.data.expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
};

// Handle expense deletion
const deleteExpense = async (expense) => {
  try {
    const token = localStorage.getItem('jwtToken');
    await axios.delete(`http://127.0.0.1:3333/expenses/${expense.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExpenses();
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
};

// Handle expense editing
const editExpense = (expense) => {
  editingExpense.value = { ...expense }; // Clone the expense to avoid direct mutation
  toggleFormVisibility(); // Open the form modal
};

// Reset editing mode
const resetEditing = () => {
  editingExpense.value = null; // Reset editing expense
  toggleFormVisibility(); // Close the form modal
};


onMounted(fetchExpenses);
</script>
