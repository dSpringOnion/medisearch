import AppSearch from "@elastic/react-search-ui";

// ingest.js
require('dotenv').config(); // Load environment variables from .env
const AppSearchClient = require("@elastic/app-search-node");

// 1. Get keys from the .env file
const apiKey = process.env.ELASTIC_PRIVATE_KEY;
const baseUrl = process.env.ELASTIC_ENDPOINT;
const engineName = "medical-records"; // Make sure this matches the Engine name you created in the dashboard

// 2. Validate keys exist before running
if (!apiKey || !baseUrl) {
    console.error("❌ Error: Missing API Keys in .env file.");
    console.error("Make sure ELASTIC_PRIVATE_KEY and ELASTIC_ENDPOINT are set.");
    process.exit(1);
}

// 3. Initialize the Client
const client = new AppSearchClient(undefined, apiKey, () => baseUrl);

// 4. The Fake Medical Data
const medicalRecords = [
    {
        id: "1",
        patient_name: "John Doe",
        diagnosis: "Hypertension",
        notes: "Patient reports persistent headaches. BP 150/90. Prescribed Lisinopril."
    },
    {
        id: "2",
        patient_name: "Jane Smith",
        diagnosis: "Type 2 Diabetes",
        notes: "A1C levels elevated. Recommended dietary changes and Metformin."
    },
    {
        id: "3",
        patient_name: "Robert Brown",
        diagnosis: "Acute Bronchitis",
        notes: "Coughing and wheezing for 3 weeks. Chest X-ray negative for pneumonia."
    },
    {
        id: "4",
        patient_name: "Emily White",
        diagnosis: "Migraine",
        notes: "Severe sensitivity to light. History of aura. Prescribed Sumatriptan."
    },
    {
        id: "5",
        patient_name: "Michael Green",
        diagnosis: "Hypertension",
        notes: "Follow up checkup. BP improved to 130/85. Continue current medication."
    },
    {
        id: "6",
        patient_name: "Sarah Connors",
        diagnosis: "Fractured Radius",
        notes: "Patient fell on outstretched hand. X-ray confirms hairline fracture. Cast applied."
    },
    {
        id: "7",
        patient_name: "David Miller",
        diagnosis: "Seasonal Allergies",
        notes: "Complains of runny nose and itchy eyes. Prescribed Loratadine daily."
    },
    {
        id: "8",
        patient_name: "Linda Johnson",
        diagnosis: "Gastroenteritis",
        notes: "Symptoms include nausea and vomiting. Advised clear fluids and rest."
    },
    {
        id: "9",
        patient_name: "William Anderson",
        diagnosis: "Insomnia",
        notes: "Difficulty falling asleep. Discussed sleep hygiene. Prescribed low dose melatonin."
    },
    {
        id: "10",
        patient_name: "Elizabeth Taylor",
        diagnosis: "Carpal Tunnel Syndrome",
        notes: "Numbness in right hand. Recommended wrist splint for night use."
    }
];

// 5. Send Data to Elastic Cloud
async function indexData() {
    console.log(`🚀 Attempting to index ${medicalRecords.length} documents...`);
    try {
        const response = await client.indexDocuments(engineName, medicalRecords);
        console.log("✅ Success! Data indexed:", response);
    } catch (e) {
        console.error("❌ Error indexing data:", e);
    }
}

indexData();