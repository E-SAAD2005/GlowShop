import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { Layout } from './components/Layout'
import { useAuthStore } from './store/authStore'
import { AdminLayout } from './components/AdminLayout'

// Page Imports
import { Home } from './pages/Home'
import { Boutique } from './pages/Boutique'
import { ProductDetail } from './pages/ProductDetail'
import { SkinQuiz } from './pages/SkinQuiz'
import { Checkout } from './pages/Checkout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { UserDashboard } from './pages/UserDashboard'

// Admin Page Imports
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminCatalog } from './pages/admin/Catalog'
import { AdminOrders } from './pages/admin/Orders'
import { AdminClientele } from './pages/admin/Clientele'
import { AdminPromotions } from './pages/admin/Promotions'
import { AdminAnalytics } from './pages/admin/Analytics'

// 1. Root Route (Top-level shell, just an Outlet)
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center font-serif text-2xl italic">
      Page non trouvée
    </div>
  )
})

// 2. PUBLIC STOREFRONT BRANCH
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: Layout,
})

const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: Home,
})

const boutiqueRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/boutique',
  component: Boutique,
})

const productRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/produit/$slug',
  component: ProductDetail,
})

const skinQuizRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/skin-quiz',
  component: SkinQuiz,
})

const checkoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/checkout',
  component: Checkout,
})

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/login',
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/register',
  component: Register,
})

const dashboardRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/mon-compte',
  component: () => {
    const { isAuthenticated } = useAuthStore()
    if (!isAuthenticated) return <Login />
    return <UserDashboard />
  }
})

import { AdminGuard } from './components/AdminGuard'

// 3. ADMIN SUITE BRANCH
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin',
  component: () => (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  ),
})

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/',
  component: AdminDashboard,
})

const adminCatalogRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: 'catalog',
  component: AdminCatalog,
})

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: 'orders',
  component: AdminOrders,
})

const adminClienteleRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: 'clientele',
  component: AdminClientele,
})

const adminPromotionsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: 'promotions',
  component: AdminPromotions,
})

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: 'analytics',
  component: AdminAnalytics,
})

// 4. Build the route tree
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute, 
    boutiqueRoute, 
    productRoute, 
    skinQuizRoute, 
    checkoutRoute,
    loginRoute,
    registerRoute,
    dashboardRoute
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminCatalogRoute,
    adminOrdersRoute,
    adminClienteleRoute,
    adminPromotionsRoute,
    adminAnalyticsRoute
  ]),
])

// 5. Export the router
export const router = createRouter({ 
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="flex h-screen items-center justify-center font-serif text-2xl italic">
      Page non trouvée
    </div>
  )
})
