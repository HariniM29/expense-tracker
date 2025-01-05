import {createRouter,createWebHistory} from 'vue-router'

const routes=[
    { path: '/', redirect: '/login-page' },
    {path:'/login-page',component:()=> import('@/views/LoginPage.vue')},
    {path:'/register-page',component:()=>import('@/views/RegisterPage.vue')},
    {
        path:'/dashboard-page',
        component:()=>import('@/views/DashboardPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path:'/expense-table',
        component:()=>import('@/components/ExpenseTable.vue'),
        meta: { requiresAuth: true } 
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('jwtToken') !== null; // Check if the user is authenticated
  
    // If the route requires authentication and the user is not authenticated, redirect to login
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login-page');
    } else {
      next(); // Allow navigation to the route
    }
  });
  
export default router