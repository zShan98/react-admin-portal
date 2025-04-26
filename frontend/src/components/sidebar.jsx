import { useMatch, useNavigate } from 'react-router-dom';
import procomLogo from '../assets/logo.png';
import { cn } from '../lib/utils';
import { LogOut } from 'lucide-react';

const SidebarItem = ({ item }) => {
  const active = useMatch(item.url);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => !active && navigate(item.url)}
      className="flex items-center justify-between h-full cursor-pointer py-2"
    >
      <div className="flex items-center">
        <img
          className="mr-4 2xl:h-9 2xl:w-9"
          src={item.logo}
        />
        <p className={cn(!active && "text-font-gray", "text-lg/snug font-semibold min-w-40")}>{item.title}</p>
      </div>
      <span className={cn(active && "main-gradient", "w-[5px] h-10 rounded-full")} />
    </div>
  )
}

export default function Sidebar({ items }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="min-h-screen lg:w-3xs xl:w-xs bg-primary-background py-8 px-6 flex flex-col text-font-blue">
      <img src={procomLogo} className="mb-12" />
      <div className="flex flex-col space-y-3">
        {items.map((item, idx) => <SidebarItem key={idx} item={item} />)}
      </div>
      <div className="mt-16">
        <button 
          onClick={handleLogout}
          className="flex items-center cursor-pointer gap-3 text-red-500 hover:text-red-600 font-semibold text-lg/snug"
        >
          <LogOut className="h-9 w-9" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}