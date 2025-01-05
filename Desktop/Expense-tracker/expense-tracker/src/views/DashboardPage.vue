<template>
  <v-btn @click="toggleFormVisibility" color="primary">
    {{ showForm ? 'Close Form' : 'Add New Expense' }}
  </v-btn>

  <v-text-field v-model="search" label="Search" @input="updateSearch"></v-text-field>
  
  <!-- Category Filter -->
  <v-select
    v-model="selectedCategory"
    :items="categories"
    label="Category"
    @change="updateCategory"  
  ></v-select>

  <ExpenseTable
    :expenses="filteredExpenses"  
    :current-page="currentPage"
    :items-per-page="itemsPerPage"
    @update:current-page="updateCurrentPage"
    @delete-expense="deleteExpense"
    @edit-expense="editExpense"
  ></ExpenseTable>

  <ExpenseForm
    v-if="showForm"
    @add-expense="fetchExpenses"
    :editing-expense="editingExpense"
    @reset-edit="resetEditing"
  ></ExpenseForm>

  <div v-if="errorMessage" style="color: red;">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" style="color: green;">
    {{ successMessage }}
  </div>
  <div>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import ExpenseTable from '@/components/ExpenseTable.vue';
import ExpenseForm from '@/components/ExpenseForm.vue';

const router = useRouter();
const expenses = ref([]);
const errorMessage = ref('');
const successMessage = ref('');
const showForm = ref(false);
const editingExpense = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(4);
const search = ref('');
const selectedCategory = ref('');
const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Others'];

const updateSearch = () => {
  fetchExpenses();  // Re-fetch when search term changes
};

const updateCategory = () => {
  fetchExpenses();  // Re-fetch when category changes
};

const toggleFormVisibility = () => {
  showForm.value = !showForm.value;
};

// Computed property to filter expenses based on category and search
const filteredExpenses = computed(() => {
  return expenses.value.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(search.value.toLowerCase()) || 
                          expense.category.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = selectedCategory.value ? expense.category === selectedCategory.value : true;
    
    return matchesSearch && matchesCategory;
  });
});

const fetchExpenses = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      errorMessage.value = 'User not authenticated.';
      return;
    }

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
    errorMessage.value = 'Failed to load expenses.';
  }
};

const deleteExpense = async (expense) => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      errorMessage.value = 'User not authenticated.';
      return;
    }

    await axios.delete(`http://127.0.0.1:3333/expenses/${expense.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    successMessage.value = 'Expense deleted successfully.';
    fetchExpenses(); // Refresh the expenses list
  } catch (error) {
    console.error('Error deleting expense:', error);
    errorMessage.value = 'Failed to delete expense.';
  }
};

const editExpense = (expense) => {
  editingExpense.value = expense;
  showForm.value = true;
};

const resetEditing = () => {
  editingExpense.value = null;
  showForm.value = false;
};

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      errorMessage.value = 'Already logged out.';
      return;
    }

    await axios.post(
      'http://127.0.0.1:3333/api/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.removeItem('jwtToken');
    successMessage.value = 'Logged out successfully.';
    router.push('/login-page');
  } catch (error) {
    console.error('Error during logout:', error);
    errorMessage.value = 'Failed to log out.';
  }
};

const updateCurrentPage = (newPage) => {
  currentPage.value = newPage;
};

// Watch for changes in `currentPage` and refetch expenses
watch(currentPage, fetchExpenses);

onMounted(fetchExpenses);
</script>
