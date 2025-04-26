import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../sidebar";
import Nav1 from '../../assets/nav-1.png';
import Nav2 from '../../assets/nav-2.png';
import Nav4 from '../../assets/nav-4.png';
import Home from '../../assets/weird-thing-dark.png'
import { path_to_header } from '../../constants/headers'

const sidebarItems = [
  {
    title: 'Home',
    url: '/dashboard',
    logo: Home
  },
  {
    title: 'Registration Analytics',
    url: '/dashboard/analytics',
    logo: Nav1
  },
  {
    title: 'Create / Edit Registration',
    url: '/dashboard/register',
    logo: Nav2
  },
  {
    title: 'On Day Attendance',
    url: '/dashboard/attendance',
    logo: Nav4
  }
];


export default function DashboardLayout() {
  const url = useLocation();

  return (
    <div className="flex">
      <Sidebar items={sidebarItems} />
      <div className="w-full py-4 px-6 text-font-blue">
        <h1 className="text-3xl font-bold py-4">{path_to_header[url.pathname]}</h1>
        <Outlet />
      </div>
    </div>
  )
}