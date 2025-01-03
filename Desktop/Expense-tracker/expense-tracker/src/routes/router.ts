import {createRouter,createWebHistory} from 'vue-router'

const routes=[
    { path: '/', redirect: '/login-page' },
    {path:'/login-page',component:()=> import('@/views/LoginPage.vue')},
    {path:'/register-page',component:()=>import('@/views/RegisterPage.vue')},
    {path:'/dashboard-page',component:()=>import('@/views/DashboardPage.vue')},
    {path:'/expense-table',component:()=>import('@/components/ExpenseTable.vue')}
]

const router=createRouter({
    history:createWebHistory(),
    routes,
});
export default router