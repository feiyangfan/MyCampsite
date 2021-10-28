import express from "express";

import {
  getAllParks,
  getParkById,
  addPark,
  deleteParkById,
  getAllSites,
  getSiteById,
  addSite,
  deleteSiteById,
} from "../controllers/location.js";

const router = express.Router();

// Park information

// Get all park locations
router.get("/", getAllParks);

// Get location of park by ID
router.get("/:parkId/", getParkById);

// Add a new park location
router.post("/", addPark);

// Delete a park location by ID
router.delete("/:parkId", deleteParkById);

// Site information

// Get location of site by ID
router.get("/:parkId/site", getAllSites);

// Get location of site by ID
router.get("/:parkId/site/:siteId", getSiteById);

// Add a new sitelocation
router.post("/:parkId/site", addSite);

// Delete a site location by ID
router.delete("/:parkId/site/:siteId", deleteSiteById);

export default router;
