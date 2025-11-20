import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  delay = 0 
}) => {
  const colorClasses = {
    primary: "from-primary to-blue-600",
    success: "from-success to-emerald-600",
    warning: "from-warning to-amber-600",
    error: "from-error to-red-600",
    secondary: "from-secondary to-slate-600"
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-secondary"
  };

  const trendIcons = {
    up: "TrendingUp",
    down: "TrendingDown",
    neutral: "Minus"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-6 hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg shadow-lifted`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
              <ApperIcon name={trendIcons[trend]} className="w-4 h-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-secondary font-medium">{title}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;