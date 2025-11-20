import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Database", 
  title = "No data found", 
  description = "There's nothing here yet.", 
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-full mb-6">
        <ApperIcon name={icon} className="w-16 h-16 text-secondary" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-secondary text-center mb-8 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;