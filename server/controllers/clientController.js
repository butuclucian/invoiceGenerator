import Client from "../models/Client.js";


export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user._id });
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
    const { name, email, company, address, phone } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and email are required" });

    const newClient = await Client.create({
      name,
      email,
      company,
      address,
      phone,
      createdBy: req.user._id,
    });

    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ message: "Failed to create client", error: err.message });
  }
};


export const updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating client" });
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
