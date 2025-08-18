// src/routes/companies.js
import express from 'express';
import {
  getCompanies,
  addCompany,
  deleteAllCompanies,
  deleteCompanyById
} from '../controllers/companies.controller.js';

const router = express.Router();

// GET /api/companies – Fetch all companies
router.get('/', getCompanies);

// POST /api/companies – Add a new company
router.post('/', addCompany);

// DELETE /api/companies – Delete all companies
router.delete('/', deleteAllCompanies);

// DELETE /api/companies/:id – Delete company by ID
router.delete('/:id', deleteCompanyById);

export default router;
