import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "stage_change":
        return "GitBranch";
      case "deal_created":
        return "Plus";
      case "deal_updated":
        return "Edit";
      case "contact_added":
        return "UserPlus";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "stage_change":
        return "text-primary";
      case "deal_created":
        return "text-success";
      case "deal_updated":
        return "text-warning";
      case "contact_added":
        return "text-info";
      default:
        return "text-secondary";
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200">
      <div className={`flex-shrink-0 p-2 rounded-full bg-slate-100 ${getActivityColor(activity.type)}`}>
        <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 font-medium">
          {activity.description}
        </p>
        <p className="text-xs text-secondary mt-1">
          {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;