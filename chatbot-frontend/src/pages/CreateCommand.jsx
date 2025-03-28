// import { useForm } from "antd/es/form/Form";
// import React, { useState, useEffect } from "react";
// import { Form, Input, Radio, Button, message, DatePicker } from "antd";
// import { useParams } from "react-router-dom";
// import dayjs from "dayjs";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const CreateCommand = () => {
//   const [form] = useForm(); // Use Ant Design's form instance
//   const { id } = useParams();
//   const [program, setProgram] = useState({});
//   const TVA = 20; 
  

//   useEffect(() => {
//     const fetchProgram = async () => {
//       try {
//         const response = await axios.get('/program'); // Adjust endpoint
//         const foundProgram = response.data.find((item) => item._id === id);
//         setProgram(foundProgram);
//         if (foundProgram) {
//           form.setFieldsValue({
//             details: foundProgram.title,
//           });
//         }
//       } catch (error) {
//         message.error("Failed to fetch programmes.");
//         console.error(error);
//       }
//     };

//     fetchProgram();
//   }, [id, form]);

//   const handleFormSubmit = async (values) => {
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = token ? jwtDecode(token) : null;
//       if (!decodedToken) {
//         alert("User not authenticated");
//         return;
//       }
  
//       // Use userId as adminId (based on the decoded token)
//       const adminId = decodedToken.userId; // Use userId here
//       const formData = { ...values, details: program?.title || values.details,  admin: adminId, };
//       await axios.post("/command", formData);
//       message.success("Commande ajoutée avec succès!");
//     } catch (error) {
//       message.error("Impossible d'ajouter la commande.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold">Ajouter Commande:</h2>
//       <Form
//         form={form} // Attach the form instance
//         layout="vertical"
//         onFinish={handleFormSubmit}
//         className="space-y-4 border p-12 rounded-md shadow-md bg-white"
//         initialValues={{
//           details: program?.title || '', // Fallback if the program is not yet fetched
//         }}
//       >
//         <Form.Item
//           label="Type de Commande"
//           name="command_type"
//           className="font-bold"
//           rules={[
//             { required: true, message: "Type de commande est requis" },
//           ]}
//         >
//           <Radio.Group>
//             <Radio value="devis">Devis</Radio>
//             <Radio value="commande">Commande</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item label="Titre" className="font-bold" name="details">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item
//           label="Date"
//           name="date"
//           className="font-bold"
//           rules={[{ required: true, message: "La date est requise" }]}
//         >
//           <DatePicker
//             style={{ width: "100%" }}
//             placeholder="Sélectionnez une date"
//             format="YYYY-MM-DD"
//           />
//         </Form.Item>

//         <Form.Item
//           label="Prix"
//           name="prix"
//           className="font-bold"
//           rules={[
//             { required: true, message: "Le prix est requis" },
//             {
//               validator: (_, value) =>
//                 !value || parseFloat(value) > 0
//                   ? Promise.resolve()
//                   : Promise.reject(new Error("Le prix doit être un nombre positif")),
//             },
//           ]}
//         >
//           <Input type="number" placeholder="Entrez le prix" />
//         </Form.Item>

//         <Form.Item
//           label="Note"
//           className="font-bold"
//           name="note"
//           rules={[{ required: false }]}
//         >
//           <Input.TextArea rows={4} placeholder="Ajoutez une note ici" />
//         </Form.Item>

//         <Form.Item label="TVA">
//           <Input value={`${TVA}%`} disabled />
//         </Form.Item>

//         <div className="flex justify-end">
//           <Button
//             type="primary"
//             htmlType="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Ajouter Commande
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default CreateCommand;

import { useForm } from "antd/es/form/Form";
import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Button, message, DatePicker } from "antd";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation to access query params
import dayjs from "dayjs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CreateCommand = () => {
  const [form] = useForm(); // Use Ant Design's form instance
  const { id } = useParams(); // `id` is the programId
  const location = useLocation(); // Access the location to get query params
  const [program, setProgram] = useState({});
  const TVA = 20; 

  // Extract the `leadId` from the query params using URLSearchParams
  const searchParams = new URLSearchParams(location.search);
  const leadId = searchParams.get("leadId"); // This will give you the leadId from the query

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axios.get('/program'); // Adjust endpoint
        const foundProgram = response.data.find((item) => item._id === id);
        setProgram(foundProgram);
        if (foundProgram) {
          form.setFieldsValue({
            details: foundProgram.title,
          });
        }
      } catch (error) {
        message.error("Failed to fetch programmes.");
        console.error(error);
      }
    };

    fetchProgram();
  }, [id, form]);

  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = token ? jwtDecode(token) : null;
      if (!decodedToken) {
        alert("User not authenticated");
        return;
      }
  
      // Use userId as adminId (based on the decoded token)
      const adminId = decodedToken.userId; // Use userId here
      const formData = { 
        ...values, 
        details: program?.title || values.details,  
        admin: adminId,
        leadId: leadId // Use the leadId from the query parameter
      };

      // Send data to backend with leadId
      await axios.post("/command", formData);
      message.success("Commande ajoutée avec succès!");
    } catch (error) {
      message.error("Impossible d'ajouter la commande.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Ajouter Commande:</h2>
      <Form
        form={form} // Attach the form instance
        layout="vertical"
        onFinish={handleFormSubmit}
        className="space-y-4 border p-12 rounded-md shadow-md bg-white"
        initialValues={{
          details: program?.title || '', // Fallback if the program is not yet fetched
        }}
      >
        <Form.Item
          label="Type de Commande"
          name="command_type"
          className="font-bold"
          rules={[{ required: true, message: "Type de commande est requis" }]}
        >
          <Radio.Group>
            <Radio value="devis">Devis</Radio>
            <Radio value="commande">Commande</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Titre" className="font-bold" name="details">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          className="font-bold"
          rules={[{ required: true, message: "La date est requise" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Sélectionnez une date"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label="Prix"
          name="prix"
          className="font-bold"
          rules={[
            { required: true, message: "Le prix est requis" },
            {
              validator: (_, value) =>
                !value || parseFloat(value) > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Le prix doit être un nombre positif")),
            },
          ]}
        >
          <Input type="number" placeholder="Entrez le prix" />
        </Form.Item>

        <Form.Item
          label="Note"
          className="font-bold"
          name="note"
          rules={[{ required: false }]}
        >
          <Input.TextArea rows={4} placeholder="Ajoutez une note ici" />
        </Form.Item>

        <Form.Item label="TVA">
          <Input value={`${TVA}%`} disabled />
        </Form.Item>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Ajouter Commande
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateCommand;
