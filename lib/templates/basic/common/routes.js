import Home from '../views/Home'
import Contact from '../views/Contact'

export const mainRoutes = [
  { path: '/', component: Home, exact: true, nav: 'home' },
  // 新增母酒店
  { path: '/contact', component: Contact, nav: 'contact' }
]
