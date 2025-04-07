import React, { useState } from "react";
import { Upload, Button, message, List, Modal, Table } from "antd";
import {
  UploadOutlined,
  FileExcelOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "axios";

const ImportLeads = ({ onImportSuccess = () => {} }) => {
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [importedFiles, setImportedFiles] = useState([]);

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length) {
        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        const leads = rows.map((row) => {
          const lead = {};
          headers.forEach((header, index) => {
            lead[header.toLowerCase()] = row[index];
          });

          lead.ville = lead.ville;
          lead.speciality = lead.speciality;
          delete lead.password;

          return lead;
        });

        console.log("Données des leads analysées:", leads);
        setFileData(leads);
        setFileName(file.name);
        message.success("Fichier téléchargé avec succès");
      } else {
        message.error("Aucune donnée trouvée dans le fichier");
      }
    };
    reader.readAsBinaryString(file);
  };


  const handleTransfer = async () => {
    if (!fileData) {
      message.error("Aucune donnée à transférer");
      return;
    }

    try {
      const validData = fileData.filter((lead) => {
        return lead.phone;
      });

      console.log("Données valides:", validData);

      const emailSet = new Set();
      const uniqueData = validData.map((lead) => {
        if (lead.phone) {
          emailSet.add(lead.phone);
        }
        return lead;
      });

      console.log("Données uniques:", uniqueData);
   
      // Split the cleaned data into smaller batches
      const batchSize = 50; // You can adjust the batch size if needed

      for (let i = 0; i < uniqueData.length; i += batchSize) {
        const batch = uniqueData.slice(i, i + batchSize);
      

        // Log the size of each batch
        console.log(
          `Batch ${Math.floor(i / batchSize) + 1} payload size:`,
          JSON.stringify(batch).length,
          "bytes"
        );

        const response = await axios.post(
          "/import",
          batch,
        );
        console.log("Batch imported successfully:", response.data);
        console.log(
          `Batch ${Math.floor(i / batchSize) + 1} imported successfully.`
        );
      }

      message.success("Leads importés avec succès");
      onImportSuccess(); // Trigger the success callback
      setImportedFiles([...importedFiles, fileName]);
      setFileData(null);
      setFileName(null);
    } catch (error) {
      console.error("Erreur lors de l'importation des leads:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Erreur inconnue";
      message.error(`Erreur lors de l'importation des leads: ${errorMessage}`);
    }
  };

  const handleRemove = () => {
    setFileData(null);
    setFileName(null);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error(`${file.name} n'est pas un fichier Excel`);
      }
      return isExcel || Upload.LIST_IGNORE;
    },
    customRequest: handleUpload,
  };

  const columns =
    fileData && fileData.length > 0
      ? Object.keys(fileData[0]).map((key) => ({
          title: key,
          dataIndex: key,
          key,
        }))
      : [];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Importer des Leads :</h2>
      <Upload {...uploadProps} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Télécharger le fichier Excel</Button>
      </Upload>
      {fileName && (
        <div className="mt-4">
          <List
            itemLayout="horizontal"
            dataSource={[fileName]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={handleRemove}
                  />,
                  <Button type="link" onClick={() => setIsModalVisible(true)}>
                    Aperçu
                  </Button>,
                ]}
              >
                <List.Item.Meta avatar={<FileExcelOutlined />} title={item} />
              </List.Item>
            )}
          />
          <Button type="primary" onClick={handleTransfer} className="mt-4">
            Transférer dans la base de données
          </Button>
        </div>
      )}
      <Modal
        title="Aperçu du fichier Excel"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={fileData}
          rowKey={(record) => `${record.nom}-${record.email}`}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Modal>
      <div className="mt-4">
        <h2>Archive des fichiers importés</h2>
        <List
          itemLayout="horizontal"
          dataSource={importedFiles}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta avatar={<FileExcelOutlined />} title={item} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ImportLeads;
