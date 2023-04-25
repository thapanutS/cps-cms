import axios from "axios";
const api_url = "https://odd-rose-magpie-veil.cyclic.app";
export const createEvent = async (event) => {
  return await axios.post(`${api_url}/event/create`, event);
};

export const getEventList = async () => {
  try {
    const { data } = await axios.get(`${api_url}/event`);
    return data;
  } catch (error) {
    console.log("[eventService] getEventList error ==> ", error);
  }
};

export const getEventById = async (id) => {
  try {
    const { data } = await axios.get(`${api_url}/event/${id}`);
    return data;
  } catch (error) {
    console.log("[eventService] getEventById error ==> ", error);
  }
};

export const updateEvent = async (eventEdited) => {
  try {
    return await axios.patch(`${api_url}/event/update`, eventEdited);
  } catch (error) {
    console.log("[eventService] updateEvent error ==> ", error);
  }
};

export const multicastEvent = async (payload) => {
  try {
    return await axios.post(`${api_url}/event/multicast`, payload);
  } catch (error) {
    console.log("[eventService] updateEvent error ==> ", error);
  }
};
