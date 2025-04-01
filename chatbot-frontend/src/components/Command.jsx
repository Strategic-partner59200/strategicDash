
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const Command = () => {
//   const [commands, setCommands] = useState([]);
//   const { id } = useParams(); // Assuming leadId is part of the route parameter

//   console.log("Lead ID from URL:", id);

//   const fetchCommands = async () => {
//     try {
//       // Fetch all commands (you can filter by the leadId in the API query if needed)
//       const response = await axios.get(`/command/${id}`);
//       console.log("All Commands:", response.data);
      
//       // Filter commands to only include those where the lead matches the id from the URL
//       const filteredCommands = response.data.filter(command => command.lead.toString() === id);
//       console.log("Filtered Commands:", filteredCommands);
//       setCommands(filteredCommands);
//     } catch (error) {
//       console.error('Error fetching commands:', error);
//     }
//   };

//   // Fetch the commands when the component mounts or when leadId changes
//   useEffect(() => {
//     fetchCommands();
//   }, [id]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         Commandes Récemment Ajoutées
//       </h2>

//       {/* Table to display commands */}
//       <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="py-3 px-4 text-left">ID</th>
//             <th className="py-3 px-4 text-left">Type de Commande</th>
//             <th className="py-3 px-4 text-left">Détails</th>
//             <th className="py-3 px-4 text-left">Prix</th>
//             <th className="py-3 px-4 text-left">TVA</th>
//             <th className="py-3 px-4 text-left">Note</th>
//             <th className="py-3 px-4 text-left">Date de Création</th>
//           </tr>
//         </thead>
//         <tbody>
//           {commands.map((command) => (
//             <tr key={command._id} className="border-t border-gray-200">
//               <td className="py-3 px-4">{command._id}</td>
//               <td className="py-3 px-4">{command.command_type}</td>
//               <td className="py-3 px-4">{command.details}</td>
//               <td className="py-3 px-4">{command.prix} €</td>
//               <td className="py-3 px-4">{command.TVA}%</td>
//               <td className="py-3 px-4">{command.note || "Aucune note"}</td>
//               <td className="py-3 px-4">{new Date(command.createdAt).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Command;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Command = () => {
  const [commands, setCommands] = useState([]);
  const { id } = useParams(); // Assuming leadId is part of the route parameter

  console.log("Lead ID from URL:", id);

  const fetchCommands = async () => {
    try {
      // Fetch all commands (you can filter by the leadId in the API query if needed)
      const response = await axios.get(`/command/${id}`);
      console.log("All Commands:", response.data);
      
      // Filter commands to only include those where the lead matches the id from the URL
      const filteredCommands = response.data.filter(command => command.lead.toString() === id);
      console.log("Filtered Commands:", filteredCommands);
      setCommands(filteredCommands);
    } catch (error) {
      console.error('Error fetching commands:', error);
    }
  };

  // Fetch the commands when the component mounts or when leadId changes
  useEffect(() => {
    fetchCommands();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Commandes Récemment Ajoutées
      </h2>

      {/* Table to display commands */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left text-sm sm:text-base">ID</th>
              <th className="py-3 px-4 text-left text-sm sm:text-base">Type de Commande</th>
              <th className="py-3 px-4 text-left text-sm sm:text-base">Détails</th>
              <th className="py-3 px-4 text-left text-sm sm:text-base">Prix</th>
              <th className="py-3 px-4 text-left text-sm sm:text-base">TVA</th>
              <th className="py-3 px-4 text-left text-sm sm:text-base">Note</th>
              <th className="py-3 px-4 text-left text-sm sm:text-base">Date de Création</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((command) => (
              <tr key={command._id} className="border-t border-gray-200">
                <td className="py-3 px-4 text-sm sm:text-base">{command._id}</td>
                <td className="py-3 px-4 text-sm sm:text-base">{command.command_type}</td>
                <td className="py-3 px-4 text-sm sm:text-base">{command.details}</td>
                <td className="py-3 px-4 text-sm sm:text-base">{command.prix} €</td>
                <td className="py-3 px-4 text-sm sm:text-base">{command.TVA}%</td>
                <td className="py-3 px-4 text-sm sm:text-base">{command.note || "Aucune note"}</td>
                <td className="py-3 px-4 text-sm sm:text-base">{new Date(command.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Command;
