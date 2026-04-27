import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ChefDashboard from './pages/chef/ChefDashboard'
import ChefOrdersPage from './pages/chef/ChefOrdersPage'
import CustomerFeed from './pages/customer/CustomerFeed'
import PostDetailPage from './pages/posts/PostDetailPage'
import MyOrdersPage from './pages/customer/MyOrdersPage'
import ChefProfileSetup from './pages/chef/ChefProfileSetup'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <AppLayout><CustomerFeed /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <AppLayout><PostDetailPage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CHEF', 'ADMIN']}>
              <AppLayout><ChefDashboard /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/orders"
          element={
            <ProtectedRoute allowedRoles={['CHEF', 'ADMIN']}>
              <AppLayout><ChefOrdersPage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <AppLayout><MyOrdersPage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/profile/setup"
          element={
            <ProtectedRoute allowedRoles={['CHEF', 'ADMIN']}>
              <ChefProfileSetup />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App