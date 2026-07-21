import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const mockPerformanceData = [
  { time: '09:00', cpu: 45, memory: 60 },
  { time: '09:10', cpu: 55, memory: 65 },
  { time: '09:20', cpu: 40, memory: 62 },
  { time: '09:30', cpu: 75, memory: 70 },
  { time: '09:40', cpu: 85, memory: 78 },
  { time: '09:50', cpu: 92, memory: 82 },
  { time: '10:00', cpu: 65, memory: 75 },
];

interface PerformanceChartProps {
  data?: any[];
  title?: string;
}

export default function PerformanceChart({ data = mockPerformanceData, title = "System Performance" }: PerformanceChartProps) {
  return (
    <div className="glass-panel p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
        <select className="bg-background border border-border text-sm rounded-md px-3 py-1 focus:ring-primary focus:border-primary">
          <option>Last 1 Hour</option>
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
        </select>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A3A3A3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#A3A3A3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '8px' }}
              itemStyle={{ color: '#111111' }}
            />
            <Area type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" name="CPU Usage %" />
            <Area type="monotone" dataKey="memory" stroke="#A3A3A3" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" name="Memory Usage %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
