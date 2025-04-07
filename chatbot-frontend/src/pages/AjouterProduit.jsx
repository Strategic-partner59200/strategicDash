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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());

    const userId = decodedToken?.userId || decodedToken?.commercialId; // Get user ID from token

    // Include the user ID (admin or commercial) in the form data
    const productData = { ...values, admin: userId, leadId: id };

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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Ajouter un Produit
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message display */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-6"
      >
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Réference
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={productData.code} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, code: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="marque" className="block text-sm font-medium text-gray-700">
              Marque
            </label>
            <input
              type="text"
              id="marque"
              name="marque"
              value={productData.marque} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, marque: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="modele" className="block text-sm font-medium text-gray-700">
              Modèle
            </label>
            <input
              type="text"
              id="modele"
              name="modele"
              value={productData.modele} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, modele: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="coutAchat" className="block text-sm font-medium text-gray-700">
              Coût d'Achat
            </label>
            <input
              type="number"
              id="coutAchat"
              name="coutAchat"
              value={productData.coutAchat} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, coutAchat: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="prixVente" className="block text-sm font-medium text-gray-700">
              Prix de Vente
            </label>
            <input
              type="number"
              id="prixVente"
              name="prixVente"
              value={productData.prixVente} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, prixVente: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="fraisGestion" className="block text-sm font-medium text-gray-700">
              Frais de Gestion
            </label>
            <input
              type="number"
              id="fraisGestion"
              name="fraisGestion"
              value={productData.fraisGestion} // Bind the input value to state
              onChange={(e) => setProductData({ ...productData, fraisGestion: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Ajout en cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterProduit;
