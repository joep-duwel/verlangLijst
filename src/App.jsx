import { useState, useEffect } from 'react'
import './App.css'
import { getProducts, saveProducts } from './api'

const INITIAL_PRODUCTS = [
]

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('vl-username') || '')
  const [nameInput, setNameInput] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', url: '', img: '' })

  const isJoep = user.toLowerCase() === 'joep'

  useEffect(() => {
    if (user) loadProducts()
  }, [user])

  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      let data = await getProducts()
      if (data.length === 0) {
        data = INITIAL_PRODUCTS
        await saveProducts(data)
      }
      setProducts(data)
    } catch (e) {
      setError('Kon de lijst niet laden. Controleer je internetverbinding.')
    } finally {
      setLoading(false)
    }
  }

  function login(e) {
    e.preventDefault()
    const name = nameInput.trim()
    if (!name) return
    localStorage.setItem('vl-username', name)
    setUser(name)
  }

  function logout() {
    localStorage.removeItem('vl-username')
    setUser('')
    setProducts([])
  }

  async function persist(updated) {
    setSaving(true)
    try {
      await saveProducts(updated)
      setProducts(updated)
    } catch {
      setError('Opslaan mislukt. Probeer het opnieuw.')
    } finally {
      setSaving(false)
    }
  }

  async function addProduct(e) {
    e.preventDefault()
    if (!newProduct.name.trim()) return
    const product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      url: newProduct.url.trim(),
      img: newProduct.img.trim(),
      addedBy: user,
      claimedBy: null,
    }
    await persist([...products, product])
    setNewProduct({ name: '', url: '', img: '' })
    setShowAddForm(false)
  }

  async function claimProduct(id) {
    const updated = products.map((p) => (p.id === id ? { ...p, claimedBy: user } : p))
    await persist(updated)
  }

  async function unclaimProduct(id) {
    const updated = products.map((p) => (p.id === id ? { ...p, claimedBy: null } : p))
    await persist(updated)
  }

  async function deleteProduct(id) {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return
    await persist(products.filter((p) => p.id !== id))
  }

  const visibleProducts = isJoep
    ? products.filter((p) => p.addedBy.toLowerCase() === 'joep')
    : products

  if (!user) {
    return (
      <div className="login-screen">
        <h1>Mijn verlang lijstje</h1>
        <form className="login-form" onSubmit={login}>
          <input
            autoFocus
            placeholder="Jouw naam"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button type="submit">Inloggen</button>
        </form>
      </div>
    )
  }

  return (
    <>
      <header>
        <div className="tit">
          <h1>Joeps verlang lijstje</h1>
          <p className="p1">Klik op een product om naar de winkel te gaan</p>
          <div className="header-actions">
            <span className="welcome">Hoi, {user}!</span>
            <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Annuleren' : '+ Toevoegen'}
            </button>
            <button className="btn-logout" onClick={logout}>Uitloggen</button>
          </div>
        </div>
      </header>

      {showAddForm && (
        <div className="add-form-wrapper">
          <form className="add-form" onSubmit={addProduct}>
            <h3>Nieuw item toevoegen</h3>
            <input
              required
              placeholder="Naam van het product *"
              value={newProduct.name}
              required
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              placeholder="Link naar de winkel (URL)"
              value={newProduct.url}
              onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
            />
            <input
              placeholder="Link naar een afbeelding (URL)"
              value={newProduct.img}
              onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
            />
            <button type="submit" disabled={saving}>
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
          </form>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}

      <main>
        <div className="container">
          {loading ? (
            <p className="loading">Laden...</p>
          ) : (
            visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isJoep={isJoep}
                currentUser={user}
                saving={saving}
                onClaim={claimProduct}
                onUnclaim={unclaimProduct}
                onDelete={deleteProduct}
              />
            ))
          )}
        </div>
      </main>

      <footer>
        <div className="foot-img" />
      </footer>
    </>
  )
}

function ProductCard({ product, isJoep, currentUser, saving, onClaim, onUnclaim, onDelete }) {
  const { id, name, url, img, addedBy, claimedBy } = product
  const isClaimed = !!claimedBy
  const isClaimedByMe = claimedBy === currentUser
  const isOwner = addedBy.toLowerCase() === currentUser.toLowerCase()

  function copyName() {
    navigator.clipboard.writeText(name).then(() => alert('Productnaam gekopieerd!'))
  }

  return (
    <div className="cards">
      <div className="card-content">
        {img ? (
          <a href={url} target="_blank" rel="noreferrer">
            <img className="img-pro" src={img} alt={name} />
          </a>
        ) : (
          <div className="img-placeholder">📷 Geen afbeelding</div>
        )}
        <div className="text-content">
          <a href={url} target="_blank" rel="noreferrer">
            <h4>{name}</h4>
          </a>
          <p className="added-by">Toegevoegd door: {addedBy}</p>

      
          {isClaimed && !isJoep && (
            <span className="tag tag-claimed">Wordt gehaald door: {claimedBy}</span>
          )}

          {!isJoep && !isClaimed && (
            <button className="btn-claim" disabled={saving} onClick={() => onClaim(id)}>
              Ik koop dit!
            </button>
          )}
          {!isJoep && isClaimedByMe && (
            <button className="btn-unclaim" disabled={saving} onClick={() => onUnclaim(id)}>
              Toch niet
            </button>
          )}

          <button className="copy-button" onClick={copyName}>
            Kopieer naam
          </button>
          {isOwner && (
            <button className="btn-delete" disabled={saving} onClick={() => onDelete(id)}>
              Verwijderen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
