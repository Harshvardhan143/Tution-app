"use client";

import React from 'react';
import { Users, BookOpen, IndianRupee, TrendingUp, UserCheck, CalendarClock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
];

const STATS = [
  { title: "Total Students", value: "1,248", change: "+12%", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { title: "Active Batches", value: "42", change: "+3", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/10" },
  { title: "Fee Collection", value: "₹ 8.4L", change: "+18%", icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { title: "Staff Present", value: "38/40", change: "95%", icon: UserCheck, color: "text-orange-400", bg: "bg-orange-400/10" },
];

const RECENT_ACTIVITY = [
  { id: 1, title: "Fee Paid", desc: "Arjun Mehta (Class 10) paid ₹5,000", time: "10 mins ago", icon: IndianRupee, color: "text-emerald-400" },
  { id: 2, title: "New Admission", desc: "Sneha Rao joined JEE Advance", time: "1 hour ago", icon: Users, color: "text-blue-400" },
  { id: 3, title: "Class Rescheduled", desc: "Physics lecture moved to 4 PM", time: "2 hours ago", icon: CalendarClock, color: "text-purple-400" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
        <p className="text-white/50 mt-1">Welcome back, here&apos;s what&apos;s happening at EduSpark today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#1C1C28] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                <Icon size={80} className={stat.color} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> {stat.change}
                </span>
              </div>
              <p className="text-white/50 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#1C1C28] border border-white/5 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white">Revenue Growth (2026)</h3>
            <select className="bg-[#0F0F1A] border border-white/10 rounded-md px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-indigo-500">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151522', borderColor: '#ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1C1C28] border border-white/5 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex gap-4 relative">
                  {i !== RECENT_ACTIVITY.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-white/10" />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#0F0F1A] border border-white/10 shrink-0 z-10`}>
                    <Icon size={14} className={item.color} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90">{item.title}</h4>
                    <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                    <span className="text-[10px] text-white/30 font-medium mt-1.5 block">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-6 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:bg-white/5 hover:text-white transition font-medium">
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
}
