import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AjouterProduit = () => {
  const { id } = useParams(); // Get id from URL params
  const location = useLocation(); // Get state from location
  const productId = location.state?.productId; // Access productId from state
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState({
    code: "",
    marque: "",
    modele: "",
    description: "",
    coutAchat: "",
    prixVente: "",
    fraisGestion: "",
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const [program, setProgram] = useState([]); // State to hold program data
  
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
  // Fetch product data if productId exists
  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/produit/${productId}`);
          console.log("Fetched product data:", response.data); // Log fetched product data
          setProductData(response.data); // Set the fetched product data to state
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
  useEffect(() => {
    if (!productId && program.length > 0) {
      const selectedProgram = program[0]; // Or whichever you want to use
      setProductData((prev) => ({
        ...prev,
        code: selectedProgram.title || "",
        description: selectedProgram.mainText || "",
      }));
    }
  }, [program, productId]);
  

  const handleSubmit = async (e, title, mainText) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());

    const userId = decodedToken?.userId || decodedToken?.commercialId; // Get user ID from token

    // Include the user ID (admin or commercial) in the form data
    const productData = { ...values,  title,
      mainText, admin: userId, leadId: id };

    try {
      setLoading(true);
      setError(null); // Reset error message
      if (productId) {
        // Update existing product
        await axios.put(`/produit/${productId}`, productData);
        navigate(`/lead/${id}`); // Redirect to the products page after update
      } else {
        // Send data to backend API
        const response = await axios.post("/produit", productData);
        navigate(`/lead/${id}`);
      }
    } catch (error) {
      console.error("Error creating produit:", error);
      setError("Failed to create produit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    // <div className="container mx-auto px-4 py-8">
    //   <h2 className="text-2xl font-bold text-gray-800 mb-6">
    //     Ajouter un Produit
    //   </h2>
    //   {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message display */}
    //   <form
    //     onSubmit={handleSubmit}
    //     className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-6"
    //   >
    //     {/* Form fields */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //       <div>
    //         <img src={program[0]?.imageUrl} alt="Product" className="w-full h-48 object-cover rounded-md mb-4" />
    //       </div>
    //       <div>
    //         <label htmlFor="code" className="block text-sm font-medium text-gray-700">
    //           Title
    //         </label>
    //         <input
    //           type="text"
    //           id="code"
    //           name="code"
    //           value={productData.code || program.title} // Bind the input value to state
    //           onChange={(e) => setProductData({ ...productData, code: e.target.value })}
    //           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="description" className="block text-sm font-medium text-gray-700">
    //           Description
    //         </label>
    //         <textarea
    //           id="description"
    //           name="description"
    //           value={productData.description || program.mainText} // Bind the input value to state
    //           onChange={(e) => setProductData({ ...productData, description: e.target.value })}
    //           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //       </div>

    //       <div>
    //         <label htmlFor="prixVente" className="block text-sm font-medium text-gray-700">
    //           Prix de Vente
    //         </label>
    //         <input
    //           type="number"
    //           id="prixVente"
    //           name="prixVente"
    //           value={productData.prixVente} // Bind the input value to state
    //           onChange={(e) => setProductData({ ...productData, prixVente: e.target.value })}
    //           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //       </div>
    //     </div>

    //     <div className="text-right">
    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
    //           loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
    //         }`}
    //       >
    //         {loading ? "Ajout en cours..." : "Ajouter"}
    //       </button>
    //     </div>
    //   </form>
    // </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Ajouter un Produit
        </h2>
    
        {error && (
          <div className="text-red-500 mb-4 text-center font-medium">{error}</div>
        )}
    
        {program.map((item, index) => (
          <form
            key={index}
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-10"
          >
            {/* Product Image */}
            <div className="mb-6">
              <img
                src={item.imageUrl}
                alt={`Produit ${index}`}
                className="w-full h-60 object-cover rounded-md"
              />
            </div>
    
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={productData.code || item.title}
                onChange={(e) => setProductData({ ...productData, code: e.target.value })}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
    
            {/* Main Text */}
          
    
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={productData.description || item.mainText}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
    
            {/* Prix de Vente */}
            <div className="mb-6">
              <label htmlFor="prixVente" className="block text-sm font-semibold text-gray-700 mb-1">
                Prix de Vente
              </label>
              <input
                type="number"
                id="prixVente"
                name="prixVente"
                value={productData.prixVente}
                onChange={(e) => setProductData({ ...productData, prixVente: e.target.value })}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
    
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`inline-block w-full py-3 text-white font-medium rounded-md transition ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Ajout en cours..." : "Ajouter"}
              </button>
            </div>
          </form>
        ))}
      </div>    
  );
};

export default AjouterProduit;
