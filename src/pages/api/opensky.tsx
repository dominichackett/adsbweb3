export default async function handler(req, res) {

    const result = await fetch('https://opensky-network.org/api/states/all', {
        headers: {
          Authorization: 'Basic ' + btoa(process.env.OPENSKY_USER+ ':' +process.env.OPENSKY_PASSWORD)
        }
      })
      //console.log(result)
      try{
         const results = await result.json()
        res.status(200).json(results);
      }catch(err)
      {
        res.status(200).json({"states":[]});
      }
  }