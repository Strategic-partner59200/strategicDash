// import React, { useEffect, useState } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const AjouterProduit = () => {
//   const { id } = useParams(); // Get id from URL params
//   const location = useLocation(); // Get state from location
//   const productId = location.state?.productId; // Access productId from state
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [productData, setProductData] = useState({
//     code: "",
//     description: "",
//     prixVente: "",
  
//   });
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("token");
//   const decodedToken = token ? jwtDecode(token) : null;
//   const [program, setProgram] = useState([]); // State to hold program data

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
//   // Fetch product data if productId exists
//   useEffect(() => {
//     if (productId) {
//       const fetchProductData = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`/produit/${productId}`);
//           console.log("Fetched product data:", response.data); // Log fetched product data
//           setProductData(response.data); // Set the fetched product data to state
//         } catch (error) {
//           console.error("Error fetching product data:", error);
//           setError("Failed to fetch product data.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProductData();
//     }
//   }, [productId]);


//   useEffect(() => {
//     if (!productId && program.length > 0) {
//       const selectedProgram = program[0]; // Or whichever you want to use
//       setProductData((prev) => ({
//         ...prev,
//         code: selectedProgram.title || "",
//         description: selectedProgram.mainText || "",
//       }));
//     }
//   }, [program, productId]);

//   const handleSubmit = async (e, title, mainText) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const values = Object.fromEntries(formData.entries());

//     const userId = decodedToken?.userId || decodedToken?.commercialId; // Get user ID from token

//     // Include the user ID (admin or commercial) in the form data
//     const productData = {
//       ...values,
//       title,
//       mainText,
//       admin: userId,
//       leadId: id,
//     };

//     try {
//       setLoading(true);
//       setError(null); // Reset error message
//       if (productId) {
//         // Update existing product
//         await axios.put(`/produit/${productId}`, productData);
//         navigate(`/lead/${id}`); // Redirect to the products page after update
//       } else {
//         // Send data to backend API
//         const response = await axios.post("/produit", productData);
//         navigate(`/lead/${id}`);
//       }
//     } catch (error) {
//       console.error("Error creating produit:", error);
//       setError("Failed to create produit. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Show loading indicator while fetching data
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//         Ajouter un Produit
//       </h2>

//       {error && (
//         <div className="text-red-500 mb-4 text-center font-medium">{error}</div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//         {" "}
//         {/* Two cards per row */}
//         {program.map((item, index) => (
//           <form
//             key={index}
//             onSubmit={handleSubmit}
//             className="bg-white border border-gray-200 rounded-lg shadow-md p-6"
//           >
//             {/* Product Image */}
//             <div className="mb-6">
//               <img
//                 src={item.imageUrl}
//                 alt={`Produit ${index}`}
//                 className="w-full h-60 object-cover rounded-md"
//               />
//             </div>

//             {/* Title */}
//             <div className="mb-4">
//               <label
//                 htmlFor="code"
//                 className="block text-sm font-semibold text-gray-700 mb-1"
//               >
//                 Title
//               </label>
//               <input
//                 type="text"
//                 id="code"
//                 name="code"
//                 value={productData.code}

//                 onChange={(e) =>
//                   setProductData({code: e.target.value })
//                 }
//                 className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-semibold text-gray-700 mb-1"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 rows="4"
//                 value={productData.description}
//                 onChange={(e) =>
//                   setProductData({
//                     ...productData,
//                     description: e.target.value,
//                   })
//                 }
//                 className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Prix de Vente */}
//             <div className="mb-6">
//               <label
//                 htmlFor="prixVente"
//                 className="block text-sm font-semibold text-gray-700 mb-1"
//               >
//                 Prix de Vente
//               </label>
//               <input
//                 type="number"
//                 id="prixVente"
//                 name="prixVente"
//                 value={productData.prixVente}
//                 onChange={(e) =>
//                   setProductData({ ...productData, prixVente: e.target.value })
//                 }
//                 className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="text-center">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`inline-block w-full py-3 text-white font-medium rounded-md transition ${
//                   loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {loading ? "Ajout en cours..." : "Ajouter"}
//               </button>
//             </div>
//           </form>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AjouterProduit;
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AjouterProduit = () => {
  const { id } = useParams();
  const location = useLocation();
  const productId = location.state?.productId;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    code: "",
    description: "",
    prixVente: "",
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const [program, setProgram] = useState([]);

  // Fetch program data (your 2 products)
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("/program");
        setProgram(response.data);
      } catch (error) {
        console.error("Failed to fetch programmes:", error);
      }
    };
    fetchBanners();
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/produit/${productId}`);
          setProductData(response.data);
        } catch (error) {
          console.error("Error fetching product data:", error);
          setError("Failed to fetch product data.");
        } finally {
          setLoading(false);
        }
      };
      fetchProductData();
    }
  }, [productId]);

  // Pre-fill form with program data if not editing
  useEffect(() => {
    if (!productId && program.length > 0) {
      const selectedProgram = program[0]; // Default to first program
      setProductData({
        code: selectedProgram.title || "",
        description: selectedProgram.mainText || "",
        prixVente: "",
      });
    }
  }, [program, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = decodedToken?.userId || decodedToken?.commercialId;

    try {
      setLoading(true);
      setError(null);
      
      if (productId) {
        // Update existing product
        await axios.put(`/produit/${productId}`, {
          ...productData,
          admin: userId,
          leadId: id,
        });
      } else {
        // Create new product in produit collection
        await axios.post("/produit", {
          ...productData,
          admin: userId,
          leadId: id,
        });
      }
      navigate(`/lead/${id}`);
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {productId ? "Modifier Produit" : "Ajouter un Produit"}
      </h2>

      {error && (
        <div className="text-red-500 mb-4 text-center font-medium">{error}</div>
      )}

      {/* Display program products as templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
        {program.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <div className="mb-6">
              <img
                src={item.imageUrl}
                alt={`Program ${index}`}
                className="w-full h-60 object-cover rounded-md"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.mainText}</p>
            <button
              onClick={() => setProductData({
                code: item.title,
                description: item.mainText,
                prixVente: ""
              })}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Utiliser ce modèle
            </button>
          </div>
        ))}
      </div>

      {/* Add/Edit product form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={productData.code}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={productData.description}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="prixVente" className="block text-sm font-semibold text-gray-700 mb-1">
              Prix de Vente
            </label>
            <input
              type="number"
              id="prixVente"
              name="prixVente"
              value={productData.prixVente}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`inline-block w-full py-3 text-white font-medium rounded-md transition ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Enregistrement..." : productId ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterProduit;