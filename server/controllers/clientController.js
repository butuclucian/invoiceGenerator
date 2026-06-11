import Client from "../models/Client.js";

// 1. Extrage toți clienții adăugați de freelancerul logat
export const getClients = async (req, res) => {
  try {
    // Am schimbat din createdBy în user pentru a se potrivi cu noua structură a modelului
    const clients = await Client.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch clients", error: err.message });
  }
};

// 2. Extrage un singur client după ID-ul său
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Error fetching client" });
  }
};

// 3. Creare Client (Manual din interfață)
export const createClient = async (req, res) => {
  try {
    // 🏢 Preluăm TOATE câmpurile trimise de formularul din Frontend
    const { 
      name, brand, cui, reg_com, client_code, is_tva_payer,
      address, city, county, country,
      iban, bank,
      contact_person, email, phone
    } = req.body;
    
    // Validare: Doar numele (Denumirea) este strict obligatoriu la crearea inițială
    if (!name) {
      return res.status(400).json({ message: "Name is required to register a client" });
    }

    // 💾 Salvarea completă în MongoDB conform noului model din Client.js
    const newClient = await Client.create({
      user: req.user._id, // Legătura de securitate cu utilizatorul logat
      name,
      brand: brand || "",
      cui: cui || "",
      reg_com: reg_com || "",
      client_code: client_code || "",
      
      // Gestionăm valoarea booleană pentru plătitorul de TVA
      is_tva_payer: is_tva_payer === true || is_tva_payer === 'true' || is_tva_payer === 'Da',

      address: address || "",
      city: city || "",
      county: county || "",
      country: country || "Romania",

      iban: iban || "",
      bank: bank || "",

      contact_person: contact_person || "",
      email: email || "",
      phone: phone || "",
    });

    // Întoarcem obiectul complet creat, pregătit pentru Frontend
    res.status(201).json(newClient);
  } catch (err) {
    console.error("❌ Eroare la crearea manuală a clientului:", err.message);
    res.status(500).json({ message: "Failed to create client", error: err.message });
  }
};

// 4. Actualizare date client
export const updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // runValidators asigură că regulile din schemă se aplică și la update
    );
    
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating client", error: err.message });
  }
};

// 5. Ștergere client
export const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting client" });
  }
};