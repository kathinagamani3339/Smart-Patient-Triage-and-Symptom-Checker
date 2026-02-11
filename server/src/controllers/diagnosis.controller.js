import { getDiagnosisFromAI } from "../services/aiDiagnosis.service.js";

//analyze triage controller
export const analyzeTriage = async (req, res) => {
  try {
    const { symptoms, patientInfo, lang } = req.body;

    console.log("Received triage request:", { symptoms, patientInfo, lang });

    // Input Validations
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      console.warn("Validation failed: No symptoms provided");
      return res
        .status(400)
        .json({ message: "At least one symptom is required" });
    }

    if (!patientInfo?.age || patientInfo.age < 1 || patientInfo.age > 120) {
      console.warn("Validation failed: Invalid age", patientInfo?.age);
      return res.status(400).json({ message: "Valid age is required" });
    }

    if (!patientInfo.gender) {
      console.warn("Validation failed: Gender missing");
      return res.status(400).json({ message: "Gender is required" });
    }

    // Prepare payload for AI service
    const payload = {
      symptoms,
      patientInfo,
      lang: lang || "en",
    };

    console.log("Sending payload to AI service:", payload);

    // Call AI diagnosis service
    const aiResponse = await getDiagnosisFromAI(payload);

    console.log("AI response received:", aiResponse);

    // Normalize API response
    const aiResult = aiResponse?.result || {}; // gets results from API response
    const aiAnalysis = aiResult?.analysis || {}; // gets analysis data from result

    const normalizedResponse = {
      patientInfo,

      // Map possible conditions from AI result
      conditions: (aiAnalysis.possibleConditions || []).map((c) => ({
        condition: c.name || c.condition || "Unknown condition",
        riskLevel: c.riskLevel || c.severity || "Low",
        matchingSymptoms: symptoms,
      })),

      // Extract general advice
      generalAdvice: {
        recommendedActions:
          aiAnalysis.generalAdvice?.recommendedActions ||
          aiAnalysis.generalAdvice?.actions ||
          [],
      },

      // Disclaimer
      disclaimer:
        aiResult.disclaimer ||
        "This AI result is for informational purposes only.",

      // Include raw AI response for reference/debugging
      raw: aiResponse,
    };

    console.log("Normalized response:", normalizedResponse);

    // Fallback if no conditions returned
    if (!normalizedResponse.conditions.length) {
      console.warn("No conditions returned from AI, adding fallback condition");
      normalizedResponse.conditions.push({
        condition: "General viral illness",
        riskLevel: "Low",
        matchingSymptoms: symptoms,
      });
    }

    console.log("Sending response to client");
    return res.status(200).json(normalizedResponse);
  } catch (error) {
    console.error("Analyze error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to analyze symptoms" });
  }
};
