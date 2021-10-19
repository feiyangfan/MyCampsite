import { v4 as uuidv4 } from "uuid";

// Dummy info for now; will update later to fetch information from database
const locations = [
  {
    id: 0,
    name: "High Park",
    latitude: 43.65341893818677,
    longitude: -79.4651832778902,
  },
];

// Get all locations
export const getAllLocations = (req, res) => {
  res.send(locations);
};

// Get location by ID
export const getLocationById = (req, res) => {
  const foundLocation = locations.find(
    (location) => location.id == req.params.id
  );
  res.send(foundLocation);
};

// Add new location
export const addLocation = (req, res) => {
  const id = uuidv4();
  const location = {
    id: id,
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  };
  console.log(location);

  locations.push(location);
  res.send(`Added new location with id ${id}`);
};

// Delete a location by ID
export const deleteLocationById = (req, res) => {
  const index = locations.map((location) => location.id).indexOf(req.params.id);
  locations.splice(index, 1);
};

// Update a location by ID
export const updateLocationById = (req, res) => {
  //TODO
};
