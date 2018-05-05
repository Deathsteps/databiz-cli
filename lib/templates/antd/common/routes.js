import Home from '../views/Home'
import Contact from '../views/Contact'
import Login from '../views/User/Login'

export const mainRoutes = [
  { path: '/', component: Home, exact: true, nav: 'home' },
  // 新增母酒店
  { path: '/contact', component: Contact, nav: 'contact' }
]

export const userRoutes = [
  { path: '/user/login', component: Login },
  // { path: '/user/register', component: Register },
  // { path: '/user/register-result', component: RegisterResult }
]
