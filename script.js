"use strict";
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

getUserIP();

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
    const timezone = data?.location?.time_zone;

    return timezone;
  } catch (error) {
    console.error("Erreur lors de la récupération des informations IP:", error);
  }
};

fetchIpData();

// async function loadGeojsonData() {
//   const data = {
//     type: "Feature",
//     properties: {
//       name: "Eiffel Tower",
//       amenity: "Historic Site",
//       popupContent: "This is where the Eiffel Tower is located.",
//     },
//     geometry: {
//       type: "Point",
//       coordinates: [2.294481, 48.85837],
//     },
//   };
//   console.log(data);
//   try {
//     L.geoJSON(data, {
//       onEachFeature: function (feature, layer) {
//         if (feature.properties && feature.properties.popupContent) {
//           layer.bindPopup(feature.properties.popupContent);
//         }
//       },
//     }).addTo(map);
//   } catch (error) {
//     console.error(
//       "Erreur lors de l'ajout des données GeoJSON à la carte:",
//       error
//     );
//   }
// }

// loadGeojsonData();

(async () => {
  const userIp = await getUserIP();
  if (userIp) {
    await fetchIpData(userIp);
  }
})();
