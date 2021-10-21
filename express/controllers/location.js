import { v4 as uuidv4 } from "uuid";

// Dummy info for now; will update later to fetch information from database
const locations = [
  {
    parkId: 0,
    name: "High Park",
    boundary: {
      latitudeStart: 43.637957715278965,
      latitudeEnd: 43.65471814272107,
      longitudeStart: -79.46668117994243,
      longitudeEnd: -79.46055003243023,
    },
    location: {
      latitude: 43.645377745301744,
      longitude: -79.46273586305155,
      radius: -1,
    },
    sites: [
      {
        siteId: 0,
        name: "High Park North",
        latitude: 43.65341893818677,
        longitude: -79.4651832778902,
        radius: 200,
      },
      {
        siteId: 1,
        name: "Grenadier Pond",
        latitude: 43.6425844920262,
        longitude: -79.46696053742487,
        radius: 200,
      },
    ],
  },
];

// Get all parks
export const getAllParks = (req, res) => {
  res.send(locations);
  console.log(locations);
};

// Get location of park by parkID
export const getParkById = (req, res) => {
  const foundPark = locations.find((park) => park.parkId == req.params.parkId);
  res.send(foundPark);
};

// Add new park
export const addPark = (req, res) => {
  const id = uuidv4();
  const park = {
    parkId: id,
    boundary: req.body.boundary,
    location: req.body.location,
    sites: [],
  };

  locations.push(park);
  res.send(`Added new park with id ${id}`);
};

// Delete a park by parkID
export const deleteParkById = (req, res) => {
  const index = locations.map((park) => park.parkId).indexOf(req.params.parkId);
  locations.splice(index, 1);
  res.send(`Deleted park with id ${req.params.parkId}`);
};

// Get all sites by parkID
export const getAllSites = (req, res) => {
  const foundPark = locations.find((park) => park.parkId == req.params.parkId);
  res.send(foundPark.sites);
};

// Get location of site by parkID, siteID
export const getSiteById = (req, res) => {
  const foundPark = locations.find((park) => park.parkId == req.params.parkId);
  const foundSite = foundPark.sites.find(
    (site) => site.siteId == req.params.siteId
  );
  res.send(foundSite);
};

// Add new site by parkID
export const addSite = (req, res) => {
  const park = locations.find((park) => (park.parkId = req.params.parkId));
  const id = uuidv4();
  const newSite = {
    id: siteId,
    name: req.params.name,
    latitude: req.params.latitude,
    longitude: req.params.longitude,
    radius: req.params.radius,
  };

  park.sites.push(newSite);
  res.send(`Added new site with id ${id}`);
};

// Delete a site by parkID, siteID
export const deleteSiteById = (req, res) => {
  const park = locations.find((park) => (park.parkId = req.params.parkId));
  const index = park.sites
    .map((site) => site.siteId)
    .indexOf(req.params.siteId);
  park.sites.splice(index, 1);
  res.send(`Deleted site with id ${req.params.siteId}`);
};
