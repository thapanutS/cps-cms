import axios from "axios";
const api_url = 'https://odd-rose-magpie-veil.cyclic.app'
export const getClaimList = async () => {
  try {
    const { data } = await axios.get(`${api_url}/claim`);
    return data;
  } catch (error) {
    console.log("[claimService] getClaimList error ==> ", error);
  }
};

export const confirmClaim = async (payload) => {
  try {
    return await axios.patch(
      `${api_url}/claim/confirm`,
      payload
    );
  } catch (error) {
    console.log("[claimService] confirmClaim error ==> ", error);
  }
};

export const cancelClaim = async (payload) => {
  try {
    return await axios.patch(
      `${api_url}/claim/cancel`,
      payload
    );
  } catch (error) {
    console.log("[claimService] cancelClaim error ==> ", error);
  }
};
