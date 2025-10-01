import { useState } from 'react';
import { zohoMailService } from '../services/zohoMailService';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      await zohoMailService.sendEmail(formData);

      setStatus({
        submitting: false,
        submitted: true,
        error: null
      });

      // Limpiar el formulario
      setFormData({
        name: '',
        email: '',
        company: '',
        message: ''
      });

    } catch (error) {
      setStatus({
        submitting: false,
        submitted: false,
        error: 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.'
      });
    }
  };

  return (
    <form
      className="form"
      style={{
        background: '#fff',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}
      onSubmit={handleSubmit}
    >
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '8px'}}>Nombre</label>
        <input 
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
          placeholder="Tu nombre completo" 
          required 
          disabled={status.submitting}
        />
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '8px'}}>Email</label>
        <input 
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
          placeholder="tu@email.com" 
          required 
          disabled={status.submitting}
        />
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '8px'}}>Empresa</label>
        <input 
          name="company"
          value={formData.company}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
          placeholder="Nombre de tu empresa" 
          required 
          disabled={status.submitting}
        />
      </div>
      
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '8px'}}>Mensaje</label>
        <textarea 
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5" 
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
          placeholder="Cuéntanos sobre tu proyecto..." 
          required 
          disabled={status.submitting}
        />
      </div>

      {status.error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '8px',
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          fontSize: '0.875rem'
        }}>
          {status.error}
        </div>
      )}

      {status.submitted && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '8px',
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          fontSize: '0.875rem'
        }}>
          ¡Gracias por tu mensaje! Te responderemos pronto.
        </div>
      )}

      <button 
        className="btn" 
        type="submit"
        style={{
          width: '100%',
          opacity: status.submitting ? 0.7 : 1,
          cursor: status.submitting ? 'not-allowed' : 'pointer'
        }}
        disabled={status.submitting}
      >
        {status.submitting ? 'Enviando...' : 'Enviar Mensaje'}
      </button>
    </form>
  );
}