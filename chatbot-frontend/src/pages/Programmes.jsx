// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, Col, Row, message, Button } from "antd";
// import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";

// const Programmes = () => {
//   const [program, setProgram] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

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

//   const handleCreateNewBanner = () => {
//     navigate("/create-programmes");
//   };

//   const handleDeleteBanner = async (programId) => {
//     try {
//       await axios.delete(`/program/${programId}`);
//       const updatedBanners = program.filter((program) => program._id !== programId);
//       setProgram(updatedBanners);
//       message.success("Programme deleted successfully!");
//     } catch (error) {
//       message.error("Failed to delete Programme.");
//       console.error(error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4">
//       <div className="mb-6">
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           className="bg-purple-800 text-white"
//           onClick={handleCreateNewBanner}
//         >
//           Créer un offre
//         </Button>
//       </div>

//       <h1 className="text-2xl font-bold mb-4">Offres</h1>
//      <div className="w-full">
//      <Row gutter={[16, 16]} justify="center">
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
//             >
//               <Card.Meta
//                 title={<span className="font-semibold">{pro.title}</span>}
//                 description={<p className="text-sm text-gray-600">{pro.mainText}</p>}
//               />
//               <div className="mt-4 flex justify-between">
//                 <Link to={`/create-programmes/${pro._id}`}>
//                   <Button icon={<EditOutlined />} type="primary" />
//                 </Link>
//                 <Button
//                   icon={<DeleteOutlined />}
//                   type="danger"
//                   onClick={() => handleDeleteBanner(pro._id)}
//                 />
//               </div>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//      </div>
//     </div>
//   );
// };

// export default Programmes;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, Col, Row, message, Button } from "antd";
// import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";

// const Programmes = () => {
//   const [program, setProgram] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

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

//   const handleCreateNewBanner = () => {
//     navigate("/create-programmes");
//   };

//   const handleDeleteBanner = async (programId) => {
//     try {
//       await axios.delete(`/program/${programId}`);
//       const updatedBanners = program.filter((program) => program._id !== programId);
//       setProgram(updatedBanners);
//       message.success("Programme deleted successfully!");
//     } catch (error) {
//       message.error("Failed to delete Programme.");
//       console.error(error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4">
//       <div className="mb-6">
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           className="bg-purple-800 text-white"
//           onClick={handleCreateNewBanner}
//         >
//           Créer un offre
//         </Button>
//       </div>

//       <h1 className="text-2xl font-bold mb-4">Offres</h1>
//       <div className="w-full">
//         <Row gutter={[16, 16]} justify="center">
//           {program.map((pro) => (
//             <Col xs={24} sm={12} md={8} lg={8} key={pro._id}>
//               <Card
//                 hoverable
//                 cover={
//                   <img
//                     alt="Programme"
//                     src={pro.imageUrl}
//                     className="h-48 w-full object-cover rounded-t-md"
//                   />
//                 }
//                 className="border border-gray-200 shadow-lg rounded-md flex flex-col justify-between h-96"
//               >
//                 <div className="flex-grow">
//                   <Card.Meta
//                     title={<span className="font-semibold text-2xl">{pro.title}</span>}
//                     description={<p className="text-lg text-gray-900">{pro.mainText}</p>}
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-between">
//                   <Link to={`/create-programmes/${pro._id}`}>
//                     <Button icon={<EditOutlined />} type="primary" />
//                   </Link>
//                   <Button
//                     icon={<DeleteOutlined />}
//                     type="danger"
//                     onClick={() => handleDeleteBanner(pro._id)}
//                   />
//                 </div>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </div>
//     </div>
//   );
// };

// export default Programmes;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Button } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const Programmes = () => {
  const [program, setProgram] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
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

    fetchBanners();
  }, []);

  const handleCreateNewBanner = () => {
    navigate("/create-programmes");
  };

  const handleDeleteBanner = async (programId) => {
    try {
      await axios.delete(`/program/${programId}`);
      const updatedBanners = program.filter((program) => program._id !== programId);
      setProgram(updatedBanners);
      message.success("Programme deleted successfully!");
    } catch (error) {
      message.error("Failed to delete Programme.");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-purple-800 text-white"
          onClick={handleCreateNewBanner}
        >
          Ajouter produit
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Produits</h1>

      <div className="program-container">
        {program.map((pro) => (
          <div className="program-card" key={pro._id}>
            <div className="program-card-image">
              <img
                alt="Programme"
                src={pro.imageUrl}
                className="w-full object-cover rounded-t-md"
                style={{ height: '200px', objectFit: 'cover' }} // Fixed height for the image
              />
            </div>
            <div className="program-card-content">
              <h2 className="program-title">{pro.title}</h2>
              <p className="program-description">{pro.mainText}</p>
            </div>
            <div className="program-card-actions">
              <Link to={`/create-programmes/${pro._id}`}>
                <Button icon={<EditOutlined />} type="primary" />
              </Link>
              <Button
                icon={<DeleteOutlined />}
                type="danger"
                onClick={() => handleDeleteBanner(pro._id)}
                className="text-red-500 text-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Programmes;

