import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ContactTable = ({ contacts, deals, onContactClick, onEditContact, onDeleteContact }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [expandedContact, setExpandedContact] = useState(null);

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase() || "";
    const bValue = b[sortField]?.toString().toLowerCase() || "";
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getContactDeals = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "ArrowUpDown";
    return sortDirection === "asc" ? "ArrowUp" : "ArrowDown";
  };

  return (
    <Card className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
              {[
                { field: "name", label: "Name" },
                { field: "company", label: "Company" },
                { field: "email", label: "Email" },
                { field: "phone", label: "Phone" },
                { field: "deals", label: "Deals" }
              ].map((column) => (
                <th
                  key={column.field}
                  className="text-left py-4 px-6 font-semibold text-secondary cursor-pointer hover:text-slate-900 transition-colors duration-200"
                  onClick={() => column.field !== "deals" && handleSort(column.field)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.field !== "deals" && (
                      <ApperIcon 
                        name={getSortIcon(column.field)} 
                        className="w-4 h-4" 
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="py-4 px-6 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact, index) => {
              const contactDeals = getContactDeals(contact.Id);
              return (
                <motion.tr
                  key={contact.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => onContactClick(contact)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-full">
                        <ApperIcon name="User" className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{contact.name}</div>
                        <div className="text-sm text-secondary">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-900">{contact.company || "-"}</td>
                  <td className="py-4 px-6 text-secondary">{contact.email}</td>
                  <td className="py-4 px-6 text-secondary">{contact.phone || "-"}</td>
                  <td className="py-4 px-6">
                    <Badge variant="primary">
                      {contactDeals.length} deal{contactDeals.length !== 1 ? "s" : ""}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditContact(contact);
                        }}
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteContact(contact.Id);
                        }}
                        className="text-error hover:text-error hover:bg-red-50"
                      >
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {sortedContacts.map((contact, index) => {
          const contactDeals = getContactDeals(contact.Id);
          const isExpanded = expandedContact === contact.Id;
          
          return (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedContact(isExpanded ? null : contact.Id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-full">
                      <ApperIcon name="User" className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{contact.name}</div>
                      {contact.company && (
                        <div className="text-sm text-secondary">{contact.company}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">
                      {contactDeals.length}
                    </Badge>
                    <ApperIcon 
                      name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                      className="w-5 h-5 text-secondary" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <ApperIcon name="Mail" className="w-4 h-4 text-secondary" />
                    <span className="text-secondary">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <ApperIcon name="Phone" className="w-4 h-4 text-secondary" />
                      <span className="text-secondary">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="border-t border-slate-100 bg-slate-50"
                  >
                    <div className="p-4 space-y-3">
                      {contact.notes && (
                        <div>
                          <div className="text-sm font-medium text-slate-900 mb-1">Notes</div>
                          <div className="text-sm text-secondary">{contact.notes}</div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onEditContact(contact)}
                          className="flex items-center space-x-2"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteContact(contact.Id)}
                          className="flex items-center space-x-2 text-error hover:text-error hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default ContactTable;