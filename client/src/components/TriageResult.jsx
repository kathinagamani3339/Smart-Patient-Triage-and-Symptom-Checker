import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const TriageResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Get triage data
  const triageData = state?.triageData;

  if (!triageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-center">
          No triage data available. <br />
          Please go back and enter symptoms.
        </p>
      </div>
    );
  }

 // data extraction
  const possibleConditions = Array.isArray(triageData.conditions)
    ? triageData.conditions
    : [];

  const adviceList = Array.isArray(
    triageData.generalAdvice?.recommendedActions
  )
    ? triageData.generalAdvice.recommendedActions
    : [];

  const patientInfo = triageData.patientInfo || {};

 // overall urgency
  const overallUrgency = possibleConditions.some(
    (c) => c.riskLevel === "High"
  )
    ? "High"
    : possibleConditions.some((c) => c.riskLevel === "Medium")
    ? "Medium"
    : "Low";

  const urgencyColor = {
    High: "bg-red-500 text-white",
    Medium: "bg-yellow-400 text-black",
    Low: "bg-green-500 text-white",
  };
// pdf doenload
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Triage Result Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Overall Urgency: ${overallUrgency}`, 20, 40);

    doc.text("Patient Info:", 20, 55);
    doc.text(`Age: ${patientInfo.age || "-"}`, 25, 65);
    doc.text(`Gender: ${patientInfo.gender || "-"}`, 25, 73);
    doc.text(`Height: ${patientInfo.height || "-"} cm`, 25, 81);
    doc.text(`Weight: ${patientInfo.weight || "-"} kg`, 25, 89);
    doc.text(`Symptom Duration: ${patientInfo.symptomDuration || "-"}`, 25, 97);
    doc.text(`Pain Severity: ${patientInfo.painSeverity || "-"}`, 25, 105);

    if (patientInfo.lifestyle) {
      doc.text("Lifestyle:", 25, 115);
      doc.text(
        `Smoking: ${patientInfo.lifestyle.smoking ? "Yes" : "No"}`,
        30,
        123
      );
      doc.text(
        `Alcohol: ${patientInfo.lifestyle.alcohol || "-"}`,
        30,
        131
      );
      doc.text(
        `Exercise: ${patientInfo.lifestyle.exercise || "-"}`,
        30,
        139
      );
      doc.text(`Diet: ${patientInfo.lifestyle.diet || "-"}`, 30, 147);
    }

    doc.text("Advice:", 20, 160);
    adviceList.forEach((a, i) => {
      doc.text(`- ${a}`, 25, 170 + i * 8);
    });

    doc.text("Possible Conditions:", 20, 200);
    possibleConditions.forEach((c, i) => {
      doc.text(`- ${c.condition} (${c.riskLevel})`, 25, 210 + i * 8);
    });

    doc.save("triage-result.pdf");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
                 bg-[url('/bg_image.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="bg-[rgb(153_228_242_/_54%)] w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Triage Result</h2>

        {/* Overall Urgency */}
        <div
          className={`p-4 rounded text-center mb-4 ${urgencyColor[overallUrgency]}`}
        >
          <p className="text-lg font-semibold">{overallUrgency} Urgency</p>
        </div>

        {/* Patient Info */}
       
        <div className="mb-6 p-4 rounded bg-[rgb(100_176_194)] text-gray-900">
          <h3 className="font-semibold mb-2">Patient Information :</h3>
          <p>Age: {patientInfo.age || "-"}</p>
          <p>Gender: {patientInfo.gender || "-"}</p>
          <p>Height: {patientInfo.height || "-"} cm</p>
          <p>Weight: {patientInfo.weight || "-"} kg</p>
          <p>Symptom Duration: {patientInfo.symptomDuration || "-"}</p>
          <p>Pain Severity: {patientInfo.painSeverity || "-"}</p>

          {patientInfo.lifestyle && (
            <div className="mt-2">
              <p>Smoking: {patientInfo.lifestyle.smoking ? "Yes" : "No"}</p>
              <p>Alcohol: {patientInfo.lifestyle.alcohol || "-"}</p>
              <p>Exercise: {patientInfo.lifestyle.exercise || "-"}</p>
              <p>Diet: {patientInfo.lifestyle.diet || "-"}</p>
            </div>
          )}
        </div>
        {/* Advice */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Recommended Advice</h3>
          {adviceList.length > 0 ? (
            <ul className="list-disc list-inside text-gray-900">
              {adviceList.map((advice, index) => (
                <li key={index}>{advice}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No advice available</p>
          )}
        </div>

        {/* Conditions */}
        <h3 className="font-semibold mb-3">Possible Conditions</h3>

        {possibleConditions.length > 0 ? (
          possibleConditions.map((condition, index) => {
            const matchingSymptoms = Array.isArray(
              condition.matchingSymptoms
            )
              ? condition.matchingSymptoms
              : [];

            return (
              <div
                key={index}
                className="border p-4 rounded mb-3 bg-[rgb(100_176_194)]"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{condition.condition}</p>

                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      urgencyColor[condition.riskLevel]
                    }`}
                  >
                    {condition.riskLevel}
                  </span>
                </div>

                {matchingSymptoms.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600">
                      Matching Symptoms:
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1">
                      {matchingSymptoms.map((symptom, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No conditions matched your symptoms.</p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={downloadPDF}
            className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>

          <button
            onClick={() =>
              navigate("/providermap", { state: { urgency: overallUrgency } })
            }
            className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Find Nearby Places
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-4">
          {triageData.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default TriageResult;
