import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, message, Modal, Card, Statistic } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FilePdfOutlined } from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const { confirm } = Modal;

const AllCommands = () => {
  const [allCommands, setAllCommands] = useState([]);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalHT: 0, totalTTC: 0, totalCommands: 0 });
  const token = localStorage.getItem("token");
  const decodedUser = token ? jwtDecode(token) : null;
  const userLoged = decodedUser?.userId;
  const userRole = decodedUser?.role;

  useEffect(() => {
    fetchCommands();
  }, []);

  useEffect(() => {
    if (allCommands.length > 0) {
      filterCommands();
    }
  }, [allCommands, userLoged]);

  // const fetchCommands = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get('/command', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     console.log("API Response:", response);
  //     const commandsData = response?.data?.data || response?.data || [];
  //     setAllCommands(commandsData);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching commands:", error);
  //     message.error("Failed to fetch commands");
  //     setLoading(false);
  //   }
  // };
  const fetchCommands = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/command', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("API Response:", response);
      const commandsData = response?.data?.data || response?.data || [];
  
      // Filter commands to display only "devis" type
      const devisCommands = commandsData.filter(command => command.command_type === 'commande');
      
      setAllCommands(devisCommands); // Set only the "devis" commands
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commands:", error);
      message.error("Failed to fetch commands");
      setLoading(false);
    }
  };

  const filterCommands = () => {
    let commandsToDisplay = allCommands;
    
    if (userRole === 'Commercial') {  // Match exact case from your token
      commandsToDisplay = allCommands.filter(cmd => 
        String(cmd.commercial) === String(userLoged)  // Strict comparison
      );
    } 
    else if (userRole === 'admin') {  // Assuming admin is lowercase
      commandsToDisplay = allCommands.filter(cmd => 
        String(cmd.admin) === String(userLoged)
      );
    }
  
    setFilteredCommands(commandsToDisplay);
    updateStatistics(commandsToDisplay);
  };

  const updateStatistics = (commands) => {
    const totals = commands.reduce((acc, cmd) => ({
      totalHT: acc.totalHT + (cmd.totalHT || 0),
      totalTTC: acc.totalTTC + (cmd.totalTTC || 0),
      totalCommands: acc.totalCommands + 1
    }), { totalHT: 0, totalTTC: 0, totalCommands: 0 });

    setStats(totals);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    window.location.href = `/lead/${record.lead}`;
  };

  // const handleDownload = (id, e) => {
  //   e.stopPropagation();
  //   message.info(`Downloading command ${id}`);
  // };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this command?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteCommand(id)
    });
  };

  const deleteCommand = async (id) => {
    try {
      await axios.delete(`/command/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Command deleted successfully');
      fetchCommands(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting command:", error);
      message.error('Failed to delete command');
    }
  };

  const safeRender = (value, fallback = 'N/A') => {
    return value !== undefined && value !== null ? value : fallback;
  };

  const columns = [
    {
      title: 'Command',
      dataIndex: 'numCommand',
      key: 'numCommand',
      render: (text) => safeRender(text),
      sorter: (a, b) => (a.numCommand || '').localeCompare(b.numCommand || '')
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(safeRender(date)).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date)
    },
    {
      title: 'Client',
      dataIndex: 'nom',
      key: 'client',
      render: (text) => safeRender(text),
      ellipsis: true
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => safeRender(text),
      ellipsis: true
    },
    {
      title: 'Total HT',
      dataIndex: 'totalHT',
      key: 'totalHT',
      render: (text) => `${safeRender(text, '0')} €`,
      sorter: (a, b) => (a.totalHT || 0) - (b.totalHT || 0)
    },
    {
      title: 'Total TTC',
      dataIndex: 'totalTTC',
      key: 'totalTTC',
      render: (text) => `${safeRender(text, '0')} €`,
      sorter: (a, b) => (a.totalTTC || 0) - (b.totalTTC || 0)
    },
    {
      title: 'Status',
      key: 'status',
      render: () => {
        return (
          <Tag color="green">
            Completed
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={(e) => handleEdit(record._id, e)}
          />
          {/* <Button 
            icon={<FilePdfOutlined />} 
            onClick={(e) => handleDownload(record._id, e)}
          /> */}
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={(e) => handleDelete(record._id, e)}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Command Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic title="Total Commands" value={stats.totalCommands} />
        </Card>
        <Card>
          <Statistic title="Total HT" value={stats.totalHT} suffix="€" />
        </Card>
        <Card>
          <Statistic title="Total TTC" value={stats.totalTTC} suffix="€" />
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {userRole === 'commercial' ? 'Mes Commands' : 'Toute les Commandes'}
          </h2>
          {/* <Button 
            type="primary" 
            onClick={() => window.location.href = '/command/new'}
          >
            Create New Command
          </Button> */}
        </div>

        <Table
          columns={columns.map((col) => ({
            ...col,
            title: (
              <div className="flex flex-col items-center">
                <div className="text-xs">{col.title}</div>
              </div>
            ),
          }))}
          dataSource={filteredCommands}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          bordered
          onRow={(record) => ({
            onClick: () => window.location.href = `/lead/${record.lead}`,
            style: { cursor: 'pointer' }
          })}
        />
      </div>
    </div>
  );
};

export default AllCommands;