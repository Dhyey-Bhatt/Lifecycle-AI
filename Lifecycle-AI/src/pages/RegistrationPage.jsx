import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App.jsx'

export default function RegistrationPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '',
    phone: '', role: 'procurement_officer', address: '', country: '',
    password: '', additionalInfo: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password || !form.email) {
      setError('Username, email and password are required.')
      return
    }
    setLoading(true)
    const result = await signup({
      username: form.username.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      country: form.country
    })
    setLoading(false)
    if (result.success) {
      navigate('/', { state: { registered: true } })
    } else {
      setError(result.message)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #E6DDD0', background: '#FDFCFA',
    fontSize: '0.875rem', color: '#1C1914',
    outline: 'none', transition: 'border-color 0.15s'
  }
  const labelStyle = { fontSize: '0.78rem', fontWeight: '600', color: '#4A4034', marginBottom: '4px', display: 'block' }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F7F4EE 0%, #EFE9DE 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px'
    }}>
      <div style={{
        width: 'min(600px, 100%)',
        background: '#FFFFFF',
        border: '1px solid #E6DDD0',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 32px rgba(28,25,20,0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#2D7D4E' }} />

        {/* Header with photo placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: '#F0EBE2', border: '2px solid #E6DDD0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', color: '#8C7B6A', marginBottom: '12px'
          }}>
            📷
          </div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1C1914', letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p style={{ margin: '4px 0 0', color: '#8C7B6A', fontSize: '0.875rem' }}>
            Join VendorBridge — fill in your details below
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} placeholder="John" value={form.firstName} onChange={set('firstName')}
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} placeholder="Doe" value={form.lastName} onChange={set('lastName')}
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
          </div>

          {/* Email + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" style={inputStyle} placeholder="john@company.com" value={form.email} onChange={set('email')} required
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input style={inputStyle} placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')}
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
          </div>

          {/* Username + Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Username *</label>
              <input style={inputStyle} placeholder="johndoe" value={form.username} onChange={set('username')} required
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <select style={{ ...inputStyle }} value={form.role} onChange={set('role')}>
                <option value="procurement_officer">Procurement Officer</option>
                <option value="vendor">Vendor</option>
                <option value="manager_approver">Manager / Approver</option>
              </select>
            </div>
          </div>

          {/* Address + Country */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Address / Office</label>
              <input style={inputStyle} placeholder="123 Business Ave" value={form.address} onChange={set('address')}
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} placeholder="United States" value={form.country} onChange={set('country')}
                onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Password *</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={form.password} onChange={set('password')} required
              onFocus={e => e.target.style.borderColor='#2D7D4E'} onBlur={e => e.target.style.borderColor='#E6DDD0'} />
          </div>

          {/* Additional info */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Additional Information</label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              placeholder="Tell us about your company, role, or any relevant information…"
              value={form.additionalInfo}
              onChange={set('additionalInfo')}
              onFocus={e => e.target.style.borderColor='#2D7D4E'}
              onBlur={e => e.target.style.borderColor='#E6DDD0'}
            />
          </div>

          {error && <p style={{ color: '#C0392B', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '600' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: loading ? '#6EAF85' : '#2D7D4E',
              color: '#FFF', border: 'none', fontWeight: '700', fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s'
            }}
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#8C7B6A' }}>Already have an account? </span>
          <Link to="/" style={{ fontSize: '0.85rem', color: '#2D7D4E', fontWeight: '600' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
