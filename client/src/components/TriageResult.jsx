import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
// import ProviderMap from "./ProviderMap";

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

  const adviceList = Array.isArray(triageData.generalAdvice?.recommendedActions)
    ? triageData.generalAdvice.recommendedActions
    : [];

  const patientInfo = triageData.patientInfo || {};

  // overall urgency
  const overallUrgency = possibleConditions.some((c) => c.riskLevel === "High")
    ? "High"
    : possibleConditions.some((c) => c.riskLevel === "Moderate")
      ? "Moderate"
      : "Low";

  const urgencyColor = {
    High: "bg-red-500 text-black",
    Moderate: "bg-yellow-400 text-black",
    Low: "bg-green-500 text-black",
  };
  // pdf doenload
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header part in pdf
    doc.setFillColor(30, 64, 175); // blue header
    doc.rect(0, 0, 210, 30, "F");

    doc.setFont("helvetica", "bold"); //font family
    doc.setFontSize(20); // font size is 20
    doc.setTextColor(255, 255, 255); //text color is white
    doc.text("AI TRIAGE REPORT", 105, 18, { align: "center" });

    doc.setTextColor(0, 0, 0);

    let y = 45;

  // urgency box
    const urgencyColors = {
      High: [220, 38, 38],
      Moderate: [234, 179, 8],
      Low: [34, 197, 94],
    };

    const color = urgencyColors[overallUrgency] || [100, 100, 100];

    doc.setFillColor(...color);
    doc.rect(14, y - 8, 182, 12, "F");

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`Overall Urgency: ${overallUrgency}`, 105, y, {
      align: "center",
    });

    doc.setTextColor(0, 0, 0);
    y += 15;

    //patient information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Patient Information", 14, y);

    y += 8;
    doc.setFont("helvetica", "normal");

    const patientLines = [
      `Age: ${patientInfo.age || "-"}`,
      `Gender: ${patientInfo.gender || "-"}`,
      `Height: ${patientInfo.height || "-"} cm`,
      `Weight: ${patientInfo.weight || "-"} kg`,
      `Symptom Duration: ${patientInfo.symptomDuration || "-"}`,
      `Pain Severity: ${patientInfo.painSeverity || "-"}`,
    ];

    patientLines.forEach((line) => {
      doc.text(line, 14, y);
      y += 7;
    });

    if (patientInfo.lifestyle) {
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.text("Lifestyle:", 14, y);

      y += 7;
      doc.setFont("helvetica", "normal");

      const lifestyleLines = [
        `Smoking: ${patientInfo.lifestyle.smoking ? "Yes" : "No"}`,
        `Alcohol: ${patientInfo.lifestyle.alcohol || "-"}`,
        `Exercise: ${patientInfo.lifestyle.exercise || "-"}`,
        `Diet: ${patientInfo.lifestyle.diet || "-"}`,
      ];

      lifestyleLines.forEach((line) => {
        doc.text(line, 14, y);
        y += 7;
      });
    }

    y += 5;

    //advice section
    if (adviceList.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Recommended Advice", 14, y);

      y += 8;
      doc.setFont("helvetica", "normal");

      adviceList.forEach((advice) => {
        const wrapped = doc.splitTextToSize(`• ${advice}`, 180);
        doc.text(wrapped, 14, y);
        y += wrapped.length * 6;
      });

      y += 4;
    }

    //conditions
    if (possibleConditions.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Possible Conditions", 14, y);

      y += 8;
      doc.setFont("helvetica", "normal");

      possibleConditions.forEach((c) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${c.condition} (${c.riskLevel})`, 14, y);

        y += 6;
        doc.setFont("helvetica", "normal");

        if (c.matchingSymptoms?.length) {
          const symptomsText = doc.splitTextToSize(
            `Matching Symptoms: ${c.matchingSymptoms.join(", ")}`,
            180,
          );

          doc.setTextColor(80);
          doc.text(symptomsText, 16, y);
          doc.setTextColor(0);

          y += symptomsText.length * 6;
        }

        y += 4;

        //auto page break
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    //disclaimer
    doc.setFontSize(9);
    doc.setTextColor(150);

    doc.text(
      triageData.disclaimer ||
        "This AI-generated report is for informational purposes only.",
      14,
      285,
    );

    doc.save("Triage_Report.pdf");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4
                 bg-[url('/bg_image.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-[rgb(58_72_74_/_54%)] w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Triage Result</h2>

        {/* Overall Urgency */}
        <div
          className={`p-4 rounded text-center mb-4 ${urgencyColor[overallUrgency]}`}
        >
          <p className="text-lg font-semibold">{overallUrgency} Urgency</p>
        </div>

        {/* Patient Info */}

        <div className="mb-6 p-4 rounded-xl bg-[rgb(100_176_194)] text-gray-900">
          <h3 className="font-bold mb-2">Patient Information :</h3>
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
          <h3 className="font-bold mb-2">Recommended Advice</h3>
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
        <h3 className="font-bold mb-3">Possible Conditions</h3>

        {possibleConditions.length > 0 ? (
          possibleConditions.map((condition, index) => {
            const matchingSymptoms = Array.isArray(condition.matchingSymptoms)
              ? condition.matchingSymptoms
              : [];

            return (
              <div
                key={index}
                className="p-4 rounded-xl mb-3 bg-[rgb(78,140,155)]"
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
                    <p className="text-sm font-medium text-gray-800">
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
        <div className="mt-5 flex gap-4 text-red">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={downloadPDF}
            className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Download PDF
          </button>

          <button
            onClick={() =>
              navigate("/providermap", { state: { urgency: overallUrgency } })
            }
            className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Find Nearby Places
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-900 mt-4">{triageData.disclaimer}</p>
      </div>
    </div>
  );
};

export default TriageResult;
