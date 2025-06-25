'use client';

import { useState } from 'react';
import styles from './waitlist.module.css';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoTextGradient}>Gustavo.AI</div>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>
            AI-powered Property Management
          </h1>
          <div className={styles.featuresRow}>
            <div className={styles.feature}><span className={styles.featureIcon}>🤖</span>AI-powered Automation</div>
            <div className={styles.feature}><span className={styles.featureIcon}>📊</span>Predictive Analytics</div>
            <div className={styles.feature}><span className={styles.featureIcon}>💬</span>Smart Communication</div>
          </div>
          <p className={styles.subtitle}>
            Be among the first to experience AI-powered property management that saves you time, 
            increases your ROI, and transforms how you manage properties.
          </p>

          {!isSubmitted ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && (
                <div style={{ 
                  color: '#ff6b6b', 
                  backgroundColor: 'rgba(255, 107, 107, 0.1)', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  marginBottom: '15px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={styles.loading}>
                    <span className={styles.spinner}></span>
                    Joining Waitlist...
                  </span>
                ) : (
                  'Join the Waitlist'
                )}
              </button>
            </form>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>You&apos;re on the list!</h2>
              <p className={styles.successMessage}>
                Thank you for joining our waitlist. We&apos;ll notify you as soon as Gustavo AI is ready for you.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className={styles.backButton}
              >
                Join Another Email
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.background}>
        <div className={styles.gradient}></div>
        <div className={styles.particles}>
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
      </div>
    </div>
  );
} 