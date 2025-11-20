import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import DealModal from "@/components/organisms/DealModal";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const stages = ["Lead", "Qualified", "Proposal", "Closed Won", "Closed Lost"];

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
      setError("Failed to load deals");
      console.error("Deals error:", err);
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

  const getContactById = (contactId) => {
    return contacts.find(c => c.Id === contactId);
  };

  const getBadgeVariant = (stage) => {
    switch (stage) {
      case "Lead": return "secondary";
      case "Qualified": return "primary";
      case "Proposal": return "warning";
      case "Closed Won": return "success";
      case "Closed Lost": return "error";
      default: return "secondary";
    }
  };

  const filteredDeals = deals.filter(deal => {
    const searchLower = searchTerm.toLowerCase();
    const contact = getContactById(deal.contactId);
    
    const matchesSearch = deal.title.toLowerCase().includes(searchLower) ||
      (contact && (
        contact.name.toLowerCase().includes(searchLower) ||
        (contact.company && contact.company.toLowerCase().includes(searchLower))
      ));
    
    const matchesStage = stageFilter === "all" || deal.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        const updatedDeal = await dealService.update(editingDeal.Id, dealData);
        setDeals(prevDeals =>
          prevDeals.map(deal =>
            deal.Id === editingDeal.Id ? updatedDeal : deal
          )
        );
        toast.success("Deal updated successfully");
      } else {
        const newDeal = await dealService.create(dealData);
        setDeals(prevDeals => [...prevDeals, newDeal]);
        toast.success("Deal created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save deal");
      console.error("Error saving deal:", error);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await dealService.delete(dealId);
      setDeals(prevDeals =>
        prevDeals.filter(deal => deal.Id !== dealId)
      );
      toast.success("Deal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete deal");
      console.error("Error deleting deal:", error);
    }
  };

  const getTotalValue = (stage = null) => {
    const relevantDeals = stage ? deals.filter(d => d.stage === stage) : deals;
    return relevantDeals.reduce((sum, deal) => sum + deal.value, 0);
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
              Deals
            </h1>
            <p className="text-secondary mt-1">
              Track and manage your sales opportunities
            </p>
          </div>
          <Button
            onClick={handleAddDeal}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Deal</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-lg">
                  <ApperIcon name="Target" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{deals.length}</div>
                  <div className="text-secondary">Total Deals</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-success to-emerald-600 p-3 rounded-lg">
                  <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {formatCurrency(getTotalValue())}
                  </div>
                  <div className="text-secondary">Total Value</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-warning to-amber-600 p-3 rounded-lg">
                  <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage)).length}
                  </div>
                  <div className="text-secondary">Active Deals</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-info to-blue-600 p-3 rounded-lg">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {deals.filter(d => d.stage === "Closed Won").length}
                  </div>
                  <div className="text-secondary">Won Deals</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <SearchBar
            placeholder="Search deals by title, contact, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md"
          />
          
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary"
          >
            <option value="all">All Stages</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </motion.div>

        {/* Deals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {filteredDeals.length === 0 ? (
            deals.length === 0 ? (
              <Empty
                icon="Target"
                title="No deals yet"
                description="Start tracking your sales opportunities by creating your first deal"
                actionLabel="Add Deal"
                onAction={handleAddDeal}
              />
            ) : (
              <Empty
                icon="Search"
                title="No deals found"
                description={`No deals match your current search and filter criteria.`}
              />
            )
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                      <th className="text-left py-4 px-6 font-semibold text-secondary">Deal</th>
                      <th className="text-left py-4 px-6 font-semibold text-secondary">Contact</th>
                      <th className="text-left py-4 px-6 font-semibold text-secondary">Value</th>
                      <th className="text-left py-4 px-6 font-semibold text-secondary">Stage</th>
                      <th className="text-left py-4 px-6 font-semibold text-secondary">Close Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-secondary">Probability</th>
                      <th className="py-4 px-6 w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map((deal, index) => {
                      const contact = getContactById(deal.contactId);
                      return (
                        <motion.tr
                          key={deal.Id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                        >
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-900">{deal.title}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-medium text-slate-900">
                                {contact?.name || "Unknown Contact"}
                              </div>
                              {contact?.company && (
                                <div className="text-sm text-secondary">{contact.company}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-900">
                            {formatCurrency(deal.value)}
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={getBadgeVariant(deal.stage)}>
                              {deal.stage}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-secondary">
                            {format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${deal.probability}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-secondary">
                                {deal.probability}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditDeal(deal)}
                              >
                                <ApperIcon name="Edit2" className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteDeal(deal.Id)}
                                className="text-error hover:text-error hover:bg-red-50"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
<ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        deal={editingDeal}
        contacts={contacts}
      />
    </div>
  );
};

export default Deals;