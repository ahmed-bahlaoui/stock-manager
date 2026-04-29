import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProductsPage } from './pages/ProductsPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { OrdersPage } from './pages/OrdersPage'
import { StockMovementsPage } from './pages/StockMovementsPage'
import { StockInPage } from './pages/StockInPage'
import { ProfilePage } from './pages/ProfilePage'
import { AuthenticatedRoute } from './shared/layout/AuthenticatedRoute'
import { AppShell } from './shared/layout/AppShell'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticatedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'stock-movements', element: <StockMovementsPage /> },
          { path: 'stock-in', element: <StockInPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
