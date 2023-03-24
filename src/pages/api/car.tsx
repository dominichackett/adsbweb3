export default async function handler(req, res) {
    const { distance } = req.query
  
 
    const url = 'https://beta3.api.climatiq.io/estimate';
const options = {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer '+process.env.CARBON_TRACKER_API,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "emission_factor": {
        "activity_id": "passenger_vehicle-vehicle_type_taxi-fuel_source_na-distance_na-engine_size_na"
    },
    "parameters": {
        "distance": parseInt(distance),
        "distance_unit": "km"
    }})
};

    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      res.status(200).json( data);

    } catch (error) {
      console.error(error);
    }
    



   
      
  }