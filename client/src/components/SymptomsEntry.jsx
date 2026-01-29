import React, { useState } from "react";

const symptomsList = [
  "Fever",
  "Headache",
  "Cough",
  "Sore throat",
  "Body pain",
  "Fatigue",
  "Nausea",
  "Shortness of breath",
];

const SymptomsEntry = () => {
  const [search, setSearch] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const filteredSymptoms = symptomsList.filter((symptom) =>
    symptom.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-md p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">
          Select Your Symptoms
        </h2>

        <input
          type="text"
          placeholder="Search symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredSymptoms.map((symptom) => (
            <label
              key={symptom}
              className="flex items-center gap-2 border p-2 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
              />
              {symptom}
            </label>
          ))}
        </div>

        <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded">
          Continue
        </button>
      </div>
    </div>
  );
};

export default SymptomsEntry;
