import axios from 'axios';

export const getProfile = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/auth/extract`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200 ? Boolean(response.data) : false;
  } catch (error) {
    console.error("Error fetching:", error);
    return false;
  }
};
