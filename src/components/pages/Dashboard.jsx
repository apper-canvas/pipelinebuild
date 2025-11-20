import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityItem from "@/components/molecules/ActivityItem";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getRecent(8)
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMetrics = () => {
    const totalContacts = contacts.length;
    const activeDeals = deals.filter(d => !["Closed Won", "Closed Lost"].includes(d.stage)).length;
    const pipelineValue = deals
      .filter(d => !["Closed Won", "Closed Lost"].includes(d.stage))
      .reduce((sum, deal) => sum + deal.value, 0);
    
    const wonDeals = deals.filter(d => d.stage === "Closed Won").length;
    const totalDealsWithOutcome = deals.filter(d => ["Closed Won", "Closed Lost"].includes(d.stage)).length;
    const winRate = totalDealsWithOutcome > 0 ? Math.round((wonDeals / totalDealsWithOutcome) * 100) : 0;

    return {
      totalContacts,
      activeDeals,
      pipelineValue,
      winRate
    };
  };

  const getRecentDeals = () => {
    return [...deals]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />;

  const metrics = getMetrics();
  const recentDeals = getRecentDeals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-secondary mt-1">
              Track your sales pipeline and customer relationships
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => window.location.href = '/contacts'}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              <span>Add Contact</span>
            </Button>
            <Button
              onClick={() => window.location.href = '/deals'}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Target" className="w-4 h-4" />
              <span>Add Deal</span>
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Contacts"
            value={metrics.totalContacts}
            icon="Users"
            color="primary"
            delay={0}
          />
          <MetricCard
            title="Active Deals"
            value={metrics.activeDeals}
            icon="Target"
            color="success"
            delay={0.1}
          />
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            icon="DollarSign"
            color="warning"
            delay={0.2}
          />
          <MetricCard
            title="Win Rate"
            value={`${metrics.winRate}%`}
            icon="TrendingUp"
            color={metrics.winRate >= 50 ? "success" : "error"}
            delay={0.3}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Deals */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Recent Deals</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/deals'}
                  className="flex items-center space-x-2"
                >
                  <span>View All</span>
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                </Button>
              </div>

              {recentDeals.length === 0 ? (
                <Empty
                  icon="Target"
                  title="No deals yet"
                  description="Start by adding your first deal to track your sales pipeline"
                  actionLabel="Add Deal"
                  onAction={() => window.location.href = '/deals'}
                />
              ) : (
                <div className="space-y-4">
                  {recentDeals.map((deal, index) => {
                    const contact = contacts.find(c => c.Id === deal.contactId);
                    return (
                      <motion.div
                        key={deal.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-br from-success to-emerald-600 p-2 rounded-full">
                            <ApperIcon name="Target" className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{deal.title}</div>
                            <div className="text-sm text-secondary">
                              {contact?.name || "Unknown Contact"} • {deal.stage}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">
                            {formatCurrency(deal.value)}
                          </div>
                          <div className="text-sm text-secondary">
                            {deal.probability}% chance
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <ApperIcon name="Activity" className="w-5 h-5 text-secondary" />
              </div>

              {activities.length === 0 ? (
                <Empty
                  icon="Activity"
                  title="No activity yet"
                  description="Activity will appear here as you work with deals and contacts"
                />
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ActivityItem activity={activity} />
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/contacts'}
                >
                  <ApperIcon name="UserPlus" className="w-4 h-4 mr-3" />
                  Add New Contact
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/deals'}
                >
                  <ApperIcon name="Target" className="w-4 h-4 mr-3" />
                  Create New Deal
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/pipeline'}
                >
                  <ApperIcon name="GitBranch" className="w-4 h-4 mr-3" />
                  View Pipeline
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;