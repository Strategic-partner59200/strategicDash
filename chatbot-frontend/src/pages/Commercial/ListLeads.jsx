import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  message,
} from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ListLeads = () => {
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commercials, setCommercials] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();


  const handlePageChange = (value) => {
    setCurrentPage(value);
  };
  const totalPages = Math.ceil(chatData.length / pageSize);

  const fetchCoaches = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token); // Decode token to get user details
    const userId = decodedToken?.userId; // Extract user ID
    const userName = decodedToken?.name; // Extract full name
  
    try {
      setLoading(true);
  
      // Fetch leads from backend
      const response = await axios.get("/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Response data:", response.data); // Debug response structure
  
      // Ensure `allLeads` is an array
      const allLeads = response.data?.chatData || [];
      console.log("All leads:", allLeads); // Debug all leads
      
      // Split user's full name into first and last names
      const nameParts = userName?.trim().split(" ") || [];
      const firstName = nameParts[1] || ""; // First name
      const lastName = nameParts[0] || ""; // Last name
  
      // Filter leads based on the current commercial's info
      const filteredLeads = allLeads.filter((lead) => {
        const commercial = lead.commercial || {}; // Ensure commercial exists
        return (
          commercial._id === userId && // Match ID
          commercial.nom === lastName && // Match last name
          commercial.prenom === firstName // Match first name
        );
      });
      console.log("Filtered leads:", filteredLeads); // Debug filtered leads
  
      setChatData(filteredLeads); // Update state with filtered leads
    } catch (error) {
      console.error("Error fetching leads:", error);
      message.error("Failed to fetch leads");
    } finally {
      setLoading(false); // End loading state
    }
  };
  

  useEffect(() => {
    fetchCommercials();
    fetchCoaches();
  }, []);

  
  const fetchCommercials = async () => {
    try {
      const response = await axios.get("/commercials");
      setCommercials(response.data);
      console.log("Fetched commercials:", response.data);
    } catch (error) {
      console.error("Error fetching commercials:", error);
      message.error("Failed to fetch commercials");
    }
  };

  const handleLeadClick = (chatData) => {
    navigate(`/lead/${chatData._id}`);
  };
  const handleStatusLeadChange = async (statusLead, record) => {
    try {
      const validStatuses = ['nouveau', 'prospect', 'client'];
      if (statusLead === 'all') {
        statusLead = 'nouveau'; // Treat 'all' as 'nouveau'
      }
      if (!validStatuses.includes(statusLead)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      const response = await axios.put(`/updateStatusLead/${record._id}`, {
        statusLead,  // Ensure you're passing the statusLead in the body
      });
      console.log('Updated status:', response.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };


  if (loading && showSpinner) return <Spin tip="Loading..." />;

  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;
  const columns = [
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
      key: "request_email" || "request_add_email",
      dataIndex: "request_email" || "request_add_email",
      render: (text, record) => (
        <div
          className="cursor-pointer"
          onClick={() => handleCoachClick(record)}
        >
         <div className="text-gray-500 text-xs">
            {record.verification_email === "Non"
              ? record.email1 || "-"
              : record.email || "-"}
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
            onClick={() => handleCoachClick(record)}
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
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "course_details",
      key: "course_details",
      render: (text, record) => text || record.status || "-",
    },
    {
      title: "Besoin",
      dataIndex: "student",
      key: "student",
      render: (text, record) =>
        text || record.demande || "-",
    },
    {
      title: "STATUS LEAD",
      key: "statusLead",
      render: (text, record) => (
        <Select
          defaultValue={record.type}
          style={{ width: 80 }}
          onChange={(value) => handleStatusLeadChange(value, record)}
        >
          <Option value="prospect">Prospect</Option>
          <Option value="client">Client</Option>
        </Select>
      ),
    },
    {
      title: "Contacter",
      dataIndex: "choose_course",
      key: "choose_course",
      render: (text, record) => (
        <div className="text-gray-500 text-xs">
          {record.besoin ||
            "-"}
          ,
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: "12px" }}>Commercial</span>,
      key: "commercial",
      render: (text, record) => (
        <div>
          {record.commercial
            ? `${record.commercial.nom} ${record.commercial.nom}`
            : "N/A"}
        </div>
      ),
    },
  ];

  // const rowSelection = {
  //   onChange: (selectedRowKeys) => {
  //     setSelectedLeads(selectedRowKeys);
  //   },
  //   selectedRowKeys: selectedLeads,
  // };


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">List des Leads</h1>

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
      <Table
        dataSource={chatData.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        columns={[
          ...columns.map((col) => ({
            ...col,
            title: (
              <div className="flex flex-col items-center">
                <div className="text-xs">{col.title}</div>
              </div>
            ),
          })),
        ]}
        rowKey={(record) => record._id}
        pagination={false}
        bordered
        className="custom-table"
        // rowSelection={rowSelection}
        tableLayout="fixed"
      />
    </div>
  );
};

export default ListLeads;
