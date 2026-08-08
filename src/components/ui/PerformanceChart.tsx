import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const mockPerformanceData: any[] = [
  { time: '10:00', cpu: 24, memory: 45 },
  { time: '10:10', cpu: 28, memory: 47 },
  { time: '10:20', cpu: 35, memory: 48 },
  { time: '10:30', cpu: 45, memory: 52 },
  { time: '10:40', cpu: 38, memory: 50 },
  { time: '10:50', cpu: 30, memory: 49 },
  { time: '11:00', cpu: 32, memory: 48 },
  { time: '11:10', cpu: 40, memory: 55 },
  { time: '11:20', cpu: 42, memory: 54 },
  { time: '11:30', cpu: 35, memory: 51 },
  { time: '11:40', cpu: 28, memory: 49 },
  { time: '11:50', cpu: 26, memory: 47 },
  { time: '12:00', cpu: 25, memory: 46 }
];

interface PerformanceChartProps {
  data?: any[];
  title?: string;
  cpuName?: string;
  memoryName?: string;
}

export default function PerformanceChart({ 
  data = mockPerformanceData, 
  title = "System Performance",
  cpuName = "CPU Usage %",
  memoryName = "Memory Usage %"
}: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState('Last 24 Hours');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time state every second to drive real-time X-axis ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter or slice the data depending on the chosen timeframe dropdown option
  let filteredData = [...data];
  if (timeframe === 'Last 1 Hour') {
    filteredData = data.slice(-6); // Last 1 hour (approx 6 intervals)
  } else if (timeframe === 'Last 24 Hours') {
    filteredData = data.slice(-24); // Last 24 intervals
  } else if (timeframe === 'Last 7 Days') {
    filteredData = data; // Show all history
  }

  // Determine interval spacing in seconds based on selected timeframe
  let spacingSeconds = 600; // 10 minutes default
  if (timeframe === 'Last 1 Hour') {
    spacingSeconds = 10; // 10s spacing to show rapid real-time rolling
  } else if (timeframe === 'Last 24 Hours') {
    spacingSeconds = 60; // 1m spacing
  } else if (timeframe === 'Last 7 Days') {
    spacingSeconds = 3600; // 1h spacing
  }

  // Map the data points to live real-time timestamps
  const liveData = filteredData.map((item, index) => {
    const N = filteredData.length;
    const pointTime = new Date(currentTime.getTime() - (N - 1 - index) * spacingSeconds * 1000);
    const timeStr = pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    return {
      ...item,
      time: timeStr
    };
  });

  return (
    <div className="glass-panel p-6 flex flex-col h-full border border-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
        <select 
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-surfaceHover border border-border text-sm rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary text-textPrimary font-medium transition-colors cursor-pointer"
        >
          <option value="Last 1 Hour">Last 1 Hour</option>
          <option value="Last 24 Hours">Last 24 Hours</option>
          <option value="Last 7 Days">Last 7 Days</option>
        </select>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={liveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.3} />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', color: '#F9FAFB' }}
              itemStyle={{ fontWeight: 600 }}
              cursor={{ stroke: '#4B5563', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorMemory)" name={memoryName} activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }} />
            <Area type="monotone" dataKey="cpu" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" name={cpuName} activeDot={{ r: 6, strokeWidth: 0, fill: '#EF4444' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
