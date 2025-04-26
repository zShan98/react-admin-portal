import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function IndexLayout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}