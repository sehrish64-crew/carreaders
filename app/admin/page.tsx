'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBar as BarChart3, Users, FileText, DollarSign, TrendingUp, Activity, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, RefreshCw, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { DASHBOARD_STATS, RECENT_ACTIVITY, REPORTS_TABLE, REVENUE_DATA } from '@/lib/mock-data';
import { PRICING_PLANS } from '../../lib/mock-data'

function StatCard({ stat, index }: { stat: typeof DASHBOARD_STATS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all card-shine"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
          {[BarChart3, DollarSign, Users, Activity][index] && (() => {
            const Icon = [BarChart3, DollarSign, Users, Activity][index];
            return <Icon className="w-5 h-5 text-brand-600" />;
          })()}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          stat.trend === 'up' ? 'text-brand-600' : 'text-brand-600'
        }`}>
          {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {stat.change}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
      <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
    </motion.div>
  );
}

function RevenueChart() {
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-600" />
          Revenue Overview
        </h3>
        <span className="text-xs text-gray-400">Last 12 months</span>
      </div>
      <div className="flex items-end gap-2 h-48">
        {REVENUE_DATA.map((d, i) => (
          <motion.div
            key={d.month}
            initial={{ height: 0 }}
            animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 relative group cursor-pointer min-w-0"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white whitespace-nowrap bg-brand-600 px-2 py-1 rounded shadow-sm">
              £{d.revenue.toLocaleString()}
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">{d.month}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed() {
  const [activities, setActivities] = useState(RECENT_ACTIVITY);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = {
          ...RECENT_ACTIVITY[Math.floor(Math.random() * RECENT_ACTIVITY.length)],
          id: String(Date.now()),
          time: 'Just now',
        };
        return [newActivity, ...prev].slice(0, 8);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-600" />
          Real-time Activity
        </h3>
        <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {activities.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              a.status === 'completed' ? 'bg-brand-50' : a.status === 'processing' ? 'bg-brand-50' : 'bg-yellow-50'
            }`}>
              {a.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
              ) : a.status === 'processing' ? (
                <Clock className="w-4 h-4 text-brand-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{a.user} - {a.action}</p>
              <p className="text-xs text-gray-400">{a.vehicle} &middot; {a.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportsTable() {
  const statusConfig = {
    delivered: { color: 'text-brand-700', bg: 'bg-brand-50', label: 'Delivered' },
    processing: { color: 'text-brand-700', bg: 'bg-brand-50', label: 'Processing' },
    refunded: { color: 'text-brand-700', bg: 'bg-brand-50', label: 'Refunded' },
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          Recent Reports
        </h3>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-9 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 w-48"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 text-gray-500 font-medium">ID</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">Vehicle</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">Plan</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {REPORTS_TABLE.map((r, i) => {
              const status = statusConfig[r.status as keyof typeof statusConfig];
              return (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-2 text-brand-600 font-mono text-xs">{r.id}</td>
                  <td className="py-3 px-2 text-gray-900">{r.vehicle}</td>
                  <td className="py-3 px-2 text-gray-500">{r.customer}</td>
                  <td className="py-3 px-2 text-gray-500">{r.plan}</td>
                  <td className="py-3 px-2 text-gray-900 font-medium">{r.amount}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-400">{r.date}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [liveCount, setLiveCount] = useState(847);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor your vehicle inspection platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 border border-brand-200 text-sm">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-brand-700">{liveCount} scans today</span>
            </div>
            <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
              <RefreshCw className="w-4 h-4 text-brand-600" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {DASHBOARD_STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>

        <ReportsTable />
      </div>
    </div>
  );
}
