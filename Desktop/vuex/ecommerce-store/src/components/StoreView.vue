<template>
  <div>
    <div>
        <h3 v-if="!user">Login</h3>
        <div v-if="!user">
      <input v-model="username" placeholder="Enter username" />
      <button @click="login">Login</button>
    </div>

    <div v-if="user">
      <h3>Welcome, {{ user }}!</h3>
      <button @click="logout">Logout</button>
    </div>
    </div>
    <h3>Products</h3>
    <ul>
        <li v-for="product in allProducts" :key="product.id">
            {{ product.name }} - ${{ product.price }}
            <button @click="addToCart(product)">Add to cart</button>
        </li>
    </ul>

    <h3>Cart</h3>
    <ul>
        <li v-for="item in cartItems" :key="item.id">
            {{ item.name }} x {{ item.quantity }} = ${{ item.price * item.quantity  }}

        </li>
    </ul>
    <p>Total : ${{ cartTotal }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
    return {
      username: ''
    };
  },
    computed:{
        ...mapGetters(['allProducts', 'cartItems', 'cartTotal','user'])
    },
    methods:{
        login() {
      this.$store.commit('SET_USER', this.username);
      this.username = ''; 
    },
    logout() {
      this.$store.commit('SET_USER', null);
    },
        addToCart(product){
            this.$store.dispatch('addToCart', { ...product, quantity: 1 })
        }
        
    },
    created(){
        this.$store.dispatch('fetchProducts'),
        this.$store.dispatch('loadCartFromStorage'),
        this.$store.dispatch('loadUserFromStorage');

    }
}
</script>

<style>

</style>