const API_URL = process.env.REACT_APP_API_URL;

export const createShortLink = async (data) => {
  const res = await fetch(`${API_URL}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

//del the Link
export const deleteShortLink = async (id) => {
  const res = await fetch(`${API_URL}/api/links/${id}`,{
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json'},
  });

  if(!res.ok){
    throw new Error('Failed to delete link');
  }
  return res.json();
}