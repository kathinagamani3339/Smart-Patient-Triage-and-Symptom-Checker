import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Load API key safely
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_BACKEND_KEY;

if (!GOOGLE_API_KEY) {
  console.error("Google API key is missing in environment variables");
  process.exit(1); // Stop server if key is missing
}
//get nearby clinics or hospitals

export const getNearbyClinics = async (req, res) => {
  try {
    let { lat, lng, urgency } = req.query;

    console.log("Nearby request:", { lat, lng, urgency });

    //Validate params
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required" });
    }

    //Convert to numbers
    lat = Number(lat);
    lng = Number(lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res
        .status(400)
        .json({ message: "Invalid latitude or longitude values" });
    }

    //Adjust radius based on urgency

    let radius = 5000; // default 5km

    if (urgency === "High") {
      radius = 3000; // closer hospitals
    } else if (urgency === "Medium") {
      radius = 5000;
    } else if (urgency === "Low") {
      radius = 8000; // more options
    }

    console.log(`Searching hospitals within ${radius} meters`);

    //Call Google Nearby Search API

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          type: "hospital",
          key: GOOGLE_API_KEY,
        },
      },
    );

    if (!response.data.results) {
      return res.status(500).json({
        message: "Invalid response from Google Places API",
      });
    }
    //clean result

    const cleanedResults = response.data.results
      .filter((place) => place?.geometry?.location)
      .slice(0, 10) // prevent map overload
      .map((place) => ({
        place_id: place.place_id,
        name: place.name,
        address: place.vicinity,
        location: place.geometry.location,
        rating: place.rating ?? "N/A",
        openNow: place.opening_hours?.open_now ?? "Unknown",
      }));

    console.log(`Returning ${cleanedResults.length} providers`);

    res.status(200).json({
      count: cleanedResults.length,
      results: cleanedResults,
    });
  } catch (error) {
    console.error(
      "Google Places Error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      message: "Failed to fetch nearby healthcare providers",
    });
  }
};
//get provider details
export const getProviderDetails = async (req, res) => {
  try {
    const { place_id } = req.query;

    console.log("Provider details request:", place_id);

    if (!place_id) {
      return res.status(400).json({
        message: "place_id is required",
      });
    }

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id,
          fields:
            "name,formatted_address,formatted_phone_number,geometry,rating,website,opening_hours,photos,reviews",
          key: GOOGLE_API_KEY,
        },
      },
    );

    const place = response.data.result;

    if (!place) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }
    //build photo url

    const photo =
      place.photos?.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : "https://via.placeholder.com/400x250?text=No+Image";
    //clean provider data

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

    console.log("Returning provider:", cleanedData.name);

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error(
      "Place Details Error:",
      error.response?.data || error.message,
    );

    res.status(500).json({
      message: "Failed to fetch provider details",
    });
  }
};
