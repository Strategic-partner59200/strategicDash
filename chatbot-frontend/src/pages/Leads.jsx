// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Spin,
//   Table,
//   Alert,
//   Select,
//   Button,
//   Popconfirm,
//   Space,
//   message,
//   Input,
// } from "antd";
// import { useNavigate } from "react-router-dom";
// import { DeleteOutlined } from "@ant-design/icons";
// import Historiques from "../components/Historiques";

// const { Option } = Select;

// const Leads = () => {
//   const [chatData, setChatData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [showSpinner, setShowSpinner] = useState(false);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [activeFilter, setActiveFilter] = useState("nouveau"); // Default filter

//   const handlePageChange = (value) => {
//     setCurrentPage(value);
//   };
//   const handleLeadClick = (chatData) => {
//     navigate(`/lead/${chatData._id}`);
//   };

//   const totalPages = Math.ceil(chatData.length / pageSize);

//   useEffect(() => {
//     const getUserData = async () => {
//       try {
//         const response = await axios.get("/data");
//         console.log("Fetched data:", response.data);
//         setChatData(response.data.chatData);
//         setFilteredData(response.data.chatData);
//       } catch (err) {
//         setError("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getUserData();
//   }, []);

//   // const handleStatusLeadChange = async (statusLead, record) => {
//   //   try {
//   //     const validStatuses = ["nouveau", "prospect", "client"];
//   //     if (statusLead === "all") {
//   //       statusLead = "nouveau"; // Treat 'all' as 'nouveau'
//   //     }
//   //     if (!validStatuses.includes(statusLead)) {
//   //       return res.status(400).json({ error: "Invalid status value" });
//   //     }
//   //     const response = await axios.put(`/updateStatusLead/${record._id}`, {
//   //       statusLead, // Ensure you're passing the statusLead in the body
//   //     });
//   //     console.log("Updated status:", response.data);
//   //   } catch (error) {
//   //     console.error("Error updating status:", error);
//   //   }
//   // };
//   // const handleDelete = async (id) => {
//   //   try {
//   //     const response = await axios.delete(`/lead/${id}`);

//   //     console.log("Chat deleted successfully:", response.data);
//   //     setChatData(chatData.filter((lead) => lead._id !== id));
//   //     message.success("Chat deleted successfully");
//   //   } catch (error) {
//   //     console.error("Error deleting coach:", error);
//   //     message.error("Failed to delete coach");
//   //   }
//   // };
//   const handleStatusLeadChange = async (statusLead, record) => {
//     try {
//       const validStatuses = ["nouveau", "prospect", "client"];
//       if (statusLead === "all") {
//         statusLead = "nouveau";
//       }
//       if (!validStatuses.includes(statusLead)) {
//         return res.status(400).json({ error: "Invalid status value" });
//       }
      
//       const response = await axios.put(`/updateStatusLead/${record._id}`, {
//         statusLead,
//       });
      
//       // Update both states
//       setChatData(prev => prev.map(item => 
//         item._id === record._id ? {...item, type: statusLead} : item
//       ));
//       setFilteredData(prev => prev.map(item => 
//         item._id === record._id ? {...item, type: statusLead} : item
//       ));
      
//       console.log("Updated status:", response.data);
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };
//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`/lead/${id}`);
//       console.log("Chat deleted successfully:", response.data);
      
//       // Update both states
//       setChatData(prev => prev.filter((lead) => lead._id !== id));
//       setFilteredData(prev => prev.filter((lead) => lead._id !== id));
      
//       message.success("Chat deleted successfully");
//     } catch (error) {
//       console.error("Error deleting coach:", error);
//       message.error("Failed to delete coach");
//     }
//   };

 

//   const handleColumnSearch = async (e, columnKey) => {
//     const value = e.target.value.toLowerCase().trim();
//     setSearchQuery(value);

//     try {
//       // If search value is empty, show all data
//       if (value === "") {
//         setFilteredData(chatData);
//         return;
//       }

