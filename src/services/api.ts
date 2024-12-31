import axios from 'axios';

const API_URL = 'https://detect.roboflow.com/funfungi/1'; // Replace with your actual Roboflow API URL
const API_KEY = 'SdjgcwnuENZhdcsU6OQi'; // Replace with your actual Roboflow API key

export const uploadImage = async (imageFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await axios.post(`${API_URL}?api_key=${API_KEY}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error('Error uploading image: ' + (error.response?.data.message || error.message));
    } else {
      throw new Error('Error uploading image: ' + error.message);
    }
  }
};
export const getSpeciesDetermination = async (imageId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/species/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error('Error fetching species determination: ' + error.response?.data.message);
    } else {
      throw new Error('Error fetching species determination: ' + error.message);
    }
  }
};