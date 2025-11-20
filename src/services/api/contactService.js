import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('contacts_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error("Error fetching contacts:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.Name,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        notes: contact.notes_c,
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('contacts_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching contact:", response.message);
        toast.error(response.message);
        return null;
      }

      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.Name,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        notes: contact.notes_c,
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      };
    } catch (error) {
      console.error("Error fetching contact:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('contacts_c', {
        records: [{
          Name: contactData.name,
          email_c: contactData.email,
          phone_c: contactData.phone,
          company_c: contactData.company,
          notes_c: contactData.notes
        }]
      });

      if (!response.success) {
        console.error("Error creating contact:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contact records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdContact = successful[0].data;
          return {
            Id: createdContact.Id,
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            company: contactData.company,
            notes: contactData.notes,
            createdAt: createdContact.CreatedOn,
            updatedAt: createdContact.ModifiedOn
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      const updateData = {};
      
      if (contactData.name !== undefined) updateData.Name = contactData.name;
      if (contactData.email !== undefined) updateData.email_c = contactData.email;
      if (contactData.phone !== undefined) updateData.phone_c = contactData.phone;
      if (contactData.company !== undefined) updateData.company_c = contactData.company;
      if (contactData.notes !== undefined) updateData.notes_c = contactData.notes;

      const response = await apperClient.updateRecord('contacts_c', {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      });

      if (!response.success) {
        console.error("Error updating contact:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contact records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          return await this.getById(id);
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('contacts_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting contact:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contact records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
    }
  }
};