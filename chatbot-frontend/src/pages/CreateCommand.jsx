

// import { useForm } from "antd/es/form/Form";
// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   Radio,
//   Button,
//   message,
//   DatePicker,
//   Row,
//   Col,
//   Table,
// } from "antd";
// import { useParams,  useNavigate, useLocation } from "react-router-dom";
// import dayjs from "dayjs";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const CreateCommand = () => {
//   const [form] = useForm();
//   const { id } = useParams();
//   const location = useLocation();
// const commandId = location.state?.commandId;

//   const [leads, setLeads] = useState({});
//   const TVA = 20;
//   const [panierItems, setPanierItems] = useState([]);
//   const navigate = useNavigate();


//   useEffect(() => {
//     const fetchCommand = async () => {
//       console.log("commandId", commandId)
//       if (commandId) {
//         try {
//           const response = await axios.get(`/commands/${commandId}`);
//           const commandData = response.data;
  
//           // Optional: log or inspect the data to confirm structure
//           console.log("Fetched Command:", commandData);
  
//           form.setFieldsValue({
//             command_type: commandData.command_type,
//             date: dayjs(commandData.date),
//             request_lastname: commandData.request_lastname,
//             request_email: commandData.request_email,
//             request_phone: commandData.request_phone,
//             siret: commandData.siret,
//             codepostal: commandData.codepostal,
//             raissociale: commandData.raissociale,
//             ville: commandData.ville,
//             adresse: commandData.adresse,
//           });
  
//           if (commandData.panierItems) {
//             setPanierItems(commandData.panierItems);
//           }
  
//         } catch (error) {
//           console.error("Erreur lors de la récupération de la commande:", error);
//           message.error("Échec du chargement des données de commande.");
//         }
//       }
//     };
  
//     fetchCommand();
//   }, [commandId, form]);
  

//   useEffect(() => {
//     const fetchLead = async () => {
//       try {
//         const response = await axios.get(`/lead/${id}`);
//         console.log('response', response)
//         const foundLead = response.data.chat;
//         setLeads(foundLead);
//         if (foundLead) {
//           form.setFieldsValue({
//             request_name: foundLead.request_name,
//             request_lastname: foundLead.request_lastname,
//             request_email: foundLead.request_email,
//             request_phone: foundLead.request_phone,
//             request_who: foundLead.request_who,
//           });
//         }
//       } catch (error) {
//         message.error("Failed to fetch lead.");
//         console.error(error);
//       }
//     };
//     fetchLead();
//   }, [id, form]);


//   const handleFormSubmit = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = token ? jwtDecode(token) : null;
//       if (!decodedToken) {
//         alert("User not authenticated");
//         return;
//       }

//       const adminId = decodedToken.userId;
//       const commercialId = decodedToken.commercialId || null;
//       const formData = {
//         ...values,
//         admin: adminId,
//         commercial: commercialId,
//         leadId: id,
//         description: panierItems.map((item) => item.description).join(", "),
//         code: panierItems.map((item) => item.code).join(", "),
//         marque: panierItems.map((item) => item.marque).join(", "),
//         totalHT: panierItems.reduce((acc, item) => acc + item.montantHT, 0),
//         totalTVA: panierItems.reduce((acc, item) => acc + item.montantTVA, 0),
//         totalTTC: panierItems.reduce((acc, item) => acc + item.montantTTC, 0),
//         quantite: panierItems.reduce((acc, item) => acc + item.quantite, 0),
//       };
//       if (commandId) {
//         await axios.put(`/command/${commandId}`, formData);
//         message.success("Commande mise à jour avec succès !");
//       } else {
//         await axios.post("/command", formData);
//         message.success("Commande ajoutée avec succès !");
//       }

//       // await axios.post("/command", formData);
//       message.success("Commande ajoutée avec succès!");
//       navigate(`/lead/${id}`);
//     } catch (error) {
//       message.error("Impossible d'ajouter la commande.");
//       console.error(error);
//     }
//   };
  
//   useEffect(() => {
//     const fetchCartData = async () => {
//       try {
//         // Always get fresh data from backend first
//         const response = await axios.get("/panier");
//         console.log('response', response)
//         setPanierItems(response.data);
//       } catch (error) {
//        console.log('error', error.message)
//       }
//     };

//     fetchCartData();
//   }, []);
  
//   const columns = [
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Quantité",
//       key: "quantite",
//       render: (_, record) => (
//        <div>
//           {record.quantite}
//           </div>
//       ),
//     },
//     {
//       title: "Prix Unitaire",
//       dataIndex: "prixUnitaire",
//       key: "prixUnitaire",
//     },
//     {
//       title: "Montant HT",
//       dataIndex: "montantHT",
//       key: "montantHT",
//     },
//     {
//       title: "TVA",
//       dataIndex: "montantTVA",
//       key: "montantTVA",
//     },
//     {
//       title: "Montant TTC",
//       dataIndex: "montantTTC",
//       key: "montantTTC",
//     },
   
//   ];

