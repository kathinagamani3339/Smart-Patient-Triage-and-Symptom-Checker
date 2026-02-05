import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// get near by clinics
export const getNearbyClinics = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const response = await axios.get(url, {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        type: "hospital",
        key: GOOGLE_API_KEY,
      },
    });

    // // Handle Google errors
    // if (response.data.status !== "OK") {
    //   return res.status(400).json({
    //     message: response.data.status,
    //   });
    // }
   // remove broken places
    const cleanedResults = response.data.results
      .filter((place) => place?.geometry?.location)
      .map((place) => ({
        place_id: place.place_id,
        name: place.name,
        rating: place.rating,
        vicinity: place.vicinity,
        location: place.geometry.location,
      }));
    res.status(200).json({ results: cleanedResults});
  } catch (error) {
    console.error(
      "Google Places Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to fetch nearby clinics",
    });
  }
};

// get hospitals details
export const getProviderDetails = async (req, res) => {
  try {
    const { place_id } = req.query;

    if (!place_id) {
      return res.status(400).json({
        message: "place_id is required",
      });
    }
  const url ="https://maps.googleapis.com/maps/api/place/details/json";
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id,
          fields:
            "name,formatted_address,formatted_phone_number,geometry,rating,website,opening_hours,photos,reviews",
          key: process.env.GOOGLE_PLACES_API_KEY,
        },
      }
    );

    if (!response.data.result) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const place = response.data.result;

    const photo =
      place.photos?.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        : "https://via.placeholder.com/400x250?text=No+Image";

    const cleanedData = {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number ?? "Not Available",
      rating: place.rating ?? "N/A",
      website: place.website ?? null,
      openNow: place.opening_hours?.open_now ?? "Unknown",
      photo,
      location: place.geometry?.location,
      reviews: place.reviews?.slice(0, 3) ?? [],
    };

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error("Place Details Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch provider details",
    });
  }
};