//       // If searching on 'commercial', handle 'N/A' or empty value cases
//       if (columnKey === "commercial") {
//         const filteredData = chatData.filter((item) => {
//           const commercialValue = item[columnKey]
//             ? `${item[columnKey].prenom} ${item[columnKey].nom}`.toLowerCase()
//             : "n/a"; // Set 'n/a' as default if commercial is empty or null

//           return commercialValue.includes(value);
//         });
//         setFilteredData(filteredData);
//         return;
//       }

//       // Default search (for other fields)
//       const response = await axios.get("/search", {
//         params: {
//           query: value,
//           columnKey: columnKey,
//         },
//       });
//       setFilteredData(response.data);
//     } catch (error) {
//       console.error("Error in search:", error);
//       message.error("Error while searching.");
//     }
//   };

//   const columns = [
//     // {
//     //   title: "Prénom",
//     //   key: "request_lastname",
//     //   dataIndex: "request_lastname",
//     //   render: (text, record) => (
//     //     <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
//     //       <div>{record.request_lastname || "-"}</div>
//     //     </div>
//     //   ),
//     // },
//     // {
//     //   title: "Nom",
//     //   key: "request_name",
//     //   dataIndex: "request_name",
//     //   render: (text, record) => (
//     //     <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
//     //       <div>{record.request_name || "-"}</div>
//     //     </div>
//     //   ),
//     // },
//     {
//       title: "Prénom et Nom", // Changed title to "Prenom and Nom"
//       key: "request_lastname",
//       dataIndex: "request_fullname",
//       render: (text, record) => (
//         <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
//           <div>{`${record.prénom || ""} ${
//             record.nom || ""
//           }`}</div>
//         </div>
//       ),
//     },

