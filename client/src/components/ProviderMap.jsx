import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

const defaultCenter = {
  lat: 17.385,
  lng: 78.4867,
};

const ProviderMap = () => {
  const [location, setLocation] = useState(defaultCenter);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalDetails, setHospitalDetails] = useState(null);

  //  Load Google Maps
   const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_BROWSER_KEY",
  });

 
  //Fetch Nearby Clinics
 

  const fetchHospitals = async (coords) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providers/nearby?lat=${coords.lat}&lng=${coords.lng}`
      );

      setHospitals(res.data.results || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load nearby clinics");
    }
  };


  //Get User Location
 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(coords);
        fetchHospitals(coords);
      },
      () => {
        fetchHospitals(defaultCenter);
      }
    );
  }, []);

  
  // Fetch Hospital Details
 

  const fetchHospitalDetails = async (placeId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/providers/details?place_id=${placeId}`
      );

      setHospitalDetails(res.data);
    } catch (err) {
      console.error("Details error:", err);
    }
  };

  if (!isLoaded) return <h2 className="text-center mt-10">Loading Map...</h2>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={14}
    >
      {/* User Marker */}
      <Marker position={location} label="You" />

      {/* Hospitals */}
      {hospitals
        .filter((h) => h?.location)
        .map((place) => (
          <Marker
            key={place.place_id}
            position={place.location}
            onClick={() => {
              setSelectedHospital(place);
              fetchHospitalDetails(place.place_id);
            }}
          />
        ))}

      {/* Info Window */}
      {selectedHospital && hospitalDetails && (
        <InfoWindow
          position={selectedHospital.location}
          onCloseClick={() => {
            setSelectedHospital(null);
            setHospitalDetails(null);
          }}
        >
          <div className="w-64">
            {hospitalDetails.photo && (
              <img
                src={hospitalDetails.photo}
                alt="hospital"
                className="w-full h-32 object-cover rounded"
              />
            )}

            <h2 className="font-bold mt-2">
              {hospitalDetails.name}
            </h2>

          Rating: {hospitalDetails.rating || "N/A"}

            <p className="text-sm mt-1">
              {hospitalDetails.address}
            </p>

            {hospitalDetails.phone && (
              <p className="text-sm">
               {hospitalDetails.phone}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              {hospitalDetails.website && (
                <a
                  href={hospitalDetails.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm"
                >
                  Website
                </a>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospitalDetails.location.lat},${hospitalDetails.location.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 text-sm"
              >
                Directions
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default ProviderMap;
