import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './HealthSummary.css';

// Elite Monochrome Palette
const COLORS = ['#EF4444', '#ffffff', '#777777', '#333333'];

const mockData = [
  { name: 'Database', value: 85 },
  { name: 'Server', value: 72 },
  { name: 'Security', value: 95 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].name}`}</p>
        <p className="value">{`${payload[0].value}% Health`}</p>
      </div>
    );
  }
  return null;
};

const HealthSummary: React.FC = () => {
  return (
    <div className="card health-summary">
      <div className="card-header">
        <h2 className="card-title">System Health Score</h2>
        <div className="status-badge">
          <span className="dot"></span> Healthy
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={mockData}
              cx="40%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              cornerRadius={6}
            >
              {mockData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}40)` }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend 
              verticalAlign="middle" 
              align="right" 
              layout="vertical" 
              iconType="circle"
              wrapperStyle={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthSummary;
