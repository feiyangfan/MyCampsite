import { v4 as uuidv4 } from "uuid";
import Site from "../models/Site.js";
import Park from "../models/Park.js";

// Get all parks
export const getAllParks = async (req, res) => {
  try {
    const parks = await Park.find();
    res.json(parks);
  } catch (err) {
    res.send(err);
  }
};

// Get location of park by parkID
export const getParkById = async (req, res) => {
  try {
    const foundPark = await Park.findById(req.params.parkId);
    res.json(foundPark);
  } catch (err) {
    res.sendStatus(400);
  }
};

// Add new park
export const addPark = async (req, res) => {
  const newPark = new Park({
    name: req.body.name,
    boundary: req.body.boundary,
    location: req.body.location,
    sites: [],
  });

  try {
    const savedPark = await newPark.save();
    res.json(savedPark);
  } catch (err) {
    res.sendStatus(400);
  }
};

// Delete a park by parkID
export const deleteParkById = async (req, res) => {
  try {
    const deletedPark = await Park.deleteOne({ _id: req.params.parkId });
    res.json(deletedPark);
  } catch (err) {
    res.sendStatus(400);
  }
};

// Get all sites by parkID
export const getAllSites = async (req, res) => {
  try {
    const foundPark = await Park.findById(req.params.parkId);
    res.json(foundPark.sites);
  } catch (err) {
    res.sendStatus(400);
  }
};

// Get location of site by parkID, siteID
export const getSiteById = async (req, res) => {
  try {
    const foundPark = await Park.findById(req.params.parkId);
    console.log(foundPark);
    const foundSite = foundPark.sites.find(
      (site) => site._id == req.params.siteId
    ); //TODO: I don't know how to query mongoDB for this

    res.json(foundSite);
  } catch (err) {
    res.sendStatus(400);
  }
};

// Add new site by parkID
export const addSite = async (req, res) => {
  const newSite = new Site({
    name: req.body.name,
    location: req.body.location,
  });
  console.log(newSite);

  try {
    const foundPark = await Park.findById(req.params.parkId);
    foundPark.sites.push(newSite);
    foundPark.save();
    res.json(newSite);
  } catch (err) {
    res.sendStatus(400);
  }
};

// Delete a site by parkID, siteID
export const deleteSiteById = async (req, res) => {
  try {
    const foundPark = await Park.findById(req.params.parkId);
    const index = foundPark.sites
      .map((site) => site._id.toString())
      .indexOf(req.params.siteId);
    if (index < 0) {
      res.sendStatus(400);
      return;
    }
    foundPark.sites.splice(index, 1);
    foundPark.save();
    res.json(200);
  } catch (err) {
    res.sendStatus(400);
  }
};
