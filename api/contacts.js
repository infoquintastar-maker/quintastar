const API_KEY     = 'pit-d59bea54-051b-4622-9acd-60414423522d';
const LOCATION_ID = 'xFlS4W9wbaoF9ayQlEQE';

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

  const headers = {
    'Authorization': 'Bearer ' + API_KEY,
    'Version': '2021-07-28',
    'Content-Type': 'application/json'
  };

  try {
    // Paso 1: crear contacto
    const createRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers,
      body: JSON.stringify({ firstName, lastName, phone, locationId: LOCATION_ID })
    });
    const createData = await createRes.json();
    if (!createRes.ok) return res.status(400).json({ error: createData?.message || 'Error del CRM.' });

    // Paso 2: añadir tag desde-app
    const contactId = createData.contact?.id;
    if (contactId) {
      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tags: ['desde-app'] })
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Error de conexión.' });
  }
};
