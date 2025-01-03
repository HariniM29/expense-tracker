<template>
    <v-btn @click="toggleFormVisibility" color="primary">
      {{ showForm ? 'Close Form' : 'Add New Expense' }}
    </v-btn>
    <ExpenseTable :expenses="expenses" @delete-expense="deleteExpense" @edit-expense="editExpense"></ExpenseTable>
    <ExpenseForm
      v-if="showForm"
      @add-expense="fetchExpenses"
      :editing-expense="editingExpense"
      @reset-edit="resetEditing"
    ></ExpenseForm>
    <!-- <ExpenseForm  v-if="showForm"
  :editingExpense="editingExpense"
  :formMode="formMode"
  @add-expense="fetchExpenses"
/> -->

  
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
  import { ref, onMounted } from 'vue';
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
  
  const toggleFormVisibility = () => {
    showForm.value = !showForm.value;
  };
  
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        errorMessage.value = 'User not authenticated.';
        return;
      }
  
      const response = await axios.get('http://127.0.0.1:3333/expenses', {
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
    console.log('Deleting expense:', expense); // Debugging log
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
    console.log('Editing expense:', expense);
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
  
  onMounted(fetchExpenses);
  </script>
  