//   return (
//     <div className="p-12">
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleFormSubmit}
//         className="space-y-4 border p-12 rounded-md shadow-md bg-white"
//       >
//        <div className="flex items-center justify-center mr-6">
//        <Form.Item
//           // label="Type de Commande"
//           name="command_type"
//           className="font-bold"
//           rules={[{ required: true, message: "Type de commande est requis" }]}
//         >
//           <Radio.Group>
//             <Radio value="devis">Devis</Radio>
//             <Radio value="commande">Commande</Radio>
//           </Radio.Group>
//         </Form.Item>
//        </div>        
    

//         <Row gutter={16}>
//         <Col span={12}>
//             <Form.Item
//               label="Date"
//               name="date"
//               rules={[{ required: true, message: "La date est requise" }]}
//             >
//               <DatePicker
//                 style={{ width: "100%" }}
//                 placeholder="Sélectionnez une date"
//                 format="YYYY-MM-DD"
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label="Prénom et Nom"
//               name="request_lastname"
//               rules={[{ required: false, message: "Le prénom est requis" }]}
//             >
//               <Input placeholder="Prénom du client" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Email"
//               name="request_email"
//               rules={[{ required: false, message: "L'email est requis" }]}
//             >
//               <Input placeholder="Email du client" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label="Téléphone"
//               name="request_phone"
//               rules={[{ required: false, message: "Le téléphone est requis" }]}
//             >
//               <Input placeholder="Téléphone du client" />
//             </Form.Item>
//           </Col>
//         </Row>
    
//         <Row gutter={16}>
//         <Col span={12}>
//             <Form.Item label="TVA">
//               <Input value={`${TVA}%`} disabled />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label="Siret"
//               name="siret"
//               rules={[{ required: false, message: "Ce champ est requis" }]}
//             >
//               <Input placeholder="Siret" />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Code Postal"
//               name="codepostal"
//               rules={[{ required: false, message: "Code postal est requis" }]}
//             >
//               <Input placeholder="Code Postal" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label="Raissociale"
//               name="raissociale"
//               rules={[{ required: false, message: "Raissociale est requis" }]}
//             >
//               <Input placeholder="Raissociale" />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               label="Ville"
//               name="ville"
//               rules={[{ required: false, message: "La ille est requis" }]}
//             >
//               <Input placeholder="Ville" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               label="Adresse"
//               name="adresse"
//               rules={[{ required: false, message: "L'adresse est requis" }]}
//             >
//               <Input placeholder="Adresse" />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={16}>
         
//           <Col span={12}>
          
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 className="mt-8 bg-blue-600 text-white rounded-lg"
//               >
//                 Enregistrer la commande
//               </Button>
//           </Col>
//         </Row>
//       </Form>
//      <div className="mt-6">
//      <Table
//         columns={[
//           ...columns.map((col) => ({
//             ...col,
//             title: (
//               <div className="flex flex-col items-center">
//                 <div className="text-xs">{col.title}</div>
//               </div>
//             ),
//           })),
//         ]}
//         dataSource={panierItems}
//         pagination={false}
//         // rowKey={(record) => record.produit._id}
//         rowKey={(record) => record._id || record.produit?._id || Math.random()}
//       />
//      </div>
//     </div>
//   );
// };

