import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../components/pages/login";
import AnalyticsPage from "../components/pages/analytics";
import RegisterPage from "../components/pages/register";
import PublicRoute from "./protection/public-route";
import IndexLayout from "../components/layouts";
import ProtectedRoute from "./protection/protected-route";
import DashboardLayout from "../components/layouts/dashboard";
import DashboardPage from "../components/pages/dashboard";
import OnDayAttendance from "../components/pages/attendance";
export const router = createBrowserRouter([
  {
    element: <IndexLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/login',
        element: <PublicRoute><LoginPage /></PublicRoute>
      },
      {
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />
          },
          {
            path: '/dashboard/analytics',
            element: <AnalyticsPage />,
          },
          {
            path: '/dashboard/register',
            element: <RegisterPage />,
          },
          {
            path: '/dashboard/attendance',
            element: <OnDayAttendance />,
          }
        ]
      }
    ]

  }
])