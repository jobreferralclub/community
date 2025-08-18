// src/controllers/companyController.js
import Company from '../models/Company.js';

// Fetch all companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching companies' });
  }
};

// Add a new company
export const addCompany = async (req, res) => {
  const { name, domain } = req.body;

  if (!name || !domain) {
    return res.status(400).json({ error: 'Name and domain are required' });
  }

  try {
    const existing = await Company.findOne({ domain });
    if (existing) {
      return res.status(409).json({ error: 'Company with this domain already exists' });
    }

    const newCompany = new Company({ name, domain });
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: 'Server error while adding company' });
  }
};

// Delete all companies
export const deleteAllCompanies = async (req, res) => {
  try {
    await Company.deleteMany({});
    res.status(200).json({ message: 'All companies deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting companies' });
  }
};

// Delete company by ID
export const deleteCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json({ message: 'Company deleted successfully', company: deletedCompany });
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting company' });
  }
};