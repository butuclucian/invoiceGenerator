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
    const { name, email, company, address, phone, cui } = req.body;
    
    // Validare: Doar numele (persoana de contact sau compania) este strict obligatoriu la crearea inițială
    if (!name) {
      return res.status(400).json({ message: "Name is required to register a client" });
    }

    const newClient = await Client.create({
      name,
      email: email || "",
      company: company || "",
      cui: cui || "",
      address: address || "",
      phone: phone || "",
      user: req.user._id, // Folosim denumirea consecventă 'user'
    });

    res.status(201).json(newClient);
  } catch (err) {
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