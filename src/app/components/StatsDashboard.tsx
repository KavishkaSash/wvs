import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Scale, Package, CheckCircle, TrendingUp } from "lucide-react";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = "",
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: number | null;
  className?: string;
}) => (
  <Card
    className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-8 w-8 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold flex items-baseline gap-2">
          {value}
          {trend && (
            <span
              className={`text-sm font-normal ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </CardContent>
  </Card>
);

interface SummaryStats {
  totalWeight: number;
  avgWeight: number;
  totalOrders: number;
  completedCount: number;
  completionRate: number;
  invalidCount: number;
}

const StatsDashboard = ({ summaryStats }: { summaryStats: SummaryStats }) => {
  const statsConfig = [
    {
      title: "Rejected Lines",
      value: `${summaryStats.invalidCount}`,
      subtitle: `Avg: ${summaryStats.avgWeight.toFixed(2)} kg/item`,
      icon: Scale,
      trend: 2.5,
      className: "bg-red-50 border border-red-200", // Added border for better visibility
    },
    {
      title: "Accepted Lines",
      value: (summaryStats.totalOrders - summaryStats.invalidCount).toFixed(0),
      subtitle: "All processed items",
      icon: Package,
      className: "bg-green-50 border border-green-200",
    },
    {
      title: "Completed Orders",
      value: summaryStats.completedCount,
      subtitle: "Successfully processed",
      icon: CheckCircle,
      trend: 4.3,
      className: "bg-yellow-50 border border-yellow-200", // Optional: added green background for completed
    },
    {
      title: "Completion Rate",
      value: `${summaryStats.completionRate.toFixed(1)}%`,
      subtitle: "Of total orders",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            className={stat.className} // Pass the className to StatsCard
          />
        ))}
      </div>
    </div>
  );
};

export default StatsDashboard;
