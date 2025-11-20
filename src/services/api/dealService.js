import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deals_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching deals:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        expectedCloseDate: deal.expectedCloseDate_c,
        probability: deal.probability_c,
        contactId: deal.contactId_c?.Id || deal.contactId_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('deals_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching deal:", response.message);
        toast.error(response.message);
        return null;
      }

      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        expectedCloseDate: deal.expectedCloseDate_c,
        probability: deal.probability_c,
        contactId: deal.contactId_c?.Id || deal.contactId_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      };
    } catch (error) {
      console.error("Error fetching deal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('deals_c', {
        records: [{
          title_c: dealData.title,
          value_c: dealData.value,
          stage_c: dealData.stage,
          expectedCloseDate_c: dealData.expectedCloseDate,
          probability_c: dealData.probability,
          contactId_c: parseInt(dealData.contactId)
        }]
      });

      if (!response.success) {
        console.error("Error creating deal:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deal records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdDeal = successful[0].data;
          // Log activity
          await this.logActivity(createdDeal.Id, "deal_created", `Deal "${dealData.title}" was created`);
          
          return {
            Id: createdDeal.Id,
            title: dealData.title,
            value: dealData.value,
            stage: dealData.stage,
            expectedCloseDate: dealData.expectedCloseDate,
            probability: dealData.probability,
            contactId: parseInt(dealData.contactId),
            createdAt: createdDeal.CreatedOn,
            updatedAt: createdDeal.ModifiedOn
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, dealData) {
    try {
      // Get current deal for activity logging
      const currentDeal = await this.getById(id);
      
      const apperClient = getApperClient();
      const updateData = {};
      
      if (dealData.title !== undefined) updateData.title_c = dealData.title;
      if (dealData.value !== undefined) updateData.value_c = dealData.value;
      if (dealData.stage !== undefined) updateData.stage_c = dealData.stage;
      if (dealData.expectedCloseDate !== undefined) updateData.expectedCloseDate_c = dealData.expectedCloseDate;
      if (dealData.probability !== undefined) updateData.probability_c = dealData.probability;
      if (dealData.contactId !== undefined) updateData.contactId_c = parseInt(dealData.contactId);

      const response = await apperClient.updateRecord('deals_c', {
        records: [{
          Id: parseInt(id),
          ...updateData
        }]
      });

      if (!response.success) {
        console.error("Error updating deal:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deal records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          // Log stage change activity
          if (currentDeal && dealData.stage && currentDeal.stage !== dealData.stage) {
            await this.logActivity(parseInt(id), "stage_change", 
              `Deal "${currentDeal.title}" moved from ${currentDeal.stage} to ${dealData.stage}`);
          }

          return await this.getById(id);
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('deals_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting deal:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deal records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('deals_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "expectedCloseDate_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contactId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }]
      });

      if (!response.success) {
        console.error("Error fetching deals by contact:", response.message);
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        expectedCloseDate: deal.expectedCloseDate_c,
        probability: deal.probability_c,
        contactId: deal.contactId_c?.Id || deal.contactId_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  async logActivity(dealId, type, description) {
    try {
      const apperClient = getApperClient();
      await apperClient.createRecord('activities_c', {
        records: [{
          Name: `${type}_${dealId}_${Date.now()}`,
          type_c: type,
          description_c: description,
          timestamp_c: new Date().toISOString(),
          dealId_c: parseInt(dealId)
        }]
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }
};