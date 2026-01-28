const axios = require('axios');
const env = require('../config/env');

async function getDiagnosis(symptomsData) {
  try {
    const response = await axios.post(env.rapidApiUrl, symptomsData, {
      headers: {
        'X-RapidAPI-Key': env.rapidApiKey,
        'X-RapidAPI-Host': env.rapidApiHost,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (err) {
    console.error('Diagnosis API error:', err.message);
    throw err;
  }
}

module.exports = { getDiagnosis };
