import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  Button,
  Input,
  Form,
  Calendar,
  Row,
  Col,
} from "antd";
import { jwtDecode } from "jwt-decode";
import { DeleteOutlined } from "@ant-design/icons";
import CalendarEvents from "../components/CalendarEvents";
import Command from "../components/Command";
import Panier from "./Panier";
import Devis from "../components/Devis";
import Produits from "../components/Produits";

const { TabPane } = Tabs;

const LeadDetailsPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [cartQuantity, setCartQuantity] = useState(0);
  const [refreshCart, setRefreshCart] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const handleRefreshCommands = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // Add this effect to load initial quantity PROPERLY
  // useEffect(() => {
  //   const loadInitialCart = async () => {
  //     try {
  //       // 1. First check localStorage (for quick UI update)
  //       const localCart = JSON.parse(localStorage.getItem("panierItems")) || [];
  //       const localQuantity = localCart.reduce(
  //         (sum, item) => sum + (item.quantite || 0),
  //         0
  //       );
  //       setCartQuantity(localQuantity);

  //       // 2. Then verify with backend (for accurate data)
  //       const response = await axios.get("/panier");
  //       const backendQuantity = response.data.reduce(
  //         (sum, item) => sum + (item.quantite || 0),
  //         0
  //       );

  //       // 3. Use whichever is larger (or implement your preferred merge logic)
  //       if (backendQuantity !== localQuantity) {
  //         setCartQuantity(backendQuantity);
  //         localStorage.setItem("panierItems", JSON.stringify(response.data));
  //         localStorage.setItem("cartQuantity", backendQuantity.toString());
  //       }
  //     } catch (error) {
  //       console.error("Error loading initial cart:", error);
  //     }
  //   };

  //   loadInitialCart();
  // }, []);
  useEffect(() => {
    const loadInitialCart = async () => {
      try {
        const leadId = id;
  
        // 1. Check localStorage and filter by leadId
        const localCart = JSON.parse(localStorage.getItem("panierItems")) || [];
        const filteredLocalCart = localCart.filter(
          (item) => item.lead === leadId
        );
  
        const localQuantity = filteredLocalCart.reduce(
          (sum, item) => sum + (item.quantite || 0),
          0
        );
        setCartQuantity(localQuantity);
  
        // 2. Verify with backend
        const response = await axios.get("/panier");
        const backendFiltered = response.data.filter(
          (item) => item.lead === leadId
        );
        const backendQuantity = backendFiltered.reduce(
          (sum, item) => sum + (item.quantite || 0),
          0
        );
  
        // 3. Update if different
        if (backendQuantity !== localQuantity) {
          setCartQuantity(backendQuantity);
          localStorage.setItem("panierItems", JSON.stringify(response.data));
          localStorage.setItem("cartQuantity", backendQuantity.toString());
        }
      } catch (error) {
        console.error("Error loading initial cart:", error);
      }
    };
  
    loadInitialCart();
  }, []);
  
  // In LeadDetailsPage.jsx
  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const localCart = JSON.parse(localStorage.getItem("panierItems")) || [];
  //     const newQuantity = localCart.reduce(
  //       (sum, item) => sum + (item.quantite || 0),
  //       0
  //     );
  //     setCartQuantity(newQuantity);
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);
  useEffect(() => {
    const leadId = id;
  
    const handleStorageChange = () => {
      const localCart = JSON.parse(localStorage.getItem("panierItems")) || [];
      const filteredCart = localCart.filter((item) => item.lead === leadId);
      const newQuantity = filteredCart.reduce(
        (sum, item) => sum + (item.quantite || 0),
        0
      );
      setCartQuantity(newQuantity);
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  



  const onDateSelect = (date) => {
    setSelectedDate(date);
    form.setFieldsValue({
      event_date: date.format("YYYY-MM-DD"), // Set selected date in the form field
    });
  };

  const handleFormSubmit = async (values) => {
    try {
      // Send values to your backend API to add a new lead
      const response = await axios.post("/data", values);
      console.log("Lead added successfully:", response.data);
      // Handle successful submission, e.g., show a success message or reset form
    } catch (error) {
      console.error("Error adding lead:", error);
      // Handle error (e.g., show error message)
    }
  };



  const handleFormSubmitCalendar = async (values) => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    if (!decodedToken) {
      alert("User not authenticated");
      return;
    }

    // Use userId as adminId (based on the decoded token)
    const adminId = decodedToken.userId; // Use userId here

    const eventData = {
      ...values, // This includes event_date, event_time, objective, and comment
      admin: adminId, // Add the userId as the admin field
      leadId: id, // Add the leadId to the event
    };

    try {
      const response = await axios.post("/events", eventData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for backend validation if needed
        },
      });
      console.log("Event added successfully:", response.data);
      form.resetFields(); // Reset form fields
      // Handle successful submission
    } catch (error) {
      console.error("Error adding event:", error);
      // Handle error
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // navigate(key === "2" ? `/lead/${id}/commentaires` : `/lead/${id}`);
  };

  useEffect(() => {
    // Set the active tab based on the route
    if (window.location.pathname.includes("commentaires")) {
      setActiveTab("2");
    } else {
      setActiveTab("1");
    }
  }, [window.location.pathname]);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`/lead/${id}`);
        setLead(response.data.chat);
        console.log("Lead Details:", response.data.chat);
        setComments(response.data.chat.commentaires || []);
        setFormData(response.data.chat);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };

    fetchLead();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return alert("Comment cannot be empty!");

    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    console.log("Decoded Token:", decodedToken);
    if (!decodedToken) {
      alert("User not authenticated");
      return;
    }

    try {
      const response = await axios.put(
        `/add-comment/${id}`,
        {
          text: newComment,
          name: decodedToken.name, // Send the name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for backend validation if needed
          },
        }
      );
      console.log("Sending comment:", {
        text: newComment,
        name: decodedToken.name, // This should match the expected structure
      });

      if (response.status === 200) {
        alert("Comment added successfully!");
        setComments(response.data.commentaires); // Update comments list
        setNewComment(""); // Clear input field
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Could not add comment, please try again.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/lead/${id}`, formData);
      if (response.status === 200) {
        alert("Changes saved successfully!");
        setLead(formData);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error saving changes, please try again.");
    }
  };

  if (!lead) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `/lead/${id}/delete-comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Comment deleted successfully!");
        setComments(comments.filter((comment) => comment._id !== commentId)); // Update comments list by removing the deleted comment
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Could not delete comment, please try again.");
    }
  };

  return (
    <div className="lg:max-w-6xl mx-auto mt-10 p-2">
      {/* Page Title */}
      <div className="flex-1 mb-12">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Details Lead
        </h1>
        <div className="flex justify-center mb-4">
          <span className="px-4 py-2 bg-purple-900 text-white font-bold rounded-full">
            {lead.request_name}
          </span>
        </div>
      </div>

      {/* Two Boxes Side by Side */}
      {/* <div className="flex justify-between space-x-4">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Informations" key="1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Informations Leads
                  </h2>
                  {[
                    { label: "Prénom et Nom", value: lead.request_lastname || "-" },
                    { label: "Email", value: lead.request_email || "-" },
                    { label: "Téléphone", value: lead.request_phone || "-" },
                    { label: "Status", value: lead.request_who || "-" },
                    { label: "Contacter", value: lead.initial || "-" },
                    { label: "Besoin", value: lead.information_request || "-" },
                    { label: "Status de lead", value: lead.type || "-" },
                  ].map(({ label, value }) => (
                    <div className="flex items-center gap-2" key={label}>
                      <p className="text-gray-600 font-semibold">{label}:</p>
                      <p className="text-gray-800 font-semibold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Informations Commercial
                  </h2>
                  {[
                    {
                      label: "Commercial prénom",
                      value: lead.commercial?.prenom || "-",
                    },
                    {
                      label: "Commercial nom",
                      value: lead.commercial?.nom || "-",
                    },
                  ].map(({ label, value }) => (
                    <div className="flex items-center gap-2" key={label}>
                      <p className="text-gray-600 font-semibold">{label}:</p>
                      <p className="text-gray-800 font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabPane>

            <TabPane tab="Commentaires" key="2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border rounded-lg"
                  />
                  <Button
                    type="primary"
                    onClick={handleAddComment}
                    className="bg-purple-800 text-white"
                  >
                    Submit
                  </Button>
                </div>
                <div className="mt-4">
                  {comments.length ? (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="p-4 border rounded-lg mb-2 bg-gray-100"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-gray-800">{comment.text}</p>
  
                            <p className="text-gray-600 text-sm">
                              {comment.addedAt
                                ? new Date(comment.addedAt).toLocaleString()
                                : "Unknown Date"}
                            </p>
                          </div>
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteComment(comment._id)}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      Aucun commentaire pour le moment.
                    </p>
                  )}
                </div>
              </div>
            </TabPane>
            <TabPane tab="Contact" key="3">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Ajouter un Lead
                </h2>
                <Form
                  form={form}
                  onFinish={handleFormSubmit}
                  layout="vertical"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      label="Nom et Prénom"
                      name="request_lastname"
                      rules={[
                        { required: true, message: "Prénom is required" },
                      ]}
                    >
                      <Input className="w-full p-2 border rounded-lg" />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="request_email"
                      rules={[
                        { required: true, message: "Email is required" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input className="w-full p-2 border rounded-lg" />
                    </Form.Item>

                    <Form.Item
                      label="Téléphone"
                      name="request_phone"
                      rules={[
                        { required: true, message: "Téléphone is required" },
                      ]}
                    >
                      <Input className="w-full p-2 border rounded-lg" />
                    </Form.Item>

                    <Form.Item
                      label="Status"
                      name="request_who"
                      rules={[
                        { required: true, message: "Status is required" },
                      ]}
                    >
                      <Input className="w-full p-2 border rounded-lg" />
                    </Form.Item>

                    <Form.Item
                      label="Contacter"
                      name="initial"
                      rules={[
                        { required: true, message: "Contacter is required" },
                      ]}
                    >
                      <Input className="w-full p-2 border rounded-lg" />
                    </Form.Item>

                    <Form.Item
                      label="Besoin"
                      name="information_request"
                      rules={[
                        { required: true, message: "Besoin is required" },
                      ]}
                    >
                      <Input className="w-full p-2 border rounded-lg" />
                    </Form.Item>
                  </div>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="px-4 py-2 bg-purple-800 text-white rounded-lg"
                    >
                      Ajouter Lead
                    </Button>
                  </div>
                </Form>
              </div>
            </TabPane>
            <TabPane tab="Calendar" key="4">
              <Row gutter={24}>
                <Col span={12}>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Ajouter un Événement
                    </h2>
                    <Form
                      form={form}
                      onFinish={handleFormSubmitCalendar}
                      layout="vertical"
                      className="space-y-4"
                    >
                      <Form.Item
                        label="Date"
                        name="event_date"
                        initialValue={
                          selectedDate
                            ? selectedDate.format("YYYY-MM-DD")
                            : null
                        }
                      >
                        <Input
                          readOnly
                          value={
                            selectedDate
                              ? selectedDate.format("YYYY-MM-DD")
                              : ""
                          }
                        />
                      </Form.Item>

                      <Form.Item
                        label="Heure"
                        name="event_time"
                        rules={[
                          { required: true, message: "Heure is required" },
                        ]}
                      >
                        <Input placeholder="HH:mm" />
                      </Form.Item>

                      <Form.Item
                        label="Objectif"
                        name="objective"
                        rules={[
                          { required: true, message: "Objectif is required" },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item label="Commentaire" name="comment">
                        <Input.TextArea rows={4} />
                      </Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="px-4 py-2 bg-purple-800 text-white rounded-lg"
                      >
                        Ajouter Événement
                      </Button>
                    </Form>
                  </div>
                </Col>
                <Col span={12}>
                  <Calendar onSelect={onDateSelect} fullscreen={true} />
                </Col>
              </Row>{" "}
              <CalendarEvents />
            </TabPane>
            <TabPane tab="Panier" key="5">
            <div className="space-y-4">
                  <Panier />   
            </div>
            </TabPane>
            <TabPane tab="Commande" key="6">
            <div className="space-y-4">
                  <Command />   
            </div>
            </TabPane>
          </Tabs>
        </div>
      </div> */}
      <div className="flex justify-between space-x-4">
      <div className="flex-1 bg-white shadow-md rounded-lg lg:p-6 p-4 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-full">
    <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <TabPane tab="Informations" key="1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column (Informations Leads) */}
          <div className="space-y-4 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Informations Leads</h2>
            {[{ label: "Prénom et Nom", value: lead.nom || "-" },
              { label: "Email", value: lead.email || "-" },
              { label: "Téléphone", value: lead.phone || "-" },
              { label: "Status", value: lead.status || "-" },
              { label: "Contacter", value: lead.besoin || "-" },
              { label: "Besoin", value: lead.demande || "-" },
              { label: "Status de lead", value: lead.type || "-" }
            ].map(({ label, value }) => (
              <div className="flex items-center gap-2" key={label}>
                <p className="text-gray-600 font-semibold">{label}:</p>
                <p className="text-gray-800 font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Right Column (Informations Commercial) */}
          <div className="space-y-4 mt-4">
            <h2 className="text-xl font-semibold text-gray-800">Informations Commercial</h2>
            {[{
              label: "Commercial prénom",
              value: lead.commercial?.prenom || "-",
            }, {
              label: "Commercial nom",
              value: lead.commercial?.nom || "-",
            }].map(({ label, value }) => (
              <div className="flex items-center gap-2" key={label}>
                <p className="text-gray-600 font-semibold">{label}:</p>
                <p className="text-gray-800 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </TabPane>

      {/* <TabPane tab="Commentaires" key="2">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded-lg"
            />
            <Button
              type="primary"
              onClick={handleAddComment}
              className="bg-purple-800 text-white"
            >
              Submit
            </Button>
          </div>
          <div className="mt-4">
            {comments.length ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-4 border rounded-lg mb-2 bg-gray-100"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-800">{comment.text}</p>
                      <p className="text-gray-600 text-sm">
                        {comment.addedAt
                          ? new Date(comment.addedAt).toLocaleString()
                          : "Unknown Date"}
                      </p>
                    </div>
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteComment(comment._id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Aucun commentaire pour le moment.</p>
            )}
          </div>
        </div>
      </TabPane> */}
      <TabPane tab="Commentaires" key="2">
  <div className="space-y-4">
    {/* Comment Input and Submit Button */}
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Input
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded-lg"
      />
      <Button
        type="primary"
        onClick={handleAddComment}
        className="bg-purple-800 text-white mt-4 sm:mt-0 sm:ml-4"
      >
        Submit
      </Button>
    </div>

    {/* Comments List */}
    <div className="mt-4">
      {comments.length ? (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="p-4 border rounded-lg mb-2 bg-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-gray-800">{comment.text}</p>
                <p className="text-gray-600 text-sm">
                  {comment.addedAt
                    ? new Date(comment.addedAt).toLocaleString()
                    : "Unknown Date"}
                </p>
              </div>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteComment(comment._id)}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">Aucun commentaire pour le moment.</p>
      )}
    </div>
  </div>
</TabPane>


      <TabPane tab="Contact" key="3">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Ajouter un Lead</h2>

          <Form
            form={form}
            onFinish={handleFormSubmit}
            layout="vertical"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                label="Prénom"
                name="prénom"
                rules={[{ required: true, message: "Prénom est requis" }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Nom"
                name="nom"
                rules={[{ required: true, message: "Nom est requis" }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>
              <Form.Item
                label="Adresse"
                name="address"
                rules={[{ required: true, message: "L'address est requis." }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Ville"
                name="ville"
                rules={[{ required: true, message: "Ville est requis." }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>
              <Form.Item
                label="Codepostal"
                name="codepostal"
                rules={[{ required: true, message: "Codepostal est requis." }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Email est requis." }, {
                  type: "email", message: "Veuillez entrer une adresse e-mail valide."
                }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Téléphone"
                name="phone"
                rules={[{ required: true, message: "Téléphone is required" }]}
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Contacter"
                name="besoin"
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>

              <Form.Item
                label="Besoin"
                name="demande"
              >
                <Input className="w-full p-2 border rounded-lg" />
              </Form.Item>
            </div>

            <div className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                className="px-4 py-2 bg-purple-800 text-white rounded-lg"
              >
                Ajouter Lead
              </Button>
            </div>
          </Form>
        </div>
      </TabPane>

      {/* <TabPane tab="Calendar" key="4">
        <Row gutter={24}>

          <Col xs={24} sm={12}>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Ajouter un Événement</h2>
              <Form
                form={form}
                onFinish={handleFormSubmitCalendar}
                layout="vertical"
                className="space-y-4"
              >
                <Form.Item label="Date" name="event_date">
                  <Input readOnly value={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""} />
                </Form.Item>

                <Form.Item label="Heure" name="event_time" rules={[{ required: true }]}>
                  <Input placeholder="HH:mm" />
                </Form.Item>

                <Form.Item label="Objectif" name="objective" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>

                <Form.Item label="Commentaire" name="comment">
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="px-4 py-2 bg-purple-800 text-white rounded-lg"
                >
                  Ajouter Événement
                </Button>
              </Form>
            </div>
          </Col>

       
          <Col xs={24} sm={12}>
            <Calendar onSelect={onDateSelect} fullscreen />
          </Col>
        </Row>
      </TabPane> */}
      <TabPane tab="Calendar" key="4">
  <Row gutter={24}>
    {/* Left Column for Event Details */}
    <Col xs={24} sm={12}>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Ajouter un Événement</h2>
        <Form
          form={form}
          onFinish={handleFormSubmitCalendar}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item label="Date" name="event_date">
            <Input readOnly value={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""} />
          </Form.Item>

          <Form.Item label="Heure" name="event_time" rules={[{ required: true }]}>
            <Input placeholder="HH:mm" />
          </Form.Item>

          <Form.Item label="Objectif" name="objective" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Commentaire" name="comment">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="px-4 py-2 bg-purple-800 text-white rounded-lg"
          >
            Ajouter Événement
          </Button>
        </Form>
      </div>
    </Col>

    {/* Right Column for Calendar */}
    <Col xs={24} sm={12}>
      <Calendar onSelect={onDateSelect} fullscreen />
    </Col>
  </Row>
  <CalendarEvents />
</TabPane>

<TabPane tab="Produits" key="5">
              <div className="space-y-4">
                <Produits
                  onCartChange={(newQuantity) => {
                    setCartQuantity(newQuantity); // Directly use the passed quantity
                    setRefreshCart((prev) => !prev); // Also trigger refresh
                  }}
                  refreshTrigger={refreshCart}
                />
              </div>
            </TabPane>
<TabPane tab={`Panier (${cartQuantity})`} key="6">
              <div className="space-y-4">
                <Panier
                  setCartQuantity={setCartQuantity}
                  refreshTrigger={refreshCart}
                />
              </div>
            </TabPane>
            <TabPane tab="Devis à valider" key="7">
              <div className="space-y-4">
                <Devis onValidate={handleRefreshCommands}/>
              </div>
            </TabPane>
            <TabPane tab="Commande" key="8">
              <div className="space-y-4">
                <Command key={refreshCounter} />
              </div>
            </TabPane>
    </Tabs>
  </div>
</div>

      {/* <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/leads")}
          className="bg-purple-800 hover:bg-purple-900 underline text-white font-semibold py-2 px-4 rounded"
        >
          Retour
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded"
        >
          Modifier Lead
        </button>
      </div> */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4 sm:gap-6">
  <button
    onClick={() => navigate("/leads")}
    className="bg-purple-800 hover:bg-purple-900 underline text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
  >
    Retour
  </button>
  <button
    onClick={() => setIsModalOpen(true)}
    className="bg-purple-800 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
  >
    Modifier Lead
  </button>
</div>


      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 sm:w-3/4 lg:w-2/4 transform transition-transform duration-300 ease-in-out scale-95 hover:scale-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Modify Lead
            </h2>
            <div className="flex flex-col space-y-6 justify-center">
              {/* Form Fields */}
              <div className="flex gap-4">
                {/* <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="request_name"
                    value={formData.request_name || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter Lead's Name"
                  />
                </div> */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="request_email"
                    value={formData.request_email || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter Lead's Email"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="request_phone"
                    value={formData.request_phone || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter Lead's Phone"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Prénom et Nom
                  </label>
                  <input
                    type="text"
                    name="request_lastname"
                    value={formData.request_lastname || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter Lead prenom"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Contacter
                  </label>
                  <input
                    type="text"
                    name="initial"
                    value={formData.initial || "-"}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter raison de contact"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Besoin
                  </label>
                  <input
                    type="text"
                    name="information_request"
                    value={formData.information_request || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter Lead's besoin"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-medium text-gray-700">
                    Status
                  </label>
                  <input
                    type="text"
                    name="request_who"
                    value={formData.request_who || ""}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter Campus Name"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between space-x-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-purple-800 hover:bg-purple-900 text-white font-medium py-3 px-6 rounded-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetailsPage;
