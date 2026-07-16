"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserCog, Layers, BookOpen, 
  CalendarClock, IndianRupee, FileText, CalendarDays, 
  MonitorPlay, BellRing, Calendar, Coffee, Banknote, Menu, X 
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Staff', href: '/staff', icon: UserCog },
  { name: 'Batches', href: '/batches', icon: Layers },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Timetable', href: '/timetable', icon: CalendarClock },
  { name: 'Fees', href: '/fees', icon: IndianRupee },
  { name: 'Results', href: '/results', icon: FileText },
  { name: 'Exam Schedule', href: '/exam-schedule', icon: CalendarDays },
  { name: 'LMS Materials', href: '/lms', icon: MonitorPlay },
  { name: 'Announcements', href: '/announcements', icon: BellRing },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Leave Approvals', href: '/leave', icon: Coffee },
  { name: 'Payslips', href: '/payslip', icon: Banknote },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0F0F1A] text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#151522] border-r border-white/5 
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/5">
          <span className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <span className="bg-indigo-500/20 p-1.5 rounded-lg">⚡</span> EduSpark
          </span>
          <button className="lg:hidden text-white/50" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-white/50'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
              SA
            </div>
            <div>
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-white/40">admin@eduspark.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0F0F1A]">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#151522]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white/70" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-white/90 hidden sm:block">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-white/60 hover:text-white transition">
              <BellRing size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#151522]"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
