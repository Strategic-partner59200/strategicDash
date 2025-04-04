// import React, { useState } from "react";

// const Historique = () => {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [conversationDetails, setConversationDetails] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1); // Track current page
//   const conversationsPerPage = 10; // Number of conversations per page

//   // Function to fetch all conversations
//   const fetchAllConversations = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         "https://api.elevenlabs.io/v1/convai/conversations",
//         {
//           method: "GET",
//           headers: {
//             "xi-api-key": "sk_7ea9ce9dd90fc58f3922f09d80a198d0ee7572894b4ea8d5", // Replace with your xi-api-key
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch conversations");
//       }

//       const data = await response.json();
//       setConversations(data.conversations); // Assuming the API response contains 'conversations' key
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   // Function to fetch conversation details by conversation_id
//   const fetchConversationDetails = async (conversationId) => {
//     try {
//       const response = await fetch(
//         `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
//         {
//           method: "GET",
//           headers: {
//             "xi-api-key": "sk_7ea9ce9dd90fc58f3922f09d80a198d0ee7572894b4ea8d5", // Replace with your xi-api-key
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch details for conversation ID ${conversationId}`
//         );
//       }

//       const data = await response.json();
//       setConversationDetails(data); // Store the details of the specific conversation
//     } catch (err) {
//       console.error(
//         `Error fetching details for conversation ${conversationId}:`,
//         err
//       );
//     }
//   };

//   // Function to handle button click to load conversations
//   const handleButtonClick = () => {
//     fetchAllConversations();
//   };

//   const indexOfLastConversation = currentPage * conversationsPerPage;
//   const indexOfFirstConversation =
//     indexOfLastConversation - conversationsPerPage;
//   const currentConversations = conversations.slice(
//     indexOfFirstConversation,
//     indexOfLastConversation
//   );

//   // Handle loading state and error display
//   if (loading) {
//     return <div className="text-center text-xl">Loading conversations...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center text-xl text-red-500">Error: {error}</div>
//     );
//   }

//   const handleNextPage = () => {
//     if (currentPage * conversationsPerPage < conversations.length) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="text-center mb-6">
//         <button
//           onClick={handleButtonClick}
//           className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
//         >
//           Load All Conversations
//         </button>
//       </div>

//       {conversations.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Conversation List
//           </h2>
//           <ul className="space-y-4">
//             {currentConversations.map((conversation) => (
//               <li
//                 key={conversation.conversation_id}
//                 className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
//               >
//                 <span className="text-gray-700 font-medium">
//                   {conversation.conversation_id}
//                 </span>
//                 <button
//                   onClick={() =>
//                     fetchConversationDetails(conversation.conversation_id)
//                   }
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
//                 >
//                   View Details
//                 </button>
//               </li>
//             ))}
//           </ul>
//           {/* Pagination controls */}
//           <div className="flex justify-between mt-6">
//             <button
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-pointer disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="flex items-center text-gray-700">
//               Page {currentPage} of{" "}
//               {Math.ceil(conversations.length / conversationsPerPage)}
//             </span>
//             <button
//               onClick={handleNextPage}
//               disabled={
//                 currentPage * conversationsPerPage >= conversations.length
//               }
//               className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-pointer disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {conversationDetails && (
//         <div className="mt-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Conversation Details
//           </h2>
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <ul className="space-y-4">
//               {conversationDetails.transcript.map((entry, index) => (
//                 <li key={index} className="flex flex-col space-y-2">
//                   <div className="font-semibold text-blue-600">
//                     {entry.role === "agent" ? "Agent" : "User"}
//                   </div>
//                   <div className="text-gray-800">{entry.message}</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Historique;


import React, { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx'; // Import xlsx library

const Historiques = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch All Conversations
  const fetchAllConversations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/convai/conversations", {
        method: "GET",
        headers: {
          "xi-api-key": import.meta.env.VITE_XI_API_KEY, // Replace with your xi-api-key
        },
      });

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

  // Fetch Conversation Details and Generate CSV or XLSX
  const fetchAndGenerateFile = async () => {
    if (!conversations.length) {
      setError("No conversations found.");
      return;
    }
    setIsDownloading(true);

    const csvData = [];
    const headers = ["conversation_id", "response_1", "response_2", 
        "response_3", "response_4", "response_5", "response_6", "response_7", 
        "response_8", "response_9", "response_10", "response_11", "response_12", "response_13",
    "response_14", "response_15", "response_16", "response_17", "response_18", "response_19", "response_20"]; // Modify as needed for more responses

    // Fetch details for each conversation and structure the data
    for (const conversation of conversations) {
      await fetchConversationDetails(conversation.conversation_id, csvData, headers);
    }

    // Create CSV from data using PapaParse
    const csv = Papa.unparse({
      fields: headers,
      data: csvData,
    });

    // Create an Excel file using XLSX.js
    const ws = XLSX.utils.json_to_sheet(csvData, { header: headers });

    // Set custom column widths for the Excel file
    ws['!cols'] = [
      { wch: 40 },
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
    ws['!rows'] = csvData.map(() => ({ hpt: 30 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Conversations');

    // Prompt user to download the file (either CSV or Excel)
    const fileType = 'xlsx'; // You can change this to 'csv' if you want to download CSV
    if (fileType === 'xlsx') {
      XLSX.writeFile(wb, 'conversation_data.xlsx');
    } else {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'conversation_data.csv';
      link.click();
    }

    setIsDownloading(false);
  };

  // Fetch Details of a Specific Conversation
//   const fetchConversationDetails = async (conversationId, csvData, headers) => {
//     try {
//       const response = await fetch(
//         `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
//         {
//           method: "GET",
//           headers: {
//             "xi-api-key": "sk_7ea9ce9dd90fc58f3922f09d80a198d0ee7572894b4ea8d5", // Replace with your xi-api-key
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch details for conversation ID ${conversationId}`);
//       }

//       const data = await response.json();
//       const transcript = data.transcript;

//       // Organize the data for CSV - filter out only user responses
//       const userMessages = [];

//       transcript.forEach(entry => {
//         if (entry.role === 'user') { // Only collect messages from 'user' role
//           userMessages.push(entry.message); // Add user message to the array
//         }
//       });

//       // Prepare data row for this conversation
//       const rowData = { conversation_id: conversationId };
//       userMessages.forEach((message, index) => {
//         const columnName = `response_${index + 1}`;
//         rowData[columnName] = message; // Assign the message to the respective column
//       });

//       // Fill in the missing columns with empty values if responses are fewer than the header
//       for (let i = userMessages.length + 1; i <= headers.length - 1; i++) {
//         const columnName = `response_${i}`;
//         rowData[columnName] = ''; // Fill with empty string for missing responses
//       }

//       csvData.push(rowData); // Push the conversation data to the CSV

//     } catch (err) {
//       console.error(`Error fetching details for conversation ${conversationId}:`, err);
//     }
//   };
// Fetch Details of a Specific Conversation
const fetchConversationDetails = async (conversationId, csvData, headers) => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            "xi-api-key": import.meta.env.VITE_XI_API_KEY, // Replace with your xi-api-key
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch details for conversation ID ${conversationId}`);
      }
  
      const data = await response.json();
      const transcript = data.transcript;
  
      // Organize the data for CSV - filter out only user responses
      const userMessages = [];
  
      transcript.forEach(entry => {
        if (entry.role === 'user') { // Only collect messages from 'user' role
          userMessages.push(entry.message); // Add user message to the array
        }
      });
  
      // If no user messages are found, skip this conversation
      if (userMessages.length === 0) {
        return; // Skip adding this conversation to the CSV
      }
  
      // Prepare data row for this conversation
      const rowData = { conversation_id: conversationId };
      userMessages.forEach((message, index) => {
        const columnName = `response_${index + 1}`;
        rowData[columnName] = message; // Assign the message to the respective column
      });
  
      // Fill in the missing columns with empty values if responses are fewer than the header
      for (let i = userMessages.length + 1; i <= headers.length - 1; i++) {
        const columnName = `response_${i}`;
        rowData[columnName] = ''; // Fill with empty string for missing responses
      }
  
      csvData.push(rowData); // Push the conversation data to the CSV
  
    } catch (err) {
      console.error(`Error fetching details for conversation ${conversationId}:`, err);
    }
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
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Chargement...' : 'Récupérer les Conversations'}
        </button>
  
        {/* Arrow between buttons */}
        <span className="text-2xl font-bold">→</span>
  
        {/* Button to generate and download CSV or Excel */}
        <button
          onClick={fetchAndGenerateFile}
          disabled={isDownloading || loading || !conversations.length}
          className={`px-6 py-3 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 ${
            isDownloading || loading || !conversations.length
              ? 'bg-gray-400'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isDownloading ? 'Chargement...' : 'Télécharger CSV / Excel'}
        </button>
      </div>
  
      {/* Error or loading message */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
  
  
};

export default Historiques;
