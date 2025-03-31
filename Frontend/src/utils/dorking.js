// src/lib/utils/dorking.js

export const predefinedDorks = {
    "Files & Directories": [
      { name: "PDFs", query: "filetype:pdf" },
      { name: "Word Docs", query: "filetype:doc OR filetype:docx" },
      { name: "Excel Sheets", query: "filetype:xls OR filetype:xlsx" },
      { name: "Text Files", query: "filetype:txt" }
    ],
    "Website Exploration": [
      { name: "Index of Directories", query: "intitle:\"index of\"" },
      { name: "Open Admin Panels", query: "inurl:admin" },
      { name: "Login Pages", query: "inurl:login" }
    ],
    "Sensitive Data Exposure": [
      { name: "Database Dumps", query: "ext:sql | ext:db" },
      { name: "Configuration Files", query: "ext:ini | ext:env | ext:cfg" }
    ]
  };
  
  export function formatDork(query, site = "") {
    return site ? `${query} site:${site}` : query;
  }
  
  export async function fetchDorkResults(query) {
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to fetch results");
      return await response.json();
    } catch (error) {
      console.error("Dorking Error:", error);
      return { error: error.message };
    }
  }
  