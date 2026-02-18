import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";

const ProviderMap = () => {
  const { state } = useLocation();
  const urgency = state?.urgency || "Low"; // Urgency passed from previous page

  // Load Google Maps API
  const LIBRARIES = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    libraries: LIBRARIES,
  });

  // Map and marker states
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // User's current location
  const [locationStatus, setLocationStatus] = useState(null);
  const [websiteMessage, setWebsiteMessage] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    const allowLocation = window.confirm(
      "This page needs your location to show nearby clinics. Allow location access?",
    );

    if (!allowLocation) {
      setTimeout(() => {
        setLocationStatus("denied");
      }, 0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(loc);
        setUserLocation(loc);
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      },
    );
  }, []);

  // Fetch nearby providers when map is loaded or center changes
  useEffect(() => {
    if (!map || !center || locationStatus !== "granted") return;

    const fetchNearbyProviders = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/providers/nearby`,
          {
            params: { lat: center.lat, lng: center.lng, urgency },
          },
        );
        setMarkers(res.data.results || []);
      } catch (err) {
        console.error("Error fetching nearby providers:", err.message);
      }
    };

    fetchNearbyProviders();
  }, [map, center, urgency, locationStatus]);

  if (!isLoaded) return <div>Loading map...</div>;

  if (locationStatus === "denied") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">Location permission denied. Unable to show nearby clinics.</div>
    );
  }

  // Helper: get today's opening hours from provider data
  const getTodaysHours = (openingHours) => {
    if (!openingHours || !openingHours.length) return "Hours Unknown";
    const dayIndex = new Date().getDay(); // Sunday = 0
    return openingHours[dayIndex === 0 ? 6 : dayIndex - 1]; // Google array starts Mon = 0
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100vh" }}
      center={center}
      zoom={13}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {/* User Marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Blue marker for user
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      )}

      {/* Nearby Provider Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.place_id}
          position={marker.location}
          onClick={async () => {
            try {
              const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/providers/details`,
                { params: { place_id: marker.place_id } },
              );
              setSelectedMarker(res.data);
            } catch (err) {
              console.error("Error fetching provider details:", err.message);
            }
          }}
        />
      ))}

      {/* InfoWindow for selected provider */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.location}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="max-w-xs font-sans bg-white rounded-xl shadow-lg p-4">
            {/* Provider Image */}
            {selectedMarker.photo && (
              <img
                src={selectedMarker.photo}
                alt={selectedMarker.name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
            )}

            {/* Provider Details */}
            <h3 className="text-lg font-bold">{selectedMarker.name}</h3>
            <p className="text-gray-700 text-sm mt-1">
              {selectedMarker.address}
            </p>
            <p
              className={`mt-1 text-sm font-semibold ${
                selectedMarker.openNow === true
                  ? "text-green-600"
                  : selectedMarker.openNow === false
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {selectedMarker.openNow === true
                ? "Open Now"
                : selectedMarker.openNow === false
                  ? "Closed"
                  : "Hours Unknown"}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              📞 {selectedMarker.phone}
            </p>
            {selectedMarker.rating && (
              <p className="text-yellow-500 font-semibold mt-1">
                {"★".repeat(Math.floor(selectedMarker.rating))}{" "}
                <span className="text-gray-500">({selectedMarker.rating})</span>
              </p>
            )}

            {selectedMarker.openingHours && (
              <div className="mt-2 text-gray-600 text-xs">
                <strong>Today's Hours:</strong>
                <p>{getTodaysHours(selectedMarker.openingHours)}</p>
              </div>
            )}

            {/* Directions and Website Buttons */}
            <div className="flex justify-between mt-3">
              <a
                href={selectedMarker.directionsUrl}
                target="_blank"
                className="flex-1 mr-1 text-center bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
              >
                Directions
              </a>
              <>
                <a
                  href={selectedMarker.website || "#"}
                  target="_blank"
                  onClick={(e) => {
                    if (!selectedMarker.website) {
                      e.preventDefault();
                      setWebsiteMessage(true);
                      setTimeout(() => setWebsiteMessage(false), 2000);
                    }
                  }}
                  className="flex-1 ml-1 text-center bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-xs"
                >
                  Website
                </a>

                {websiteMessage && (
                  <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
                    <div className="bg-white px-6 py-3 rounded-lg shadow-lg text-center font-semibold">
                      website not available.
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default ProviderMap;
