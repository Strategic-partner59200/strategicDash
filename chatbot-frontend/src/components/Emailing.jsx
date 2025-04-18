import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // If you're using react-router
import { Alert, message } from "antd";

const Emailing = () => {
  const { id } = useParams(); // get the lead ID from the route
  const [lead, setLead] = useState(null);
  const [emailStatus, setEmailStatus] = useState("");
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formRdv, setFormRdv] = useState({ jour: "", heure: "", lien: "" });
  const [formCommande, setFormCommande] = useState({
    offre: "",
    montant: "",
    date: "",
    reference: "",
  });
  const [showCommandeForm, setShowCommandeForm] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(`/lead/${id}`);
        setLead(response.data.chat);
        setFormData(response.data.chat);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };

    fetchLead();
  }, [id]);

  const sendEmail = async () => {
    try {
      const res = await axios.post("/emailing", {
        email: lead.email,
        nom: lead.nom,
      });
      console.log("Email sent successfully:", res.data);
      message.success("Email a été envoyé avec succès !");
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setEmailStatus("❌ Échec de l'envoi de l'email.");
    }
  };

  const sendEmailR = async () => {
    try {
      const res = await axios.post("/emailingR", {
        email: lead.email,
        nom: lead.nom,
        jour: formRdv.jour,
        heure: formRdv.heure,
        lien: formRdv.lien,
      });
      console.log("Email sent successfully:", res.data);
      // setEmailStatus("✅ Email envoyé avec succès !");
      message.success("✅ Email a été envoyé avec succès !");
      setShowForm(false);
      setFormRdv({ jour: "", heure: "", lien: "" });
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setEmailStatus("❌ Échec de l'envoi de l'email.");
    }
  };

  const sendEmailC = async () => {
    try {
      const res = await axios.post("/emailingC", {
        email: lead.email,
        nom: lead.nom,
        offre: formCommande.offre,
        montant: formCommande.montant,
        date: formCommande.date,
        reference: formCommande.reference,
      });
      console.log("Email sent successfully:", res.data);
      // setEmailStatus("✅ Email envoyé avec succès !");
      message.success("✅ Email envoyé avec succès !");
      setShowCommandeForm(false);
      setFormCommande({
        offre: "",
        montant: "",
        date: "",
        reference: "",
      });
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setEmailStatus("❌ Échec de l'envoi de l'email.");
      message.error("❌ Échec de l'envoi de l'email.");
    }
  };

  if (!lead) {
    return <div className="text-center py-10">Chargement des données...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6 py-10 bg-white rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📋 Détails du Lead
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-gray-700 text-base">
        <div>
          <span className="font-semibold text-gray-900">👤 Nom :</span>{" "}
          {lead.nom}
        </div>
        <div>
          <span className="font-semibold text-gray-900">📧 Email :</span>{" "}
          {lead.email}
        </div>
        <div>
          <span className="font-semibold text-gray-900">📞 Téléphone :</span>{" "}
          {lead.phone}
        </div>
        <div>
          <span className="font-semibold text-gray-900">🏢 Société :</span>{" "}
          {lead.nom_societé}
        </div>
        <div>
          <span className="font-semibold text-gray-900">📍 Adresse :</span>{" "}
          {lead.address}
        </div>
        <div>
          <span className="font-semibold text-gray-900">🏙️ Ville :</span>{" "}
          {lead.ville}
        </div>
        <div>
          <span className="font-semibold text-gray-900">🏷️ Code Postal :</span>{" "}
          {lead.codepostal}
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center">
        <button
          onClick={sendEmail}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
        >
          📤 Email de Présentation
        </button>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition duration-200 w-full sm:w-auto"
        >
          🗓️ Email de Rendez-vous
        </button>
        <button
          onClick={() => setShowCommandeForm(!showCommandeForm)}
          className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition duration-200 w-full sm:w-auto"
        >
          ✅ Email de Confirmation
        </button>

        {showForm && (
          <div className="mt-6 space-y-4 w-full sm:w-2/3 mx-auto">
            <input
              type="text"
              placeholder="Jour (ex: lundi 22 avril)"
              className="w-full border p-2 rounded"
              value={formRdv.jour}
              onChange={(e) => setFormRdv({ ...formRdv, jour: e.target.value })}
            />
            <input
              type="text"
              placeholder="Heure (ex: 15h30)"
              className="w-full border p-2 rounded"
              value={formRdv.heure}
              onChange={(e) =>
                setFormRdv({ ...formRdv, heure: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Lien de rendez-vous"
              className="w-full border p-2 rounded"
              value={formRdv.lien}
              onChange={(e) => setFormRdv({ ...formRdv, lien: e.target.value })}
            />
            <button
              onClick={sendEmailR}
              className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 w-full"
            >
              🚀 Envoyer l'email de rendez-vous
            </button>
          </div>
        )}

        {showCommandeForm && (
          <div className="mt-6 space-y-4 w-full sm:w-2/3 mx-auto">
            <input
              type="text"
              placeholder="Offre (ex: Pack Premium)"
              className="w-full border p-2 rounded"
              value={formCommande.offre}
              onChange={(e) =>
                setFormCommande({ ...formCommande, offre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Montant (ex: 1200€)"
              className="w-full border p-2 rounded"
              value={formCommande.montant}
              onChange={(e) =>
                setFormCommande({ ...formCommande, montant: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Date de commande (ex: 22 avril 2025)"
              className="w-full border p-2 rounded"
              value={formCommande.date}
              onChange={(e) =>
                setFormCommande({ ...formCommande, date: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Référence (ex: C-2025324)"
              className="w-full border p-2 rounded"
              value={formCommande.reference}
              onChange={(e) =>
                setFormCommande({ ...formCommande, reference: e.target.value })
              }
            />
            <button
              onClick={sendEmailC}
              className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 transition duration-200 w-full"
            >
              ✅ Email de Confirmation
            </button>
          </div>
        )}
      </div>

      {emailStatus && (
        <p
          className={`mt-6 text-center text-sm ${
            emailStatus.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {emailStatus}
        </p>
      )}
    </div>
  );
};

export default Emailing;
