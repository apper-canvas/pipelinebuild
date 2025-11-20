import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const DealCard = ({ 
  deal, 
  contact, 
  onDragStart, 
  onDragEnd, 
  draggable = false,
  onClick 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "success";
    if (probability >= 50) return "warning";
    return "error";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 border-l-4 border-primary"
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 truncate">
                {deal.title}
              </h4>
              <p className="text-sm text-secondary">
                {contact?.name || "Unknown Contact"}
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <ApperIcon name="DollarSign" className="w-3 h-3" />
              <Badge variant="primary" className="font-semibold">
                {formatCurrency(deal.value)}
              </Badge>
            </div>
          </div>

          {/* Company */}
          {contact?.company && (
            <div className="flex items-center space-x-2">
              <ApperIcon name="Building2" className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary">{contact.company}</span>
            </div>
          )}

          {/* Expected Close Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="w-4 h-4 text-secondary" />
              <span className="text-secondary">
                {format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}
              </span>
            </div>
            <Badge variant={getProbabilityColor(deal.probability)}>
              {deal.probability}%
            </Badge>
          </div>

          {/* Drag Indicator */}
          {draggable && (
            <div className="flex justify-center pt-2">
              <ApperIcon name="GripVertical" className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;