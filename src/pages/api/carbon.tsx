export default async function handler(req, res) {
    const { from,to,_class,passengers } = req.query
  
 
    const url = 'https://beta3.api.climatiq.io/travel/flights';
const options = {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer '+process.env.CARBON_TRACKER_API,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    legs: [
      {
        from: from,
        to: to,
        passengers: parseInt(passengers),
        class: _class
      }    ]
  })
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