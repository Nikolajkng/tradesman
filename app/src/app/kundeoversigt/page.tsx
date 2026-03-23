'use client'

import { useState } from 'react'

type Customer = {
  id: number
  navn: string
  nummer: string
}

export default function Kundeoversigt() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    navn: '',
    nummer: '',
  })


  const handleInputChange = (e: {target: {name: string, value: string}}) => {
    const { name, value } = e.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSave = () => {
    const newCustomer = {
      id: customers.length + 1,
      navn: formData.navn,
      nummer: formData.nummer,
    }
    setCustomers((current) => [...current, newCustomer])

    // Reset form data and hide form
    setFormData({
      id: '',
      navn: '',
      nummer: ''
    })
    setShowForm(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Opret bruger
      </button>

      {showForm && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h2>Ny bruger</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input
              type="text"
              name="navn"
              placeholder="Navn"
              value={formData.navn}
              onChange={handleInputChange}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="text"
              name="nummer"
              placeholder="Nummer"
              value={formData.nummer}
              onChange={handleInputChange}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />

          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Gem
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Annuller
            </button>
          </div>
        </div>
      )}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Navn</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nummer</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.navn}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.nummer}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
