import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Upload, FileText, MessageSquare } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Upload Knowledge', path: '/', icon: <Upload size={20} /> },
    { name: 'Grading', path: '/correction', icon: <FileText size={20} /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-base-100 font-sans text-base-content">
      {/* Sidebar */}
      <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
            </div>
            <h1 className="text-xl font-bold">Gradix</h1>
        </div>
        
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                        ${isActive 
                            ? 'bg-primary text-primary-content font-medium' 
                            : 'hover:bg-base-300 text-base-content/80'
                        }
                      `}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-base-300">
             <p className="text-xs text-base-content/50 text-center">Version 1.0.0 (Beta)</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-base-100 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
