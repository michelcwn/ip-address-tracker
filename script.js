"use strict";

import imagePath from "./images/icon-location.svg";

// DOM ELEMENTS
const infoIp = document.querySelector(".info__content-ip");
const infoLocation = document.querySelector(".info__content-location");
const infoTimezone = document.querySelector(".info__content-timezone");
const infoIsp = document.querySelector(".info__content-isp");
const input = document.querySelector(".search__input");
const submitButton = document.querySelector(".search__button");
const form = document.querySelector(".search__form");
// INIT THE MAP OF LEAFLET
const map = L.map("mapid", {
  center: [51.505, -0.09],
  zoom: 12,
  scrollWheelZoom: "center", // Force le zoom au centre de la carte
});

map.scrollWheelZoom.enable();

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// CUSTOMIZE ICON
let customIcon = L.icon({
  iconUrl: imagePath,
  iconSize: [46, 56],
  iconAnchor: [19, 47],
  popupAnchor: [0, -47],
});

// FETCH IP
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("User IP:", data.ip); // Log l'adresse IP de l'utilisateur
    return data.ip;
  } catch (error) {
    console.error("Unable to get user IP:", error);
  }
}

// FETCH DATA IP
const fetchIpData = async (ip) => {
  try {
    const apiKey = process.env.API_FETCH_IP_KEY;
    const allOriginsUrl = "https://api.allorigins.win/raw?url=";
    const targetUrl = encodeURIComponent(
      `https://api.findip.net/${ip}/?token=${apiKey}`
    );
    const response = await fetch(allOriginsUrl + targetUrl);

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des données : ${response.statusText}`
      );
    }

    const data = await response.json();
    const { latitude, longitude, time_zone } = data.location;
    const { isp } = data.traits;
    const { en } = data.city.names;
    const { code } = data.postal;
    console.log(data);

    infoIp.textContent = ip;
    infoLocation.textContent = `${en}, ${code}`;
    infoTimezone.textContent = time_zone;
    infoIsp.textContent = isp;

    // Centrer la carte sur la position récupérée et ajouter un marqueur
    map.setView([latitude, longitude], 13);
    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        "<span style='color: black; font-weight: bold; font-size: 16px'>Votre position approximative.</span>"
      )
      .openPopup();
  } catch (error) {
    console.error("Erreur lors de la récupération des informations IP:", error);
  }
};

(async () => {
  const userIp = await getUserIP();
  if (userIp) {
    await fetchIpData(userIp);
  }
})();

form.addEventListener("click", async function (e) {
  e.preventDefault();
  const ip = input.value;
  infoIp.textContent = ip;
  console.log(ip);
  try {
    await fetchIpData(ip);
  } catch (error) {
    console.error("Erreur lors du traitement de l'IP:", error);
  }
});
