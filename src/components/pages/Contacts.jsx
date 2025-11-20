import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ContactTable from "@/components/organisms/ContactTable";
import ContactModal from "@/components/organisms/ContactModal";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load contacts");
      console.error("Contacts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower))
    );
  });

  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        const updatedContact = await contactService.update(editingContact.Id, contactData);
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.Id === editingContact.Id ? updatedContact : contact
          )
        );
        toast.success("Contact updated successfully");
      } else {
        const newContact = await contactService.create(contactData);
        setContacts(prevContacts => [...prevContacts, newContact]);
        toast.success("Contact added successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save contact");
      console.error("Error saving contact:", error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prevContacts =>
        prevContacts.filter(contact => contact.Id !== contactId)
      );
      toast.success("Contact deleted successfully");
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error("Error deleting contact:", error);
    }
  };

  const handleContactClick = (contact) => {
    // Could navigate to contact details or expand inline
    console.log("Contact clicked:", contact);
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
              Contacts
            </h1>
            <p className="text-secondary mt-1">
              Manage your customer relationships and contact information
            </p>
          </div>
          <Button
            onClick={handleAddContact}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            <span>Add Contact</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-lg">
                  <ApperIcon name="Users" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{contacts.length}</div>
                  <div className="text-secondary">Total Contacts</div>
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
                  <ApperIcon name="Target" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{deals.length}</div>
                  <div className="text-secondary">Active Deals</div>
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
                  <ApperIcon name="Building2" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {new Set(contacts.filter(c => c.company).map(c => c.company)).size}
                  </div>
                  <div className="text-secondary">Companies</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <SearchBar
            placeholder="Search contacts by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </motion.div>

        {/* Contacts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {filteredContacts.length === 0 ? (
            contacts.length === 0 ? (
              <Empty
                icon="Users"
                title="No contacts yet"
                description="Start building your customer relationships by adding your first contact"
                actionLabel="Add Contact"
                onAction={handleAddContact}
              />
            ) : (
              <Empty
                icon="Search"
                title="No contacts found"
                description={`No contacts match "${searchTerm}". Try adjusting your search.`}
              />
            )
          ) : (
            <ContactTable
              contacts={filteredContacts}
              deals={deals}
              onContactClick={handleContactClick}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
            />
          )}
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contact={editingContact}
      />
    </div>
  );
};

export default Contacts;