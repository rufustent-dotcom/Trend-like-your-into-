import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { IntelligenceVault } from '../types';

export default function SalesDashboard({ vault }: { vault: IntelligenceVault }) {
  const [rep, setRep] = useState("All");
  const [region, setRegion] = useState("All");
  const sales = vault.sales || [];

  const filteredSales = useMemo(() => {
    return sales.filter(s =>
      (rep === "All" || s.representative === rep) &&
      (region === "All" || s.region === region)
    );
  }, [sales, rep, region]);

  const totalRevenue = filteredSales.reduce((acc, s) => acc + (s.status === "Closed" ? s.amount : 0), 0);
  const dealsClosed = filteredSales.filter(s => s.status === "Closed").length;
  const avgDealSize = dealsClosed > 0 ? totalRevenue / dealsClosed : 0;
  const conversionRate = filteredSales.length > 0 ? (dealsClosed / filteredSales.length) * 100 : 0;

  const uniqueReps = Array.from(new Set(sales.map(s => s.representative)));
  const uniqueRegions = Array.from(new Set(sales.map(s => s.region)));

  return (
    <div className="p-6 space-y-6 bg-zinc-950 text-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-white">Sales Performance Dashboard</h2>
      
      {/* Filters */}
      <div className="flex gap-4">
        <select onChange={(e) => setRep(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-slate-300 p-2 rounded text-sm">
          <option value="All">All Reps</option>
          {uniqueReps.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select onChange={(e) => setRegion(e.target.value)} className="bg-zinc-900 border border-zinc-800 text-slate-300 p-2 rounded text-sm">
          <option value="All">All Regions</option>
          {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="text-xs text-slate-400">Total Revenue</div>
          <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="text-xs text-slate-400">Deals Closed</div>
          <div className="text-2xl font-bold text-white">{dealsClosed}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="text-xs text-slate-400">Avg Deal Size</div>
          <div className="text-2xl font-bold text-white">${Math.round(avgDealSize).toLocaleString()}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <div className="text-xs text-slate-400">Conversion Rate</div>
          <div className="text-2xl font-bold text-white">{conversionRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredSales}>
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
            <Bar dataKey="amount" fill="#00f5d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
