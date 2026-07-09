const API_KEY     = "pit-d4ba4162-abfa-46c4-b1b9-d766de021f2c";
const LOCATION_ID = "xFlS4W9wbaoF9ayQlEQE";

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, phone } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: 'Faltan campos requeridos.' });
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName  = parts.slice(1).join(' ') || '';
  try {
    const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + API_KEY, 'Version': '2021-07-28', 'Content-Type': 'application/json' },
     body: JSON.stringify({ firstName, lastName, phone, locationId: LOCATION_ID, tags: ['desde-app'] })
    });
    const data = await ghlRes.json();
    if (ghlRes.ok) return res.status(200).json({ success: true });
    return res.status(400).json({ error: data?.message || 'Error del CRM.' });
  } catch (err) {
    return res.status(500).json({ error: 'Error de conexión.' });
  }
};
