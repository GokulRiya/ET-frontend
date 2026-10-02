import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Layout from "./pages/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"
import Dashboard from "./pages/Dashboard"
import Category from "./pages/Category"
import Expense from "./pages/Expense"
import MonthlyReports from "./pages/MonthlyReports"
import UnAuthorized from "./pages/UnAuthorized"
import NotFound from "./pages/NotFound"
import PublicRoute from "./routes/PublicRoute"

function App() {

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>


        {/* 401 */}
        <Route path="/unauthorized" element={<UnAuthorized />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="category" element={<Category />} />
            <Route path="expense" element={<Expense />} />
            <Route path="monthly-report" element={<MonthlyReports />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        closeButton={false}
      />
    </>
  )
}

export default App
