import axios from "axios";
const api_url = 'https://odd-rose-magpie-veil.cyclic.app'
export const createReward = async (item) => {
  return await axios.post(`${api_url}/item/create`, item);
};

export const deleteReward = async (rewardId) => {
  return await axios.delete(
    `${api_url}/item/delete/${rewardId}`
  );
};

export const getRewardList = async () => {
  try {
    const { data } = await axios.get(`${api_url}/item`);
    return data;
  } catch (error) {
    console.log("[rewardService] getRewardList error ==> ", error);
  }
};
