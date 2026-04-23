import { useState } from 'react';
import { zohoMailService } from '../services/zohoMailService';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState({ submitting: false, submitted: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });
    try {
      await zohoMailService.sendEmail(formData);
      setStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus({ submitting: false, submitted: false, error: 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.' });
    }
  };

  return (
    <form className="ns-contact-form" onSubmit={handleSubmit}>
      {[
        { id: 'name',    label: 'Nombre',   type: 'text',  placeholder: 'Tu nombre completo' },
        { id: 'email',   label: 'Email',    type: 'email', placeholder: 'tu@email.com' },
        { id: 'company', label: 'Empresa',  type: 'text',  placeholder: 'Nombre de tu empresa' },
      ].map(f => (
        <div key={f.id} className="ns-contact-field">
          <label htmlFor={f.id}>{f.label}</label>
          <input
            id={f.id}
            name={f.id}
            type={f.type}
            value={formData[f.id]}
            onChange={handleChange}
            className="nds-input"
            placeholder={f.placeholder}
            required
            disabled={status.submitting}
          />
        </div>
      ))}

      <div className="ns-contact-field">
        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="nds-input"
          style={{ resize: 'vertical' }}
          placeholder="Cuéntanos sobre tu proyecto..."
          required
          disabled={status.submitting}
        />
      </div>

      {status.error && (
        <div className="ns-form-feedback ns-form-feedback--error">{status.error}</div>
      )}
      {status.submitted && (
        <div className="ns-form-feedback ns-form-feedback--success">
          ¡Gracias por tu mensaje! Te responderemos pronto.
        </div>
      )}

      <button
        type="submit"
        className="ns-btn ns-btn-primary"
        style={{ width: '100%', justifyContent: 'center', opacity: status.submitting ? 0.7 : 1, cursor: status.submitting ? 'not-allowed' : 'pointer' }}
        disabled={status.submitting}
      >
        {status.submitting ? 'Enviando…' : 'Enviar Mensaje'}
      </button>
    </form>
  );
}
