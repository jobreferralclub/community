import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// GET /api/companies – Fetch all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching companies' });
  }
});

// POST /api/companies – Add a new company
router.post('/', async (req, res) => {
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
});

// DELETE /api/companies – Delete all companies
router.delete('/', async (req, res) => {
  try {
    await Company.deleteMany({});
    res.status(200).json({ message: 'All companies deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting companies' });
  }
});

// DELETE /api/companies/:id – Delete company by ID
router.delete('/:id', async (req, res) => {
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
});

export default router;
