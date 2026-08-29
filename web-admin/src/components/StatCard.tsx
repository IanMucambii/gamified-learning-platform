import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
      </div>

      <p>{title}</p>

      <div className="stat-value">
        <h2>{value}</h2>
      </div>

      {change && <span className="stat-change">{change}</span>}
    </div>
  );
};

export default StatCard;