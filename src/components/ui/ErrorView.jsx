import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-full mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">Oops! Something went wrong</h3>
      <p className="text-secondary text-center mb-8 max-w-md">
        {message}. Please try again or contact support if the problem persists.
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center space-x-2">
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export default ErrorView;