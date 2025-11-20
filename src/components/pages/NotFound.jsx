import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-lg mx-auto"
      >
        {/* 404 Illustration */}
        <div className="relative">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-full shadow-card mx-auto w-32 h-32 flex items-center justify-center"
          >
            <ApperIcon name="Search" className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-slate-900">
            Page Not Found
          </h2>
          <p className="text-secondary max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to managing your pipeline.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/contacts")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Users" className="w-4 h-4" />
            <span>View Contacts</span>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-secondary mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/pipeline")}
              className="text-sm text-primary hover:text-blue-600 transition-colors duration-200"
            >
              Sales Pipeline
            </button>
            <button
              onClick={() => navigate("/deals")}
              className="text-sm text-primary hover:text-blue-600 transition-colors duration-200"
            >
              Manage Deals
            </button>
            <button
              onClick={() => navigate("/contacts")}
              className="text-sm text-primary hover:text-blue-600 transition-colors duration-200"
            >
              Contact List
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;