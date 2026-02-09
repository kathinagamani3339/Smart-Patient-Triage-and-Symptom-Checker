import axios from "axios";

export const getNearbyHospitals = async (lat, lng) => {
  const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

  const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
    params: {
      location: `${lat},${lng}`,
      radius: 5000,
      type: "hospital",
      key: process.env.GOOGLE_PLACES_BACKEND_KEY,
    },
  });

  return response.data.results;
};
