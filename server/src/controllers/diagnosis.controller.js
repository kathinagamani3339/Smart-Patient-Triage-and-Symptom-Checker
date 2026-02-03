import { getDiagnosisFromAI } from "../services/aiDiagnosis.service.js";

export const analyzeTriage = async (req, res) => {
  try {
    const { symptoms, patientInfo, lang } = req.body;

    // validations
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one symptom is required" });
    }

    if (!patientInfo?.age || patientInfo.age < 1 || patientInfo.age > 120) {
      return res.status(400).json({ message: "Valid age is required" });
    }

    if (!patientInfo.gender) {
      return res.status(400).json({ message: "Gender is required" });
    }

    const payload = {
      symptoms,
      patientInfo,
      lang: lang || "en",
    };

    const aiResponse = await getDiagnosisFromAI(payload);
    // Normalize API response
const aiResult = aiResponse?.result || {}; //gets results from api response
const aiAnalysis = aiResult?.analysis || {}; //gets analysis data from result

const normalizedResponse = {
  patientInfo,

  conditions: (aiAnalysis.possibleConditions || []).map((c) => ({
    condition: c.name || c.condition || "Unknown condition",
    riskLevel: c.riskLevel || c.severity || "Low",
    matchingSymptoms: symptoms,
  })),

  generalAdvice: {
    recommendedActions:
      aiAnalysis.generalAdvice?.recommendedActions ||
      aiAnalysis.generalAdvice?.actions ||
      [],
  },

  disclaimer:
    aiResult.disclaimer ||
    "This AI result is for informational purposes only.",

  raw: aiResponse,
};

// fallback block
if (!normalizedResponse.conditions.length) {
  normalizedResponse.conditions.push({
    condition: "General viral illness",
    riskLevel: "Low",
    matchingSymptoms: symptoms,
  });
}

return res.status(200).json(normalizedResponse);

  } catch (error) {
    console.error("Analyze error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to analyze symptoms" });
  }
};
