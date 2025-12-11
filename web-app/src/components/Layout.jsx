import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Upload, FileText, MessageSquare } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Subject Upload', path: '/', icon: <Upload size={20} /> },
    { name: 'Correction Page', path: '/correction', icon: <FileText size={20} /> },
    { name: 'Chat Bot', path: '/chat', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-base-100 font-mono">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 text-base-content flex flex-col border-r border-base-300">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-primary tracking-wider">Gradix</h1>
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="menu menu-lg rounded-box w-full gap-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 text-xs text-base-content/50 text-center">
          v1.0.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
