import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx"; // Import xlsx library

const Historiques = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownload, setIsDownload] = useState(false);

  // Fetch All Conversations
  const fetchAllConversations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/convai/conversations",
        {
          method: "GET",
          headers: {
            "xi-api-key": import.meta.env.VITE_XI_API_KEY, // Replace with your xi-api-key
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data.conversations); // Store all conversation data
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId, csvData, headers) => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": import.meta.env.VITE_XI_API_KEY,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(
          `Failed to fetch details for conversation ID ${conversationId}`
        );
      }
  
      const data = await response.json();
      console.log("Full conversation data:", data); // Debug log
  
      // Get system time and recipient number
      const dynamicVars = data.conversation_initiation_client_data?.dynamic_variables || {};
      const systemTimeUtc = dynamicVars.system__time_utc;
      const recipientNumber = dynamicVars.recipient_number || "N/A";
      
  
      if (!systemTimeUtc || isNaN(new Date(systemTimeUtc).getTime())) {
        console.error(
          `Invalid system__time_utc for conversation ${conversationId}`
        );
        return;
      }
  
      // Date comparison logic
      const today = new Date().toISOString().split("T")[0];
      const createdAt = new Date(systemTimeUtc).toISOString().split("T")[0];
  
      if (createdAt !== today) {
        console.log(
          `Conversation ${conversationId} is not from today, skipping download.`
        );
        return;
      }
  
      const transcript = data.transcript || [];
      const userMessages = transcript
        .filter((entry) => entry.role === "user")
        .map((entry) => entry.message);
  
      // Build row data with recipient number
      const rowData = { 
        conversation_id: conversationId, 
        Téléphone_client: recipientNumber  // This must match the header
      };
  
      // Add user messages
      userMessages.forEach((message, index) => {
        rowData[`response_${index + 1}`] = message;
      });
  
      // Fill empty responses
      for (let i = userMessages.length + 1; i <= headers.length - 2; i++) {
        rowData[`response_${i}`] = "";
      }
  
      csvData.push(rowData);
      console.log("Added row data:", rowData); // Debug log
  
    } catch (err) {
      console.error(
        `Error fetching details for conversation ${conversationId}:`,
        err
      );
    }
  };
  const fetchAndGenerateFile = async () => {
    if (!conversations.length) {
      setError("No conversations found.");
      return;
    }
    setIsDownload(true);

    const csvData = [];
    const headers = [
      "conversation_id",
      "Téléphone_client",
      "response_1",
      "response_2",
      "response_3",
      "response_4",
      "response_5",
      "response_6",
      "response_7",
      "response_8",
      "response_9",
      "response_10",
      "response_11",
      "response_12",
      "response_13",
      "response_14",
      "response_15",
      "response_16",
      "response_17",
      "response_18",
      "response_19",
      "response_20",
    ];

    let hasTodayConversations = false;

    for (const conversation of conversations) {
      await fetchConversationDetails(
        conversation.conversation_id,
        csvData,
        headers
      );
      if (csvData.length > 0) hasTodayConversations = true; // Check if we have data from today
    }

    if (!hasTodayConversations) {
      alert("No conversations found for today.");
      setIsDownload(false);
      return;
    }

    const csv = Papa.unparse({
      fields: headers,
      data: csvData,
    });

    const ws = XLSX.utils.json_to_sheet(csvData, { header: headers });

    ws["!cols"] = [
      { wch: 40 },
      { wch: 20 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
    ];
    ws["!rows"] = csvData.map(() => ({ hpt: 30 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conversations");

    const fileType = "xlsx";
    if (fileType === "xlsx") {
      XLSX.writeFile(wb, "conversation_data.xlsx");
    } else {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "conversation_data.csv";
      link.click();
    }

    setIsDownload(false);
  };





  const fetchConversationsDetails = async (
    conversationId,
    csvData,
    headers
  ) => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": import.meta.env.VITE_XI_API_KEY,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(
          `Failed to fetch details for conversation ID ${conversationId}`
        );
      }
  
      const data = await response.json();
      const transcript = data.transcript || [];
  
      // Get recipient number from dynamic variables
      const recipientNumber = data.conversation_initiation_client_data?.dynamic_variables?.recipient_number || "N/A";
      console.log("Recipient Number:", recipientNumber); // Debug log
  
      // Prepare data row for this conversation with recipient number
      const rowData = { 
        conversation_id: conversationId,
        Téléphone_client: recipientNumber // Add recipient number to the row
      };
  
      // Organize the data for CSV - filter out only user responses
      const userMessages = transcript
        .filter((entry) => entry.role === "user")
        .map((entry) => entry.message);
  
      // Add user messages (if any exist)
      userMessages.forEach((message, index) => {
        const columnName = `response_${index + 1}`;
        rowData[columnName] = message;
      });
  
      // Fill in all remaining response columns with empty values
      const responseColumns = headers.filter(h => h.startsWith('response_')).length;
      for (let i = userMessages.length; i < responseColumns; i++) {
        rowData[`response_${i + 1}`] = "";
      }
  
      csvData.push(rowData);
      console.log("Added conversation data:", rowData); // Debug log
  
    } catch (err) {
      console.error(
        `Error fetching details for conversation ${conversationId}:`,
        err
      );
    }
  };
  
  const fetchAndGenerateFiles = async () => {
    if (!conversations.length) {
      setError("No conversations found.");
      return;
    }
    setIsDownloading(true);
  
    const csvData = [];
    const headers = [
      "conversation_id",
      "Téléphone_client",
      "response_1",
      "response_2",
      "response_3",
      "response_4",
      "response_5",
      "response_6",
      "response_7",
      "response_8",
      "response_9",
      "response_10",
      "response_11",
      "response_12",
      "response_13",
      "response_14",
      "response_15",
      "response_16",
      "response_17",
      "response_18",
      "response_19",
      "response_20",
    ];
  
    for (const conversation of conversations) {
      await fetchConversationsDetails(
        conversation.conversation_id,
        csvData,
        headers
      );
    }
  
    // Create CSV from data using PapaParse
    const csv = Papa.unparse({
      fields: headers,
      data: csvData,
    });
  
    // Create an Excel file using XLSX.js
    const ws = XLSX.utils.json_to_sheet(csvData, { header: headers });
  
    // Set custom column widths
    ws["!cols"] = [
      { wch: 40 },
      { wch: 20 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
      { wch: 60 },
    ];
    
    ws["!rows"] = csvData.map(() => ({ hpt: 30 }));
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conversations");
  
    const fileType = "xlsx";
    if (fileType === "xlsx") {
      XLSX.writeFile(wb, "conversation_data.xlsx");
    } else {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "conversation_data.csv";
      link.click();
    }
  
    setIsDownloading(false);
  };



  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-sm sm:text-xl md:text-xl font-semibold text-center mb-6">
        Récupérer les conversations et générer un CSV ou Excel
      </h1>

      <div className="flex justify-center items-center lg:space-x-4 space-x-1">
        {/* Button to fetch conversations */}
        <button
          onClick={fetchAllConversations}
          disabled={loading}
          className={`lg:px-6 lg:py-3 p-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Chargement..." : "Récupérer les Conversations"}
        </button>

        {/* Arrow between buttons */}
        <span className="text-2xl font-bold">→</span>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Button to generate and download CSV or Excel */}
          <button
            onClick={fetchAndGenerateFile}
            disabled={isDownload || loading || !conversations.length}
            className={`px-6 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 ${
              isDownload || loading || !conversations.length
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isDownload ? "Chargement..." : "Télécharger CSV / Jour"}
          </button>
          <button
            onClick={fetchAndGenerateFiles}
            disabled={isDownloading || loading || !conversations.length}
            className={`px-6 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 ${
              isDownloading || loading || !conversations.length
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isDownloading ? "Chargement..." : "Télécharger CSV / Tous"}
          </button>
        </div>
      </div>

      {/* Error or loading message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Historiques;
