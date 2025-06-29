'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Successfully added to waitlist!');
        setEmail('');
        setName('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <h1 className={styles.logoTextGradient}>Gustavo.AI</h1>
          <p className={styles.tagline}>Intelligent Property Management</p>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Join the Waitlist</h2>
          <p className={styles.formDescription}>
            Be among the first to experience the future of property management with AI.
          </p>

          {isSuccess ? (
            <div className={styles.successMessage}>
              <h3>Thank you for joining!</h3>
              <p>We'll notify you as soon as Gustavo.AI is ready for you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
              {message && (
                <p className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
                  {message}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Demo Button */}
        <div className={styles.demoSection}>
          <Link href="/demo" className={styles.demoButton}>
            🎬 Watch Demo
          </Link>
          <p className={styles.demoDescription}>
            See how Gustavo.AI automates property service scheduling
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🤖</div>
            <h3>AI-Powered</h3>
            <p>Advanced artificial intelligence that learns and adapts to your property management needs.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Lightning Fast</h3>
            <p>Automated processes that save you hours of manual work every day.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security with 99.9% uptime guarantee.</p>
          </div>
        </div>

        <div className={styles.footer}>
          <p>&copy; 2024 Gustavo.AI. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/admin/waitlist" className={styles.footerLink}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
