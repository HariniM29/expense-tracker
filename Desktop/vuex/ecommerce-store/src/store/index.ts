import Vue from 'vue'
import Vuex from 'vuex'
import { Product,RootState,CartItem } from './types'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products:[],
    cart:[],
    user:null
  },
  getters: {
    allProducts(state:RootState){
      return state.products

    },
    cartItems(state:RootState){
      return state.cart

    },
    cartTotal(state:RootState){
      return state.cart.reduce((total,item)=>total+ item.price * item.quantity,0)

    },
    user(state: RootState) {
      return state.user; // Expose user as a getter
    },
  },
  mutations: {
    SET_PRODUCTS(state:RootState,payload:Product[]){
      state.products=payload

    },
    ADD_TO_CART(state:RootState,payload:CartItem){
      const existingItem=state.cart.find(p=>p.id===payload.id)
      if(existingItem){
        existingItem.quantity +=payload.quantity
      }
      else{
        state.cart.push(payload)
      }
      localStorage.setItem('cart',JSON.stringify(state.cart))



    },
    SET_CART(state: RootState, cart: CartItem[]) {
      state.cart = cart;
    },
    SET_USER(state:RootState,user:string | null){
      state.user=user;
      if(user){
        localStorage.setItem('user',user)
      }
      else{
        localStorage.removeItem('user')
      }
    }
  },
  actions: {
    fetchProducts({commit}){
      const products: Product[] = [
        { id: 1, name: 'Laptop', price: 1000 },
        { id: 2, name: 'Phone', price: 500 },
        { id: 3, name: 'Headphones', price: 100 },
      ];
      commit('SET_PRODUCTS',products)

    },
    addToCart({commit},payload){
      commit('ADD_TO_CART',payload)

    },
    loadCartFromStorage({ commit }) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        commit('SET_CART', JSON.parse(savedCart));
      }
    },
    loadUserFromStorage({commit}){
      const savedUser=localStorage.getItem('user')
      if(savedUser){
        commit('SET_USER',savedUser)
      }
    }

  },
  modules: {
  }
})
