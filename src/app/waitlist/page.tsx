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
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const copyToClipboard = async () => {
    const waitlistUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(waitlistUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnSocial = (platform: string) => {
    const waitlistUrl = window.location.href;
    const text = "Join me on the waitlist for Gustavo AI - the future of AI-powered property management! 🏠🤖";
    
    let shareUrl = '';
    
    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Join Gustavo AI Waitlist')}&body=${encodeURIComponent(text + '\n\n' + waitlistUrl)}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodeURIComponent(text + ' ' + waitlistUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + waitlistUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(waitlistUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(waitlistUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(waitlistUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
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
              
              <div className={styles.referSection}>
                <button 
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className={styles.referButton}
                >
                  <span className={styles.referIcon}>📤</span>
                  Refer a Friend
                </button>
                
                {showShareOptions && (
                  <div className={styles.shareOptions}>
                    <div className={styles.shareHeader}>
                      <h3>Share the waitlist</h3>
                      <button 
                        onClick={() => setShowShareOptions(false)}
                        className={styles.closeButton}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className={styles.shareButtons}>
                      <button 
                        onClick={() => shareOnSocial('email')}
                        className={`${styles.shareButton} ${styles.email}`}
                      >
                        <span>📧</span> Email
                      </button>
                      <button 
                        onClick={() => shareOnSocial('sms')}
                        className={`${styles.shareButton} ${styles.sms}`}
                      >
                        <span>📞</span> Text
                      </button>
                      <button 
                        onClick={() => shareOnSocial('whatsapp')}
                        className={`${styles.shareButton} ${styles.whatsapp}`}
                      >
                        <span>💬</span> WhatsApp
                      </button>
                      <button 
                        onClick={() => shareOnSocial('linkedin')}
                        className={`${styles.shareButton} ${styles.linkedin}`}
                      >
                        <span>💼</span> LinkedIn
                      </button>
                      <button 
                        onClick={() => shareOnSocial('facebook')}
                        className={`${styles.shareButton} ${styles.facebook}`}
                      >
                        <span>📘</span> Facebook
                      </button>
                      <button 
                        onClick={() => shareOnSocial('twitter')}
                        className={`${styles.shareButton} ${styles.twitter}`}
                      >
                        <span>𝕏</span> X
                      </button>
                    </div>
                    
                    <div className={styles.copySection}>
                      <p>Or copy the link:</p>
                      <div className={styles.copyContainer}>
                        <input 
                          type="text" 
                          value={typeof window !== 'undefined' ? window.location.href : ''} 
                          readOnly 
                          className={styles.copyInput}
                        />
                        <button 
                          onClick={copyToClipboard}
                          className={styles.copyButton}
                        >
                          {copySuccess ? '✓ Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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