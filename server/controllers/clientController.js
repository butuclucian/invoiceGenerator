import Client from "../models/Client.js";

export const getClients = async (req, res) => {
  try {

    const clients = await Client.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch clients", error: err.message });
  }
};


export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Error fetching client" });
  }
};


export const createClient = async (req, res) => {
  try {
    const { name, brand, cui, reg_com, client_code, is_tva_payer, address, city, county, country, iban, bank, contact_person, email, phone} = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Name is required to register a client" });
    }

    const newClient = await Client.create({
      user: req.user._id,
      name,
      brand: brand || "",
      cui: cui || "",
      reg_com: reg_com || "",
      client_code: client_code || "",
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

    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ message: "Failed to create client", error: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate( req.params.id,  req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating client", error: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting client" });
  }
};