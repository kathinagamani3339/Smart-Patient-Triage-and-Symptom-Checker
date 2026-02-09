import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
//reads google api key  from .env
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_BACKEND_KEY;

// Get nearby clinics/hospitals
export const getNearbyClinics = async (req, res) => {
  try {
    const { lat, lng, urgency } = req.query; 

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    // Determine type & keyword based on urgency
    let type = "hospital";
    let keyword = "hospital";
    if (urgency === "Moderate") {
      type = "hospital";
      keyword = "clinic|doctor";
    } else if (urgency === "Low") {
      type = "hospital";
      keyword = "clinic|health|doctor";
    }

    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000, // 5 km
        type,
        keyword,
        key: GOOGLE_API_KEY,
      },
    });

    // Filter and clean results
    const cleanedResults = response.data.results
      .filter((place) => place?.geometry?.location)
      .map((place) => ({
        place_id: place.place_id,
        name: place.name,
        vicinity: place.vicinity,
        location: place.geometry.location,
        rating: place.rating ?? "N/A",
        openNow: place.opening_hours?.open_now ?? "Unknown",
      }));

    res.status(200).json({ results: cleanedResults });
  } catch (error) {
    console.error("Google Places Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch nearby clinics" });
  }
};

// Get details for a single provider
export const getProviderDetails = async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) return res.status(400).json({ message: "place_id is required" });

    const url = "https://maps.googleapis.com/maps/api/place/details/json";
    const response = await axios.get(url, {
      params: {
        place_id,
        fields:
          "name,formatted_address,formatted_phone_number,geometry,rating,website,opening_hours,photos,reviews",
        key: GOOGLE_API_KEY,
      },
    });

    const place = response.data.result;
    if (!place) return res.status(404).json({ message: "Provider not found" });

    const photo =
      place.photos?.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : "https://via.placeholder.com/400x250?text=No+Image";

    const cleanedData = {
      place_id,
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number ?? "Not Available",
      rating: place.rating ?? "N/A",
      website: place.website ?? null,
      openNow: place.opening_hours?.open_now ?? "Unknown",
      openingHours: place.opening_hours?.weekday_text ?? [],
      photo,
      location: place.geometry?.location,
      reviews: place.reviews?.slice(0, 3) ?? [],
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`,
    };

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error("Place Details Error:", error.message);
    res.status(500).json({ message: "Failed to fetch provider details" });
  }
};
