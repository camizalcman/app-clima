export async function obtenerClima(lat = null, lon = null, ciudad=null){

  const myAPIKey = "8ba418c512314911b0a200932251210";

  //armo la URL para llamar a current.json
  const climaURL = new URL("https://api.weatherapi.com/v1/current.json");
  
  //parámetros
  climaURL.searchParams.append("key", myAPIKey);    
  climaURL.searchParams.append("lang", "es");

  //Si están las coordenadas coordenadas, uso lat y lon, sino uso la ciudad por defecto
  if (lat !== null && lon !== null) {
    climaURL.searchParams.append("q", `${lat},${lon}`);
  } else if (ciudad){
    climaURL.searchParams.append("q", ciudad);
  } else {
    climaURL.searchParams.append("q", "Buenos Aires");
  }

  //Configuracion de la request
  const myHeaders = {
      "Authorization": myAPIKey, //envio la clave de autorización
      "Content-Type": "application/json", //declaro el tipo de contenido
      "Accept": "application/json" //declaro el tipo de contenido que acepto en la respuesta
  }

  const myRequestParams = {
    method: "GET",
    headers: myHeaders
  };

  return fetch(climaURL, myRequestParams)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Datos del clima actual:", data);

    const climaActual = data; // guardo los datos en la variable reactiva

    //SEGUNDA LLAMADA - FORECAST.JSON
    const forecastURL = new URL("https://api.weatherapi.com/v1/forecast.json");

    forecastURL.searchParams.append("key", myAPIKey);
    forecastURL.searchParams.append("lang", "es");
    forecastURL.searchParams.append("days", 6);
    forecastURL.searchParams.append("aqi", "no");
    forecastURL.searchParams.append("alerts", "no");

    if (lat !== null && lon !== null) {
      forecastURL.searchParams.append("q", `${lat},${lon}`);
    } else if (ciudad) {
      forecastURL.searchParams.append("q", ciudad);
    } else {
      forecastURL.searchParams.append("q", "Buenos Aires");
    }
    return fetch(forecastURL, myRequestParams)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(forecastData => {
        //Informacion de temp por hora
        const hoyHoras = forecastData.forecast.forecastday[0].hour
        .map(h => ({
          hora: h.time.split(" ")[1],
          temp: h.temp_c,
          icon: h.condition.icon
        }))
           .filter((_, i) => i % 2 === 0);
        
        //Informacion de temp próximos días
        const pronosticoDias = forecastData.forecast.forecastday
        .slice(0, 5) 
        .map(d => ({
            dia: new Date(d.date).toLocaleDateString('es-AR', { weekday: 'long' }),
            icon: d.day.condition.icon,
            descripcion: d.day.condition.text,
            tempMax: d.day.maxtemp_c,
            tempMin: d.day.mintemp_c
        }));

        const resultado = {
          ...climaActual, // datos del clima actual
          forecast: {
            horaPorHora: hoyHoras,
            pronostico: pronosticoDias
          }
        };

        console.log("Datos del pronóstico:", resultado.forecast);
        return resultado;
    })

  .catch(error => {
    console.error("Ocurrió un error:", error);
    throw new Error("No se pudo obtener el clima");
  });
})}