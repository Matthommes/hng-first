const axios = require("axios");

const ipinfoToken = process.env.IPINFOTOKEN;
const weatherApiKey = process.env.OPENWEATHER;

exports.greetVisitor = async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.ip;

  if (!visitorName) {
    return res.status(400).send({ error: "Add your name" });
  }

  let locationData;
  try {
    const ipInfo = await axios.get(
      `https://ipinfo.io/${clientIp}?token=${ipinfoToken}`
    );
    locationData = ipInfo.data;
    console.log("Location Data:", locationData);
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return res.status(500).send({ error: "Could not retrieve IP data" });
  }

  const { city } = locationData;
  if (!city) {
    return res
      .status(500)
      .send({ error: "Could not determine city from IP data" });
  }

  let temperature = null;
  try {
    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    temperature = Math.round(weatherResponse.data.main.temp);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).send({ error: "Could not retrieve weather data" });
  }

  const response = {
    client_ip: clientIp,
    location: `${city}`,
    greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celcius in ${city}.`,
  };

  res.send(response);
};
