const axios = require("axios");
const client = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
  params: {
    key: "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik",
  },
});

module.exports = client;
