import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// google api key
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_BACKEND_KEY;
console.log("Google API Key loaded");

// Get nearby clinics/hospitals
export const getNearbyClinics = async (req, res) => {
  try {
    const { lat, lng, urgency } = req.query;
    console.log("Nearby clinics request received:", { lat, lng, urgency });

    // Validate required params
    if (!lat || !lng) {
      console.warn("Latitude or Longitude missing");
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required" });
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

    console.log("Searching nearby places with:", { type, keyword });

    // Call Google Places API
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000, // 5 km radius
        type,
        keyword,
        key: GOOGLE_API_KEY,
      },
    });

    console.log("Raw nearby places response received");

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

    console.log(`Returning ${cleanedResults.length} nearby places`);
    res.status(200).json({ results: cleanedResults });
  } catch (error) {
    console.error(
      "Google Places Error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ message: "Failed to fetch nearby clinics" });
  }
};

// Get details for a single provider
export const getProviderDetails = async (req, res) => {
  try {
    const { place_id } = req.query;
    console.log("Provider details request received for place_id:", place_id);

    // Validate place_id
    if (!place_id) {
      console.warn("place_id missing in request");
      return res.status(400).json({ message: "place_id is required" });
    }

    // Call Google Place Details API
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

    if (!place) {
      console.warn(`Provider not found for place_id: ${place_id}`);
      return res.status(404).json({ message: "Provider not found" });
    }
    // Build photo URL
    const photo =
      place.photos?.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : "https://via.placeholder.com/400x250?text=No+Image";

    // Cleaned provider data
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

    console.log("Returning cleaned provider details:", cleanedData.name);
    res.status(200).json(cleanedData);
  } catch (error) {
    console.error("Place Details Error:", error.message);
    res.status(500).json({ message: "Failed to fetch provider details" });
  }
};
