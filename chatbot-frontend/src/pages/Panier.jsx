// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, Col, Row, message, Button } from "antd";
// import { useNavigate } from "react-router-dom";

// const Panier = () => {
//   const [program, setProgram] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate(); // For navigation

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const response = await axios.get("/program");
//         setProgram(response.data);
//         console.log("Programmes:", response.data);
//       } catch (error) {
//         message.error("Failed to fetch programmes.");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanners();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-2 w-full">
//       <Row gutter={[16, 16]} justify="center">
//         {program.map((pro) => (
//           <Col xs={24} sm={12} md={8} lg={8} key={pro._id}>
//             <Card
//               hoverable
//               cover={
//                 <img
//                   alt="Programme"
//                   src={pro.imageUrl}
//                   className="h-40 w-full object-cover rounded-t-md"
//                 />
//               }
//               className="border border-gray-200 shadow-lg rounded-md"
//               onClick={() => navigate(`/create-command/${pro._id}`)} // Navigate on click
//               style={{
//                 height: '400px',  // Fixed height for all cards
//                 width: '100%', // Ensure card width is full
//                 display: 'flex', 
//                 flexDirection: 'column', // Align content vertically
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Card.Meta
//                 title={<span className="font-semibold">{pro.title}</span>}
//                 description={
//                   <p className="text-sm text-gray-600">{pro.mainText}</p>
//                 }
//               />
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Ajouter Commande
//               </Button>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   );
// };

// export default Panier;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Col, Row, message, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const Panier = () => {  // Assuming `id` is passed as a prop or retrieved from the URL
  const [program, setProgram] = useState([]);
  const [leadId, setLeadId] = useState(null);  // State for storing leadId
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {id} = useParams();  
  console.log("Lead ID:", id);

  // Fetch the lead details using the `id` prop
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`/lead/${id}`);
        setLeadId(response.data.chat);  // Assuming the lead id is stored in `chat._id`
        console.log("Lead Details:", response.data.chat);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };

    fetchLead();
  }, [id]);  // Dependency on `id`

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get("/program");
        setProgram(response.data);
        console.log("Programmes:", response.data);
      } catch (error) {
        message.error("Failed to fetch programmes.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);  // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle navigation to create command with leadId
  const handleNavigate = (programId) => {
    if (id) {
      navigate(`/create-command/${programId}?leadId=${id}`);
    } else {
      message.error("Lead ID is missing.");
    }
  };

  return (
    <div className="p-2 w-full">
      <Row gutter={[16, 16]} justify="center">
        {program.map((pro) => (
          <Col xs={24} sm={12} md={8} lg={8} key={pro._id}>
            <Card
              hoverable
              cover={
                <img
                  alt="Programme"
                  src={pro.imageUrl}
                  className="h-40 w-full object-cover rounded-t-md"
                />
              }
              className="border border-gray-200 shadow-lg rounded-md"
              onClick={() => handleNavigate(pro._id)} // Navigate on card click
              style={{
                height: '400px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Card.Meta
                title={<span className="font-semibold">{pro.title}</span>}
                description={
                  <p className="text-sm text-gray-600">{pro.mainText}</p>
                }
              />
              <Button
                type="primary"
                htmlType="submit"
                className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg"
              >
                Ajouter Commande
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Panier;
