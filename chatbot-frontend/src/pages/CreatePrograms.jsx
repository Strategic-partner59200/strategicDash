import React, { useEffect, useState } from "react";
import axios from "axios";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, message, Upload, Form, Input, Avatar } from "antd";
import { jwtDecode } from "jwt-decode";
import { Navigate, useParams } from "react-router-dom";

const CreatePrograms = () => {
  const [formData, setFormData] = useState({
    title: "",
    mainText: "",   
    imageUrl: "",
  });
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const res = axios
        .get(`/program/${id}`)
        .then((response) => {
          const { data } = response;
          setFormData(data);
          setImageUrl(data.imageUrl);
          console.log("image url:", data.imageUrl);
          form.setFieldsValue(data);
        })
        .catch((error) => {
          console.error("Error fetching programme:", error);
          message.error("Failed to fetch programme");
        });
      console.log("Responsedata:", res.data);
    } else {
      form.resetFields();
      setFormData({ title: "", mainText: "", imageUrl: "" });
    }
  }, [id, form]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
    
        return {
          ...prevState,
          [name]: value,
        };
    
    });
  };


  // Handle file upload changes
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0 && fileList[0].status === "done") {
      const uploadedImageUrl = fileList[0].response.secure_url;
      setImageUrl(uploadedImageUrl);
      setUploadedFileName(fileList[0].name);
      form.setFieldsValue({ imageUrl: uploadedImageUrl });
      console.log("Uploaded image URL:", uploadedImageUrl);
      setUploading(false);
      message.success(`${fileList[0].name} uploaded successfully.`);
    } else if (fileList.length > 0 && fileList[0].status === "error") {
      message.error(`${fileList[0].name} upload failed.`);
      setUploading(false);
    }
  };

  // Upload props for the Upload component
  const uploadProps = {
    name: "file",
    action: "https://api.cloudinary.com/v1_1/dltbbvgop/image/upload",
    data: {
      upload_preset: "Myinfo",
    },
    fileList,
    onChange: handleUploadChange,
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const formDataWithUser = { ...formData, userId, imageUrl };

    try {
      if (id) {
        setRedirect(false);
        await axios.put(`/program/${id}`, formDataWithUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Banner updated successfully!");
        setRedirect(true);
      } else {
        setRedirect(false);
        await axios.post("/program", formDataWithUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Programme created successfully!");
        setRedirect(true);
      }

      setFormData({
        title: "",
        mainText: "",
      
      });
      setImageUrl("");
      setUploadedFileName("");
      setFileList([]);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create banner.");
      console.error("Error creating banner:", error);
    } finally {
      setLoading(false);
    }
  };
  if (redirect) {
    return <Navigate to={"/programmes"} />;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Offres</h1>

      <Form
        className="space-y-4 p-4 bg-white rounded-lg shadow-md"
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
      >
        <p className="text-lg font-semibold mb-4">Création des offres</p>

        <Form.Item label="Image" name="imageUrl">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} loading={uploading}>
              Télécharger
            </Button>
          </Upload>
        </Form.Item>

        {(uploadedFileName || imageUrl) && (
          <Form.Item>
            <div className="flex flex-col items-start mt-2">
              <Avatar
                src={imageUrl}
                alt="Uploaded Image"
                className="w-48 h-48 mb-4 border border-gray-300 rounded-md object-cover"
              />

              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => {
                  form.setFieldsValue({ imageUrl: "" });
                  setImageUrl("");
                  setUploadedFileName("");
                  setFileList([]);
                }}
              />
            </div>
          </Form.Item>
        )}

        <Form.Item
          label="Titre d'offre"
          name="title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input
            value={formData.title}
            onChange={handleInputChange}
            name="title"
          />
        </Form.Item>

        <Form.Item
          label="Description d'offre"
          name="mainText"
          rules={[{ required: true, message: "Please input the main text!" }]}
        >
          <Input.TextArea
            value={formData.mainText}
            onChange={handleInputChange}
            name="mainText"
            rows={4}
          />
        </Form.Item>
       

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-purple-800 text-white w-full"
            loading={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePrograms;
