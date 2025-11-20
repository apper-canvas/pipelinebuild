import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const DealModal = ({ isOpen, onClose, onSave, deal = null, contacts = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "Lead",
    expectedCloseDate: "",
    probability: 25
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: "Lead", label: "Lead", probability: 25 },
    { value: "Qualified", label: "Qualified", probability: 50 },
    { value: "Proposal", label: "Proposal", probability: 75 },
    { value: "Closed Won", label: "Closed Won", probability: 100 },
    { value: "Closed Lost", label: "Closed Lost", probability: 0 }
  ];

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        expectedCloseDate: deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), "yyyy-MM-dd") : "",
        probability: deal.probability || 25
      });
    } else {
      // Set default expected close date to 30 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "Lead",
        expectedCloseDate: format(defaultDate, "yyyy-MM-dd"),
        probability: 25
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Valid deal value is required";
    }
    
    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
      };
      await onSave(dealData);
      onClose();
    } catch (error) {
      console.error("Error saving deal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleStageChange = (stage) => {
    const selectedStage = stages.find(s => s.value === stage);
    setFormData(prev => ({
      ...prev,
      stage,
      probability: selectedStage?.probability || 25
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-card-hover max-w-lg w-full mx-4 sm:mx-auto overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-success to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ApperIcon name="Target" className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {deal ? "Edit Deal" : "Add New Deal"}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 p-2"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <Input
                  label="Deal Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter deal title"
                  error={errors.title}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Contact *
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => handleInputChange("contactId", e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all duration-200"
                  >
                    <option value="">Select a contact</option>
                    {contacts.map(contact => (
                      <option key={contact.Id} value={contact.Id}>
                        {contact.name} {contact.company && `(${contact.company})`}
                      </option>
                    ))}
                  </select>
                  {errors.contactId && (
                    <p className="text-sm text-error mt-1">{errors.contactId}</p>
                  )}
                </div>

                <Input
                  label="Deal Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="0"
                  error={errors.value}
                  min="0"
                  step="0.01"
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-all duration-200"
                  >
                    {stages.map(stage => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expected Close Date"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                    error={errors.expectedCloseDate}
                    required
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Probability (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.probability}
                      onChange={(e) => handleInputChange("probability", parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="text-center text-sm font-semibold text-primary">
                      {formData.probability}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2"
                  variant="success"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" className="w-4 h-4" />
                      <span>{deal ? "Update Deal" : "Add Deal"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default DealModal;