// export default CreateCommand;
import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Button,
  message,
  DatePicker,
  Row,
  Col,
  Table,
} from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CreateCommand = () => {
  const [form] = useForm();
  const { id } = useParams();
  const location = useLocation();
  const commandId = location.state?.commandId;

  const [leads, setLeads] = useState({});
  const TVA = 20;
  const [panierItems, setPanierItems] = useState([]);
  const navigate = useNavigate();

  const generateRandomNumber = (prefix) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // generates 6 random digits
    return `${prefix}${randomNum}`;
  };

  const handleCommandTypeChange = (value) => {
    const prefix = value === "devis" ? "D" : "C";
    const randomNumber = generateRandomNumber(prefix);
    form.setFieldsValue({
      numCommand: randomNumber,
    });
  };

  useEffect(() => {
    const fetchCommand = async () => {
      if (commandId) {
        try {
          const response = await axios.get(`/commands/${commandId}`);
          const commandData = response.data;

          form.setFieldsValue({
            command_type: commandData.command_type,
            date: dayjs(commandData.date),
            request_lastname: commandData.request_lastname,
            request_email: commandData.request_email,
            request_phone: commandData.request_phone,
            siret: commandData.siret,
            codepostal: commandData.codepostal,
            raissociale: commandData.raissociale,
            ville: commandData.ville,
            adresse: commandData.adresse,
            numCommand: commandData.numCommand,
          });

          if (commandData.panierItems) {
            setPanierItems(commandData.panierItems);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la commande:", error);
          message.error("Échec du chargement des données de commande.");
        }
      }
    };

    fetchCommand();
  }, [commandId, form]);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`/lead/${id}`);
        const foundLead = response.data.chat;
        setLeads(foundLead);
        if (foundLead) {
          form.setFieldsValue({
            request_name: foundLead.request_name,
            request_lastname: foundLead.request_lastname,
            request_email: foundLead.request_email,
            request_phone: foundLead.request_phone,
            request_who: foundLead.request_who,
          });
        }
      } catch (error) {
        message.error("Failed to fetch lead.");
        console.error(error);
      }
    };
    fetchLead();
  }, [id, form]);

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = token ? jwtDecode(token) : null;
      if (!decodedToken) {
        alert("User not authenticated");
        return;
      }

      const adminId = decodedToken.userId;
      const commercialId = decodedToken.commercialId || null;
      const formData = {
        ...values,
        admin: adminId,
        commercial: commercialId,
        leadId: id,
        description: panierItems.map((item) => item.description).join(", "),
        code: panierItems.map((item) => item.code).join(", "),
        marque: panierItems.map((item) => item.marque).join(", "),
        totalHT: panierItems.reduce((acc, item) => acc + item.montantHT, 0),
        totalTVA: panierItems.reduce((acc, item) => acc + item.montantTVA, 0),
        totalTTC: panierItems.reduce((acc, item) => acc + item.montantTTC, 0),
        quantite: panierItems.reduce((acc, item) => acc + item.quantite, 0),
      };
      console.log("formData", formData);
      if (commandId) {
        await axios.put(`/command/${commandId}`, formData);
        message.success("Commande mise à jour avec succès !");
      } else {
        await axios.post("/command", formData);
        message.success("Commande ajoutée avec succès !");
      }

      navigate(`/lead/${id}`);
    } catch (error) {
      message.error("Impossible d'ajouter la commande.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get("/panier");
        setPanierItems(response.data);
      } catch (error) {
        console.log("error", error.message);
      }
    };

    fetchCartData();
  }, []);

  const columns = [
    {
      title: "Référence",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Quantité",
      key: "quantite",
      render: (_, record) => <div>{record.quantite}</div>,
    },
    {
      title: "Prix Unitaire",
      dataIndex: "prixUnitaire",
      key: "prixUnitaire",
    },
    {
      title: "Montant HT",
      dataIndex: "montantHT",
      key: "montantHT",
    },
    {
      title: "TVA",
      dataIndex: "montantTVA",
      key: "montantTVA",
    },
    {
      title: "Montant TTC",
      dataIndex: "montantTTC",
      key: "montantTTC",
    },
  ];

  return (
    <div className="p-12">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-4 border p-12 rounded-md shadow-md bg-white"
      >
        <div className="flex items-center justify-center mr-6">
          <Form.Item
            name="command_type"
            className="font-bold"
            rules={[{ required: true, message: "Type de commande est requis" }]}
          >
            <Radio.Group onChange={(e) => handleCommandTypeChange(e.target.value)}>
              <Radio value="devis">Devis</Radio>
              <Radio value="commande">Commande</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Numéro de Commande" name="numCommand" rules={[{ required: true, message: "Numéro de commande est requis" }]}>
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "La date est requise" }]}
            >
              <DatePicker style={{ width: "100%" }} placeholder="Sélectionnez une date" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>

                <Row gutter={16}>
                <Col span={12}>
            <Form.Item
              label="Prénom et Nom"
              name="request_lastname"
              rules={[{ required: false, message: "Le prénom est requis" }]}
            >
              <Input placeholder="Prénom du client" />
            </Form.Item>
          </Col>
                <Col span={12}>
            <Form.Item
              label="Adresse"
              name="adresse"
              rules={[{ required: false, message: "L'adresse est requis" }]}
            >
              <Input placeholder="Adresse" />
            </Form.Item>
          </Col>
         
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="request_email"
              rules={[{ required: false, message: "L'email est requis" }]}
            >
              <Input placeholder="Email du client" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Téléphone"
              name="request_phone"
              rules={[{ required: false, message: "Le téléphone est requis" }]}
            >
              <Input placeholder="Téléphone du client" />
            </Form.Item>
          </Col>
        </Row>
    
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item label="TVA">
              <Input value={`${TVA}%`} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Siret"
              name="siret"
              rules={[{ required: false, message: "Ce champ est requis" }]}
            >
              <Input placeholder="Siret" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Code Postal"
              name="codepostal"
              rules={[{ required: false, message: "Code postal est requis" }]}
            >
              <Input placeholder="Code Postal" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Raissociale"
              name="raissociale"
              rules={[{ required: false, message: "Raissociale est requis" }]}
            >
              <Input placeholder="Raissociale" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ville"
              name="ville"
              rules={[{ required: false, message: "La ille est requis" }]}
            >
              <Input placeholder="Ville" />
            </Form.Item>
          </Col>
        
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Button type="primary" htmlType="submit" className="mt-8 bg-blue-600 text-white rounded-lg">
              Enregistrer la commande
            </Button>
          </Col>
        </Row>
      </Form>
      
      <div className="mt-6">
        <Table
          columns={[...columns.map((col) => ({ ...col, title: <div className="flex flex-col items-center"><div className="text-xs">{col.title}</div></div> }))]}
          dataSource={panierItems}
          pagination={false}
          rowKey={(record) => record._id || record.produit?._id || Math.random()}
        />
      </div>
    </div>
  );
};

export default CreateCommand;
