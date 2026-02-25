import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// API configuration
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/diagnosis`;

// Function to call analyze symptoms API
const analyzeSymptomsAPI = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/analyze`, payload);
  return response.data;
};

const SymptomsEntry = () => {
  const navigate = useNavigate();

  // Form state
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [painSeverity, setPainSeverity] = useState("");
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState("");
  const [exercise, setExercise] = useState("");
  const [diet, setDiet] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission and navigate to Triage Result
  const handleNext = async () => {
    // Convert comma-separated strings to arrays
    const symptomsArray = symptoms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const medicalHistoryArray = medicalHistory
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const medicationsArray = currentMedications
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allergiesArray = allergies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const numericAge = Number(age);
    const numericHeight = Number(height);
    const numericWeight = Number(weight);

    // Basic Validation
    if (!symptomsArray.length) return alert("Enter at least one symptom"); 
    if (!numericAge || numericAge < 1 || numericAge > 120)
      return alert("Enter a valid age");
    if (!gender) return alert("Select gender");
    if (!numericHeight || !numericWeight)
      return alert("Enter height and weight");
    if (!symptomDuration) return alert("Select symptom duration");
    if (!painSeverity) return alert("Select pain severity");

    // Construct payload for API
    const token = localStorage.getItem("token");
    const payload = {
      symptoms: symptomsArray,
      patientInfo: {
        age: numericAge,
        gender,
        height: numericHeight,
        weight: numericWeight,
        medicalHistory: medicalHistoryArray,
        currentMedications: medicationsArray,
        allergies: allergiesArray,
        lifestyle: { smoking, alcohol, exercise, diet },
        symptomDuration,
        painSeverity,
      },
      lang: "en",
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 important
        },
    };

    try {
      setLoading(true); 
      // Call backend API
      const triageData = await analyzeSymptomsAPI(payload);
      // Navigate to Triage Result page with data
      navigate("/triageresult", { state: { triageData } });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to analyze symptoms. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Background container */}
      <div
        className="min-h-screen flex items-center justify-center p-4
                 bg-[url('/bg_image.jpg')] bg-cover bg-center bg-no-repeat"
      >
        {/* Form container with semi-transparent background */}
        <div className="bg-[rgb(58_72_74_/_54%)] p-6 rounded-xl w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4 text-white text-center">
            Enter Your Health Information
          </h2>

          {/* Symptoms Input */}
          <label className="text-white block mb-1">
            Symptoms <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Symptoms (comma separated)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            className="w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)] text-white placeholder-white/50"
          />

          {/* Age, Height, Weight Inputs */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 flex flex-col">
              <label className="text-white mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-white mb-1">
                Height <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-white mb-1">
                Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
              />
            </div>
          </div>

          {/* Gender Select */}
          <label className="text-white block mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)]
  ${gender === "" ? "text-white/50" : "text-white"}`}
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>

          {/* Medical History Input */}
          <div className="mb-3">
            <label className="text-white block mb-1">
              Medical History <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Medical History (comma separated)"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              className="w-full border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
            />
          </div>

          {/* Current Medications Input */}
          <div className="mb-3">
            <label className="text-white block mb-1">
              Current Medications <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Current Medications (comma separated)"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              className="w-full border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
            />
          </div>

          {/* Allergies Input */}
          <div className="mb-3">
            <label className="text-white block mb-1">
              Allergies <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Allergies (comma separated)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
            />
          </div>

          {/* Symptom Duration */}
          <label className="text-white block mb-1">
            Symptom Duration <span className="text-red-500">*</span>
          </label>
          <select
            value={symptomDuration}
            onChange={(e) => setSymptomDuration(e.target.value)}
            className={`w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)]
  ${symptomDuration === "" ? "text-white/50" : "text-white"}`}
          >
            <option value="">Symptom Duration</option>
            <option value="less_than_24h">Less than 24 hours</option>
            <option value="1_3_days">1–3 days</option>
            <option value="4_7_days">4–7 days</option>
            <option value="more_than_week">More than a week</option>
          </select>

          {/* Pain Severity */}
          <label className="text-white block mb-1">
            Pain Severity <span className="text-red-500">*</span>
          </label>
          <select
            value={painSeverity}
            onChange={(e) => setPainSeverity(e.target.value)}
            className={`w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)]
  ${painSeverity === "" ? "text-white/50" : "text-white"}`}
          >
            <option value="">Pain Severity</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>

          {/* Lifestyle Section */}
          <div className="mb-4">
            {/* Smoking */}
            <label className="text-white block mb-1">
              Smoking <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center gap-2 text-white mb-2">
              <input
                type="checkbox"
                checked={smoking}
                onChange={(e) => setSmoking(e.target.checked)}
              />
              Smoking
            </label>

            {/* Alcohol */}
            <label className="text-white block mb-1">
              Alcohol Consumption <span className="text-red-500">*</span>
            </label>
            <select
              value={alcohol}
              onChange={(e) => setAlcohol(e.target.value)}
              className={`w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)]
  ${alcohol === "" ? "text-white/50" : "text-white"}`}
            >
              <option value="">Alcohol Consumption</option>
              <option value="none">None</option>
              <option value="occasional">Occasional</option>
              <option value="frequent">Frequent</option>
            </select>

            {/* Exercise */}
            <label className="text-white block mb-1">
              Exercise Level <span className="text-red-500">*</span>
            </label>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className={`w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)]
  ${exercise === "" ? "text-white/50" : "text-white"}`}
            >
              <option value="">Exercise Level</option>
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
            </select>

            {/* Diet */}
            <label className="text-white block mb-1">
              Diet Type <span className="text-red-500">*</span>
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className={`w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)]
  ${diet === "" ? "text-white/50" : "text-white"}`}
            >
              <option value="">Diet Type</option>
              <option value="balanced">Balanced</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-500 text-white p-3 rounded-xl w-1/2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsEntry;
