export default async function handler(req, res) {
    const { hex } = req.query

    const result = await fetch(`https://api.planespotters.net/pub/photos/hex/${hex}`)
      
      res.status(200).json(await result.json());
      
  }