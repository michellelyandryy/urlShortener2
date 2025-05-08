const API_URL = process.env.REACT_APP_API_URL;

export const createShortLink = async (data) => {
  const res = await fetch(`${API_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};
