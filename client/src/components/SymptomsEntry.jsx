import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// api configuration
const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/diagnosis`;

const analyzeSymptomsAPI = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/analyze`, payload);
  return response.data;
};

const SymptomsEntry = () => {
  const navigate = useNavigate();

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

  const handleNext = async () => {
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

    // basic Validation
    if (!symptomsArray.length) {
      alert("Enter at least one symptom");
      return;
    }

    if (!numericAge || numericAge < 1 || numericAge > 120) {
      alert("Enter a valid age");
      return;
    }

    if (!gender) {
      alert("Select gender");
      return;
    }

    if (!numericHeight || !numericWeight) {
      alert("Enter height and weight");
      return;
    }

    if (!symptomDuration) {
      alert("Select symptom duration");
      return;
    }

    if (!painSeverity) {
      alert("Select pain severity");
      return;
    }

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
    };

    try {
      setLoading(true);
      // After API call
      const triageData = await analyzeSymptomsAPI(payload);
      navigate("/triageresult", { state: { triageData } });
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to analyze symptoms. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
                 bg-[url('/bg_image.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-[rgb(58_72_74_/_54%)] p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-white text-center">
          Enter Your Health Information
        </h2>

        {/* Symptoms */}
        <textarea
          placeholder="Symptoms (comma separated)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
          className="w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)] text-white placeholder-white/50"
        />

        {/* Age, Height, Weight */}
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-1/3 border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-1/3 border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-1/3 border p-3 rounded-xl bg-[rgb(100_176_194)] text-white placeholder-white/50"
          />
        </div>

        {/* Gender */}
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

        {/* Medical History */}
        <input
          type="text"
          placeholder="Medical History (comma separated)"
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          className="w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)] text-white placeholder-white/50"
        />

        {/* Current Medications */}
        <input
          type="text"
          placeholder="Current Medications (comma separated)"
          value={currentMedications}
          onChange={(e) => setCurrentMedications(e.target.value)}
          className="w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)] text-white placeholder-white/50"
        />

        {/* Allergies */}
        <input
          type="text"
          placeholder="Allergies (comma separated)"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full border p-3 rounded-xl mb-3 bg-[rgb(100_176_194)] text-white placeholder-white/50"
        />

        {/* Symptom Duration */}
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

        {/* Lifestyle */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-white mb-2">
            <input
              type="checkbox"
              checked={smoking}
              onChange={(e) => setSmoking(e.target.checked)}
            />
            Smoking
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
  );
};

export default SymptomsEntry;
