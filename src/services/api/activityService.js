import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activities_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching activities:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c || activity.CreatedOn,
        dealId: activity.dealId_c?.Id || activity.dealId_c
      }));
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('activities_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching activity:", response.message);
        toast.error(response.message);
        return null;
      }

      const activity = response.data;
      return {
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c || activity.CreatedOn,
        dealId: activity.dealId_c?.Id || activity.dealId_c
      };
    } catch (error) {
      console.error("Error fetching activity:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('activities_c', {
        records: [{
          Name: activityData.name || `${activityData.type}_${Date.now()}`,
          type_c: activityData.type,
          description_c: activityData.description,
          timestamp_c: activityData.timestamp || new Date().toISOString(),
          dealId_c: activityData.dealId ? parseInt(activityData.dealId) : undefined
        }]
      });

      if (!response.success) {
        console.error("Error creating activity:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activity records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdActivity = successful[0].data;
          return {
            Id: createdActivity.Id,
            type: activityData.type,
            description: activityData.description,
            timestamp: activityData.timestamp || new Date().toISOString(),
            dealId: activityData.dealId ? parseInt(activityData.dealId) : undefined
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activities_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "dealId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(dealId)]
        }],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching activities by deal:", response.message);
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c || activity.CreatedOn,
        dealId: activity.dealId_c?.Id || activity.dealId_c
      }));
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getRecent(limit = 10) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('activities_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: { limit: limit, offset: 0 }
      });

      if (!response.success) {
        console.error("Error fetching recent activities:", response.message);
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c || activity.CreatedOn,
        dealId: activity.dealId_c?.Id || activity.dealId_c
      }));
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error);
      return [];
    }
  }
};