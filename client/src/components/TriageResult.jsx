import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const TriageResult = () => {
  const location = useLocation();

  // Always fallback to empty array
  const symptoms = location.state?.symptoms || [];
  const navigate = useNavigate();

  // Handle empty state (very important)
  if (!symptoms || symptoms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          No symptoms selected. Please go back and select symptoms.
        </p>
      </div>
    );
  }

  let urgency = "Low";
  let color = "bg-green-100 text-green-700";
  let recommendation = "Monitor symptoms at home.";

  if (
    symptoms.includes("Chest Pain") ||
    symptoms.includes("Shortness of breath")
  ) {
    urgency = "High";
    color = "bg-red-100 text-red-700";
    recommendation = "Seek emergency medical care immediately.";
  } else if (symptoms.length >= 3) {
    urgency = "Medium";
    color = "bg-yellow-100 text-yellow-700";
    recommendation = "Consult a doctor within 24 hours.";
  }
  // PDF Download function
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Triage Result Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Urgency Level: ${urgency}`, 20, 40);
    doc.text("Recommended Next Steps:", 20, 55);
    doc.text(recommendation, 20, 65);

    doc.text("Selected Symptoms:", 20, 85);

    symptoms.forEach((symptom, index) => {
      doc.text(`- ${symptom}`, 25, 95 + index * 8);
    });

    doc.save("triage-result.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Triage Result</h2>
        <p className="text-sm mb-3">
          Based on your Symptoms, here are the possible conditions:
        </p>

        {/* Urgency */}
        <div className={`p-4 rounded text-center ${color}`}>
          <p className="text-lg font-semibold">{urgency} Urgency</p>
        </div>

        {/* Recommendation */}
        <p className="mt-4 text-gray-700">{recommendation}</p>

        {/* Selected Symptoms */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Selected Symptoms</h3>
          <ul className="list-disc list-inside text-gray-600">
            {symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>
        {/* Download PDF Button */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={downloadPDF}
            className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>

          <button
            onClick={() => navigate("/providermap")}
            className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Find Nearby Places
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriageResult;
