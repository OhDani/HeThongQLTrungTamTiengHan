import { notificationApi } from "./api"; 

export const getNotifications = async () => {
  return await notificationApi.getAll();
};

export const getNotificationById = async (id) => {
  const data = await notificationApi.getById(id);
  return Array.isArray(data) ? data[0] : data; 
};