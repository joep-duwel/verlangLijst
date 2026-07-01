const BIN_ID = import.meta.env.VITE_BIN_ID
const API_KEY = import.meta.env.VITE_API_KEY

export async function getProducts() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY },
  })
  if (!res.ok) throw new Error('Kon data niet laden')
  const data = await res.json()
  return data.record?.products ?? []
}

export async function saveProducts(products) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
      'X-Bin-Versioning': 'false',
    },
    body: JSON.stringify({ products }),
  })
  if (!res.ok) throw new Error('Kon data niet opslaan')
}
