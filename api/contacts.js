const API_KEY     = "pit-d4ba4162-abfa-46c4-b1b9-d766de021f2c";
const LOCATION_ID = "xPcJ8yAznzZ88ItNNevZ";

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const url = `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}&limit=100&sortBy=date_added&sortOrder=desc`;
    const ghlRes = await fetch(url, { headers: { 'Authorization': 'Bearer ' + API_KEY, 'Version': '2021-07-28' } });
    const data = await ghlRes.json();
    if (!ghlRes.ok) return res.status(400).json({ error: 'Error fetching contacts' });
    return res.status(200).json({ contacts: data.contacts || [], total: data.meta?.total || (data.contacts || []).length });
  } catch (err) {
    return res.status(500).json({ error: 'Connection error' });
  }
};