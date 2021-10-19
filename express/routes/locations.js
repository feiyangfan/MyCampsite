import express from "express";

import {
  getAllLocations,
  getLocationById,
  addLocation,
  deleteLocationById,
  updateLocationById,
} from "../controllers/locations.js";

const router = express.Router();

// Get all locations
router.get("/", getAllLocations);

// Get a location by ID
router.get("/:id", getLocationById);

// Add a new location
router.post("/", addLocation);

// Delete a location by ID
router.delete("/:id", deleteLocationById);

// Update any field in a location by ID
router.patch("/:id", updateLocationById);

export default router;
