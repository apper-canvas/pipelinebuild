import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(200);
    const newId = Math.max(...activities.map(a => a.Id)) + 1;
    const newActivity = {
      Id: newId,
      ...activityData,
      timestamp: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async getByDealId(dealId) {
    await delay(200);
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getRecent(limit = 10) {
    await delay(250);
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
};