import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Space, message, Card, Descriptions, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const Devis = ({ onValidate, shouldRefresh }) => {
  const [commands, setCommands] = useState([]);
  const { id } = useParams(); // Assuming leadId is part of the route parameter
  const navigate = useNavigate();
  const [selectedCommand, setSelectedCommand] = useState(null);

  // useEffect(() => {
  //   const fetchCommands = async () => {
  //     try {
  //       const response = await axios.get(`/command/${id}`);
  //       const filteredCommands = response.data.filter(
  //         (command) =>
  //           command.command_type === "devis" ||
  //           (command.command_type === "commande" &&
  //             command.lead.toString() === id)
  //       );
  //       setCommands(filteredCommands);
  //     } catch (error) {
  //       console.error("Error fetching commands:", error);
  //     }
  //   };
  //   fetchCommands();
  // }, [id]);
  const fetchCommands = async () => {
    try {
      const response = await axios.get(`/command/${id}`);
      console.log("Fetched Commands:", response.data);
      const filteredCommands = response.data.filter(
        (command) =>
          command.command === "devis" && command.lead.toString() === id
      );
      setCommands(filteredCommands);
    } catch (error) {
      console.error("Error fetching commands:", error);
    }
  };

  useEffect(() => {
    if (shouldRefresh) {
      fetchCommands();
    }
  }, [shouldRefresh, id]);



  const handleUpdate = (commandId) => {
    navigate(`/leads/${id}/create-command/${commandId}`, {
      state: { commandId },
    });
  };
  const handleViewDetails = (commandId) => {
    const selected = commands.find((cmd) => cmd._id === commandId);
    setSelectedCommand(selected);
  };

  const handleValidate = async (commandId) => {
    try {
      // Find the command to update
      const currentCommand = commands.find(
        (command) => command._id === commandId
      );
      if (!currentCommand) {
        console.error("Commande non trouvée");
        return;
      }

      // 🔒 Prevent double validation
      if (currentCommand.command_type === "commande") {
        message.warning("⚠️ Le devis est déjà changé en commande.");
        return;
      }

      // Replace only the first character from D to C
      const oldNumCommand = currentCommand.numCommand;
      const newNumCommand = "C" + oldNumCommand.slice(1);

      console.log("Old numCommand:", oldNumCommand);
      console.log("New numCommand:", newNumCommand);

      // Update the command via API
      const response = await axios.put(`/command/validate/${commandId}`, {
        ...currentCommand,
        command_type: "commande",
        numCommand: newNumCommand,
      });

      console.log("Updated Command Response:", response.data);

      // Remove command from the list in UI
      // setCommands((prevCommands) =>
      //   prevCommands.filter((command) => command._id !== commandId)
      // );

      setCommands((prevCommands) =>
        prevCommands.map((command) =>
          command._id === commandId
            ? { ...command, command_type: "commande", numCommand: newNumCommand }
            : command
        )
      );
      message.success("✅ Commande validée avec succès !");
      onValidate();
    } catch (error) {
      console.error("Error validating command:", error);
      message.error("❌ Échec de la validation de la commande.");
    }
  };

  const handleDelete = (commandId) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer le devis ?',
      content: 'Cette action est irréversible.',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await axios.delete(`/command/${commandId}`);
          setCommands((prev) => prev.filter(cmd => cmd._id !== commandId));
          message.success('Commande supprimée avec succès !');
        } catch (err) {
          console.error(err);
          message.error("Erreur lors de la suppression");
        }
      },
    });
  };
  

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      // render: (text) => {
      //   // Take only the first part before the first comma
      //   const cleanText = text.split(',')[0];
      //   return cleanText;
      // }
    },
    {
      title: "Devis / Commande",
      dataIndex: "command",
      key: "command",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      // render: (text) => text.split(',')[0]
    },

    {
      title: "Prix HT (€)",
      dataIndex: "montantHT",
      key: "montantHT",
      render: (text) => `${text}`, // Formatting the price
    },
    {
      title: "TVA (20%) (€)",
      dataIndex: "montantTVA",
      key: "montantTVA",
      render: (text) => `${text}`, // Formatting the TVA
    },
    {
      title: "Prix TTC (€)",
      dataIndex: "montantTTC",
      key: "montantTTC",
      render: (text) => `${text}`, // Formatting the price
    },
    {
      title: "Date de Création",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString("fr-FR"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            className="text-blue-500 cursor-pointer"
            onClick={() => handleUpdate(record._id)}
          />
          <DeleteOutlined
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(record._id)}
          />
          <CheckCircleOutlined
            className="text-green-500 cursor-pointer"
            onClick={() => handleValidate(record._id)}
          />
          <SearchOutlined
            className="text-green-500 cursor-pointer"
            onClick={() => handleViewDetails(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Devis Récemment Ajoutées
      </h2>

      {/* Table to display commands */}
      <Table
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
        dataSource={commands}
        rowKey="_id"
        pagination={false}
        key={commands.length}
      />
      {selectedCommand && (
        <Card
          title={`Détails de la commande: ${selectedCommand.description}`}
          className="mt-8 shadow-md"
          bordered
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Type">
              {selectedCommand.command_type}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedCommand.date).toLocaleDateString("fr-FR")}
            </Descriptions.Item>
            <Descriptions.Item label="Nom">
              {selectedCommand.request_lastname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedCommand.request_email}
            </Descriptions.Item>
            <Descriptions.Item label="Téléphone">
              {selectedCommand.request_phone}
            </Descriptions.Item>
            <Descriptions.Item label="SIRET">
              {selectedCommand.siret}
            </Descriptions.Item>
            <Descriptions.Item label="Code Postal">
              {selectedCommand.codepostal}
            </Descriptions.Item>
            <Descriptions.Item label="Ville">
              {selectedCommand.ville}
            </Descriptions.Item>
            <Descriptions.Item label="Adresse">
              {selectedCommand.adresse}
            </Descriptions.Item>
            <Descriptions.Item label="Raison Sociale">
              {selectedCommand.raissociale}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedCommand.description}
            </Descriptions.Item>
            <Descriptions.Item label="Quantité">
              {selectedCommand.quantite}
            </Descriptions.Item>
            <Descriptions.Item label="Total HT">
              {selectedCommand.totalHT} €
            </Descriptions.Item>
            <Descriptions.Item label="Total TVA (20%)">
              {selectedCommand.totalTVA} €
            </Descriptions.Item>
            <Descriptions.Item label="Total TTC">
              {selectedCommand.totalTTC} €
            </Descriptions.Item>
            <Descriptions.Item label="Numéro de Commande">
              {selectedCommand.numCommand}
            </Descriptions.Item>
            <Descriptions.Item label="Code">
              {selectedCommand.code}
            </Descriptions.Item>
            <Descriptions.Item label="Marque">
              {selectedCommand.marque}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default Devis;
