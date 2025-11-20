import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DealCard from "@/components/organisms/DealCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { name: "Lead", color: "slate" },
    { name: "Qualified", color: "blue" },
    { name: "Proposal", color: "amber" },
    { name: "Closed Won", color: "green" },
    { name: "Closed Lost", color: "red" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load pipeline data");
      console.error("Pipeline error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getContactById = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      await dealService.update(draggedDeal.Id, { stage: targetStage });
      
      // Update local state
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.Id === draggedDeal.Id 
            ? { ...deal, stage: targetStage }
            : deal
        )
      );
      
      toast.success(`Deal moved to ${targetStage}`);
    } catch (error) {
      toast.error("Failed to update deal stage");
      console.error("Error updating deal:", error);
    } finally {
      setDraggedDeal(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Sales Pipeline
            </h1>
            <p className="text-secondary mt-1">
              Drag and drop deals between stages to track progress
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/deals'}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Deal</span>
          </Button>
        </div>

        {/* Pipeline Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 text-center">
                <div className="text-sm font-medium text-secondary mb-1">
                  {stage.name}
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {getDealsByStage(stage.name).length}
                </div>
                <div className="text-sm text-secondary">
                  {formatCurrency(getStageValue(stage.name))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Board */}
        {deals.length === 0 ? (
          <Empty
            icon="GitBranch"
            title="No deals in pipeline"
            description="Start building your sales pipeline by adding your first deal"
            actionLabel="Add Deal"
            onAction={() => window.location.href = '/deals'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 min-h-screen">
            {stages.map((stage, stageIndex) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: stageIndex * 0.1 }}
                className="space-y-4"
              >
                {/* Stage Header */}
                <div
                  className={`bg-gradient-to-r ${
                    stage.color === "slate" ? "from-slate-100 to-slate-200" :
                    stage.color === "blue" ? "from-blue-100 to-blue-200" :
                    stage.color === "amber" ? "from-amber-100 to-amber-200" :
                    stage.color === "green" ? "from-green-100 to-green-200" :
                    "from-red-100 to-red-200"
                  } p-4 rounded-lg shadow-lifted`}
                >
                  <h3 className={`font-semibold ${
                    stage.color === "slate" ? "text-slate-800" :
                    stage.color === "blue" ? "text-blue-800" :
                    stage.color === "amber" ? "text-amber-800" :
                    stage.color === "green" ? "text-green-800" :
                    "text-red-800"
                  }`}>
                    {stage.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm ${
                      stage.color === "slate" ? "text-slate-600" :
                      stage.color === "blue" ? "text-blue-600" :
                      stage.color === "amber" ? "text-amber-600" :
                      stage.color === "green" ? "text-green-600" :
                      "text-red-600"
                    }`}>
                      {getDealsByStage(stage.name).length} deals
                    </span>
                    <span className={`text-sm font-medium ${
                      stage.color === "slate" ? "text-slate-700" :
                      stage.color === "blue" ? "text-blue-700" :
                      stage.color === "amber" ? "text-amber-700" :
                      stage.color === "green" ? "text-green-700" :
                      "text-red-700"
                    }`}>
                      {formatCurrency(getStageValue(stage.name))}
                    </span>
                  </div>
                </div>

                {/* Deals Column */}
                <div
                  className="min-h-96 space-y-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.name)}
                >
                  <AnimatePresence>
                    {getDealsByStage(stage.name).map((deal, dealIndex) => (
                      <motion.div
                        key={deal.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: dealIndex * 0.05 }}
                      >
                        <DealCard
                          deal={deal}
                          contact={getContactById(deal.contactId)}
                          draggable={true}
                          onDragStart={() => handleDragStart(deal)}
                          onDragEnd={handleDragEnd}
                          onClick={() => window.location.href = '/deals'}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {getDealsByStage(stage.name).length === 0 && (
                    <div className="text-center py-8 text-secondary">
                      <ApperIcon name="Package" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pipeline;