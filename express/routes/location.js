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
  getUnknownPark,
} from "../controllers/location.js";
import {getProfile} from "../lib/profile.js";

const router = express.Router();

// Park information

// Get all park locations
router.get("/", getAllParks);

// Get location of park by ID
router.get("/:parkId/", getParkById);

// Add a new park location
router.post("/", getProfile(true, true), addPark);

// Delete a park location by ID
router.delete("/:parkId", getProfile(true, true), deleteParkById);

// Get default park location
router.get("/:parkId/unknown", getUnknownPark);

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
