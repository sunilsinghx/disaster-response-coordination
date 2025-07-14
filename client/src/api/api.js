import axios from "axios";


const axiosClient = axios.create({
  baseURL: "http://localhost:3000", // change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});



export async function geocodeLocation(text) {
  const res = await axiosClient.post("/geocode", {
    description:text,
  });
  return res.data; // expects { latitude, longitude }
}

export const createDisaster = async (
  title,
  location,
  latitude,
  longitude,
  description,
  tagsArray
) => {

  
 const res = await axiosClient.post("/disasters", {
    title,
    location_name: location,
    location: { latitude, longitude },
    description,
    tags: tagsArray,
  });
  return res
};

export const getDisasterList = async (tag) => {
  const res = await axiosClient.get(`/disasters?tag=${tag}`);
  return res.data;
};

export const createReport = async (
  disasterId,
  content,
  imageUrl,
  currentUser,verified

) => {
  try {
    const res = await axiosClient.post(`/disasters/${disasterId}/reports`, {
      disasterId,
      content,
      imageUrl,
      user_id: currentUser.user_id,
      verified
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getResourceList = async (disaster) => {
  
  const res = await axiosClient.get(`/disasters/${disaster.id}/resources`, {
    params: {
      lat: disaster.latitude,
      lon: disaster.longitude,
    },
  });
  return res.data;
};

export const getSocialMediaPost=async(disasterId)=>
{
  const res = await axiosClient
  .get(`/disasters/${disasterId}/social-media`)

  return  res.data
}

export const getReports=async(disasterId)=>{
  try {
    const res = await axiosClient.get(`/disasters/${disasterId}/reports`);
    return res.data
  } catch (err) {
    console.error("Failed to fetch reports:", err);
  } 
}

export const updateDisaster=async( 
  id,title,
  location,
 
  description,
  tagsArray)=>{
    
    await axiosClient.put(`disasters/${id}`, {
      id,
      title,
      location_name: location,
      description,
      tags: tagsArray,
    });

  }
export const deleteDisaster=async(id)=>{
  await axiosClient.delete(`disasters/${id}`); 
}


export const verifyImage= async(imageUrl,disaster)=>{

  const res = await axiosClient.post(`/disasters/${disaster.id}/verify-image`,{
    imageUrl
  })
  return res.data
}

export default axiosClient;
