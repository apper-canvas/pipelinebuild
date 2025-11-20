import dealsData from "@/services/mockData/deals.json";
import { activityService } from "./activityService";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newId = Math.max(...deals.map(d => d.Id)) + 1;
    const newDeal = {
      Id: newId,
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    
    // Log activity
    await activityService.create({
      dealId: newId,
      type: "deal_created",
      description: `Deal "${newDeal.title}" was created`
    });
    
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const oldDeal = { ...deals[index] };
    deals[index] = {
      ...deals[index],
      ...dealData,
      updatedAt: new Date().toISOString()
    };
    
    // Log stage change activity
    if (oldDeal.stage !== dealData.stage) {
      await activityService.create({
        dealId: parseInt(id),
        type: "stage_change",
        description: `Deal "${deals[index].title}" moved from ${oldDeal.stage} to ${dealData.stage}`
      });
    }
    
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    deals.splice(index, 1);
    return true;
  },

  async getByContactId(contactId) {
    await delay(200);
    return deals.filter(d => d.contactId === parseInt(contactId));
  }
};