//     {
//       title: "Email",
//       key: "email" || "email1",
//       dataIndex: "email" || "email1",
//       render: (text, record) => (
//         <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
//           <div className="text-gray-500 text-xs">
//             {record.verification_email === "Non"
//               ? record.email1
//               : record.email}
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: "DATE",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       render: (date) => {
//         if (!date) return "-";
//         const formattedDate = new Date(date);
//         const day = formattedDate.toLocaleDateString("en-GB");
//         const time = formattedDate.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//         return (
//           <div
//             className="cursor-pointer"
//             onClick={() => handleLeadClick(record)}
//           >
//             <div>{day}</div>
//             <div className="text-gray-500 text-sm">{time}</div>
//           </div>
//         );
//       },
//     },
//     {
//       title: "TELEPHONE",
//       dataIndex: "phone",
//       key: "phone",
//       render: (text) => text || "",
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//       key: "address",
//       render: (text) => text || "",
//     },
//     {
//       title: "code postal",
//       dataIndex: "codepostal",
//       key: "codepostal",
//       render: (text) => text || "",
//     },
//     {
//       title: "Ville",
//       dataIndex: "ville",
//       key: "ville",
//       render: (text) => text || "",
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (text, record) => text || record.status || "",
//     },
//     {
//       title: "Besoin",
//       dataIndex: "demande",
//       key: "demande",
//       render: (text, record) => text || record.demande || "",
//     },
//     // {
//     //   title: "STATUS LEAD",
//     //   key: "statusLead",
//     //   render: (text, record) => (
//     //     <Select
//     //       defaultValue={record.type}
//     //       style={{ width: 80 }}
//     //       onChange={(value) => handleStatusLeadChange(value, record)}
//     //     >
//     //       <Option value="all">Nouveau</Option>
//     //       <Option value="prospect">Prospect</Option>
//     //       <Option value="client">Client</Option>
//     //     </Select>
//     //   ),
//     // },
//     {
//       title: "STATUS LEAD",
//       key: "statusLead",
//       render: (text, record) => (
//         <Select
//           value={record.type || "nouveau"} // Use record.type as value
//           style={{ width: 80 }}
//           onChange={(value) => handleStatusLeadChange(value, record)}
//         >
//           <Option value="nouveau">Nouveau</Option>
//           <Option value="prospect">Prospect</Option>
//           <Option value="client">Client</Option>
//         </Select>
//       ),
//     },
//     {
//       title: "Contacter",
//       dataIndex: "besoin",
//       key: "besoin",
//       render: (text, record) => (
//         <div className="text-gray-500 text-xs">{record.besoin || ""}</div>
//       ),
//     },

//     {
//       title: "commercial",
//       key: "commercial",
//       dataIndex: "commercial",
//       render: (text, record) => (
//         <div>
//           {record.commercial
//             ? `${record.commercial.prenom} ${record.commercial.nom}`
//             : "N/A"}
//         </div>
//       ),
//     },
//     {
//       title: <span style={{ fontSize: "12px" }}>Action</span>,
//       key: "action",
//       render: (text, record) => (
//         <Space size="middle">
//           <Popconfirm
//             title="Are you sure you want to delete this coach?"
//             onConfirm={() => handleDelete(record._id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               icon={<DeleteOutlined />}
//               style={{ backgroundColor: "red", color: "white" }}
//               danger
//               size="small"
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSpinner(true);
//     }, 1000); // Show spinner after 1 second

//     // Cleanup timer if component unmounts
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const fakeLoad = setTimeout(() => {
//       setLoading(false);
//     }, 3000); // Replace with actual loading duration

//     return () => clearTimeout(fakeLoad);
//   }, []);

//   if (loading && showSpinner) return <Spin tip="Loading..." />;

//   if (error)
//     return <Alert message="Error" description={error} type="error" showIcon />;
//   const rowSelection = {
//     onChange: (selectedRowKeys) => {
//       setSelectedLeads(selectedRowKeys);
//     },
//     selectedRowKeys: selectedLeads,
//   };
//   // const handleFilter = (type) => {
//   //   setActiveFilter(type); // Update the active filter state
//   //   if (type === "client" || type === "prospect") {
//   //     const filtered = chatData.filter((item) => item.type === type);
//   //     console.log("Filtered data22:", filtered);
//   //     setFilteredData(filtered); // Show filtered data
//   //   } else {
//   //     setFilteredData(chatData);
//   //   }
//   // };
//   const handleFilter = (type) => {
//     setActiveFilter(type);
    
//     if (type === "all") {
//       setFilteredData(chatData);
//     } else {
//       const filtered = chatData.filter((item) => item.type === type);
//       setFilteredData(filtered);
//     }
//   };
//   useEffect(() => {
//     // When chatData changes, reapply the current filter
//     if (activeFilter === "all") {
//       setFilteredData(chatData);
//     } else {
//       const filtered = chatData.filter((item) => item.type === activeFilter);
//       setFilteredData(filtered);
//     }
//   }, [chatData]);

//   return (
//     <section>
//       <div className="mb-12 md:p-4 p-1">
//       <div className="md:flex flex-row justify-between  items-center p-4 bg-white rounded-t-md shadow-sm">
//         <h2 className="text-lg font-semibold text-gray-700">Leads Chatbot</h2>
//         <div className="flex flex-row md:flex-row gap-1 sm:gap-4">
//           <Button
//             type={activeFilter === "nouveau" ? "primary" : "default"}
//             onClick={() => handleFilter("nouveau")}
//           >
//             Tous
//           </Button>
//           <Button
//             type={activeFilter === "prospect" ? "primary" : "default"}
//             onClick={() => handleFilter("prospect")}
//           >
//             Prospect
//           </Button>
//           <Button
//             type={activeFilter === "client" ? "primary" : "default"}
//             onClick={() => handleFilter("client")}
//           >
//             Client
//           </Button>
//         </div>
//       </div>
//       <div className="mb-4 p-4 flex items-center rounded-md gap-4">
//         <span className="font-thin text-gray-600">Afficher</span>
//         <Select
//           defaultValue={1}
//           onChange={handlePageChange}
//           className="w-20 border-gray-300"
//         >
//           {[...Array(totalPages)].map((_, index) => (
//             <Option key={index + 1} value={index + 1}>
//               {index + 1}
//             </Option>
//           ))}
//         </Select>

//         <span className="font-thin text-gray-600">résultats par page</span>
//       </div>
//       <div className="bg-white rounded-lg shadow-md w-full md:p-6 overflow-x-auto">
//         <Table
//           columns={[
//             ...columns.map((col) => ({
//               ...col,
//               title: (
//                 <div className="flex flex-col items-center">
//                   <div className="text-xs">{col.title}</div>
//                   {col.key !== "action" && (
//                     <Input
//                       placeholder={`${col.title}`}
//                       onChange={(e) => handleColumnSearch(e, col.key)}
//                       // className="mt-2 text-sm sm:text-base w-full sm:w-auto"
//                       size="medium"
//                     />
//                   )}
//                 </div>
//               ),
//             })),
//           ]}
//           dataSource={filteredData.slice(
//             (currentPage - 1) * pageSize,
//             currentPage * pageSize
//           )}
//           pagination={{
//             current: currentPage,
//             pageSize,
//             total: filteredData.length,
//             onChange: (page) => setCurrentPage(page),
//           }}
//           rowKey={(record) => record._id}
//           bordered
//           className="custom-table text-xs sm:text-sm"
//           rowSelection={rowSelection}
//           tableLayout="auto"
//         />
//       </div>
    
//     </div>
//     <div className="mt-16 mb-16 p-16 flex items-center justify-center">
//         <Historiques />
//       </div>
//     </section>
//   );
// };

// export default Leads;



import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Spin,
  Table,
  Alert,
  Select,
  Button,
  Popconfirm,
  Space,
  message,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import Historiques from "../components/Historiques";

const { Option } = Select;

const Leads = () => {
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("prospect");

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };
  const handleLeadClick = (chatData) => {
    navigate(`/lead/${chatData._id}`);
  };

  const totalPages = Math.ceil(chatData.length / pageSize);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/data");
        console.log("Fetched data:", response.data);
        setChatData(response.data.chatData);
        setFilteredData(response.data.chatData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // const handleStatusLeadChange = async (statusLead, record) => {
  //   try {
  //     const validStatuses = ["nouveau", "prospect", "client"];
  //     if (statusLead === "all") {
  //       statusLead = "nouveau"; // Treat 'all' as 'nouveau'
  //     }
  //     if (!validStatuses.includes(statusLead)) {
  //       return res.status(400).json({ error: "Invalid status value" });
  //     }
  //     const response = await axios.put(`/updateStatusLead/${record._id}`, {
  //       statusLead, // Ensure you're passing the statusLead in the body
  //     });
  //     console.log("Updated status:", response.data);
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //   }
  // };
  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.delete(`/lead/${id}`);

  //     console.log("Chat deleted successfully:", response.data);
  //     setChatData(chatData.filter((lead) => lead._id !== id));
  //     message.success("Chat deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting coach:", error);
  //     message.error("Failed to delete coach");
  //   }
  // };
  const handleStatusLeadChange = async (statusLead, record) => {
    try {
      const validStatuses = ["nouveau", "prospect", "client"];
      if (statusLead === "all") {
        statusLead = "nouveau";
      }
      if (!validStatuses.includes(statusLead)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      
      const response = await axios.put(`/updateStatusLead/${record._id}`, {
        statusLead,
      });
      
      // Update both states
      setChatData(prev => prev.map(item => 
        item._id === record._id ? {...item, type: statusLead} : item
      ));
      setFilteredData(prev => prev.map(item => 
        item._id === record._id ? {...item, type: statusLead} : item
      ));
      
      console.log("Updated status:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/lead/${id}`);
      console.log("Chat deleted successfully:", response.data);
      
      // Update both states
      setChatData(prev => prev.filter((lead) => lead._id !== id));
      setFilteredData(prev => prev.filter((lead) => lead._id !== id));
      
      message.success("Chat deleted successfully");
    } catch (error) {
      console.error("Error deleting coach:", error);
      message.error("Failed to delete coach");
    }
  };

 

  const handleColumnSearch = async (e, columnKey) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchQuery(value);

    try {
      // If search value is empty, show all data
      if (value === "") {
        setFilteredData(chatData);
        return;
      }

      // If searching on 'commercial', handle 'N/A' or empty value cases
      if (columnKey === "commercial") {
        const filteredData = chatData.filter((item) => {
          const commercialValue = item[columnKey]
            ? `${item[columnKey].prenom} ${item[columnKey].nom}`.toLowerCase()
            : "n/a"; // Set 'n/a' as default if commercial is empty or null

          return commercialValue.includes(value);
        });
        setFilteredData(filteredData);
        return;
      }

      // Default search (for other fields)
      const response = await axios.get("/search", {
        params: {
          query: value,
          columnKey: columnKey,
        },
      });
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error in search:", error);
      message.error("Error while searching.");
    }
  };

  const columns = [
    // {
    //   title: "Prénom",
    //   key: "request_lastname",
    //   dataIndex: "request_lastname",
    //   render: (text, record) => (
    //     <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
    //       <div>{record.request_lastname || "-"}</div>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Nom",
    //   key: "request_name",
    //   dataIndex: "request_name",
    //   render: (text, record) => (
    //     <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
    //       <div>{record.request_name || "-"}</div>
    //     </div>
    //   ),
    // },
    {
      title: "Prénom et Nom", // Changed title to "Prenom and Nom"
      key: "request_lastname",
      dataIndex: "request_fullname",
      render: (text, record) => (
        <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
          <div>{`${record.prénom || ""} ${
            record.nom || ""
          }`}</div>
        </div>
      ),
    },

    {
      title: "Email",
      key: "email" || "email1",
      dataIndex: "email" || "email1",
      render: (text, record) => (
        <div className="cursor-pointer" onClick={() => handleLeadClick(record)}>
          <div className="text-gray-500 text-xs">
            {record.verification_email === "Non"
              ? record.email1
              : record.email}
          </div>
        </div>
      ),
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => {
        if (!date) return "-";
        const formattedDate = new Date(date);
        const day = formattedDate.toLocaleDateString("en-GB");
        const time = formattedDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <div
            className="cursor-pointer"
            onClick={() => handleLeadClick(record)}
          >
            <div>{day}</div>
            <div className="text-gray-500 text-sm">{time}</div>
          </div>
        );
      },
    },
    {
      title: "TELEPHONE",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => text || "",
    },
    {
      title: "code postal",
      dataIndex: "codepostal",
      key: "codepostal",
      render: (text) => text || "",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
      render: (text) => text || "",
    },
    {
      title: "Niche",
      dataIndex: "status",
      key: "status",
      render: (text, record) => text || record.status || "",
    },
    {
      title: "Besoin",
      dataIndex: "demande",
      key: "demande",
      render: (text, record) => text || record.demande || "",
    },
    // {
    //   title: "STATUS LEAD",
    //   key: "statusLead",
    //   render: (text, record) => (
    //     <Select
    //       defaultValue={record.type}
    //       style={{ width: 80 }}
    //       onChange={(value) => handleStatusLeadChange(value, record)}
    //     >
    //       <Option value="all">Nouveau</Option>
    //       <Option value="prospect">Prospect</Option>
    //       <Option value="client">Client</Option>
    //     </Select>
    //   ),
    // },
    {
      title: "STATUS LEAD",
      key: "statusLead",
      render: (text, record) => (
        <Select
          value={record.type || "prospect"} // Use record.type as value
          style={{ width: 90 }}
          onChange={(value) => handleStatusLeadChange(value, record)}
        >
          {/* <Option value="nouveau">Nouveau</Option> */}
          <Option value="prospect">Prospect</Option>
          <Option value="client">Client</Option>
        </Select>
      ),
    },
    {
      title: "Contacter",
      dataIndex: "besoin",
      key: "besoin",
      render: (text, record) => (
        <div className="text-gray-500 text-xs">{record.besoin || ""}</div>
      ),
    },

    {
      title: "commercial",
      key: "commercial",
      dataIndex: "commercial",
      render: (text, record) => (
        <div>
          {record.commercial
            ? `${record.commercial.prenom} ${record.commercial.nom}`
            : "N/A"}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Action</span>,
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce prospect ?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ backgroundColor: "red", color: "white" }}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 1000); // Show spinner after 1 second

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fakeLoad = setTimeout(() => {
      setLoading(false);
    }, 3000); // Replace with actual loading duration

    return () => clearTimeout(fakeLoad);
  }, []);

  if (loading && showSpinner) return <Spin tip="Loading..." />;

  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedLeads(selectedRowKeys);
    },
    selectedRowKeys: selectedLeads,
  };
  // const handleFilter = (type) => {
  //   setActiveFilter(type); // Update the active filter state
  //   if (type === "client" || type === "prospect") {
  //     const filtered = chatData.filter((item) => item.type === type);
  //     console.log("Filtered data22:", filtered);
  //     setFilteredData(filtered); // Show filtered data
  //   } else {
  //     setFilteredData(chatData);
  //   }
  // };
  const handleFilter = (type) => {
    setActiveFilter(type);
    
    if (type === "all") {
      setFilteredData(chatData);
    } else {
      const filtered = chatData.filter((item) => item.type === type);
      setFilteredData(filtered);
    }
  };
  useEffect(() => {
    // When chatData changes, reapply the current filter
    if (activeFilter === "all") {
      setFilteredData(chatData);
    } else {
      const filtered = chatData.filter((item) => item.type === activeFilter);
      setFilteredData(filtered);
    }
  }, [chatData]);

  return (
    <section>
      <div className="mb-12 md:p-4 p-1">
      <div className="md:flex flex-row justify-between  items-center p-4 bg-white rounded-t-md shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700">Leads Chatbot</h2>
        <div className="flex flex-row md:flex-row gap-1 sm:gap-4">
          {/* <Button
            type={activeFilter === "nouveau" ? "primary" : "default"}
            onClick={() => handleFilter("nouveau")}
          >
            Tous
          </Button> */}
          <Button
            type={activeFilter === "prospect" ? "primary" : "default"}
            onClick={() => handleFilter("prospect")}
          >
            Prospect
          </Button>
          <Button
            type={activeFilter === "client" ? "primary" : "default"}
            onClick={() => handleFilter("client")}
          >
            Client
          </Button>
        </div>
      </div>
      <div className="mb-4 p-4 flex items-center rounded-md gap-4">
        <span className="font-thin text-gray-600">Afficher</span>
        <Select
          defaultValue={1}
          onChange={handlePageChange}
          className="w-20 border-gray-300"
        >
          {[...Array(totalPages)].map((_, index) => (
            <Option key={index + 1} value={index + 1}>
              {index + 1}
            </Option>
          ))}
        </Select>

        <span className="font-thin text-gray-600">résultats par page</span>
      </div>
      <div className="bg-white rounded-lg shadow-md w-full md:p-6 overflow-x-auto">
        <Table
          columns={[
            ...columns.map((col) => ({
              ...col,
              title: (
                <div className="flex flex-col items-center">
                  <div className="text-xs">{col.title}</div>
                  {col.key !== "action" && (
                    <Input
                      placeholder={`${col.title}`}
                      onChange={(e) => handleColumnSearch(e, col.key)}
                      // className="mt-2 text-sm sm:text-base w-full sm:w-auto"
                      size="medium"
                    />
                  )}
                </div>
              ),
            })),
          ]}
          dataSource={filteredData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredData.length,
            onChange: (page) => setCurrentPage(page),
          }}
          rowKey={(record) => record._id}
          bordered
          className="custom-table text-xs sm:text-sm"
          rowSelection={rowSelection}
          tableLayout="auto"
        />
      </div>
    
    </div>
    <div className="mt-16 mb-16 p-16 flex items-center justify-center">
        <Historiques />
      </div>
    </section>
  );
};

export default Leads;