'use client';

import { useState } from 'react';
import styles from './scheduling.module.css';

interface SchedulingRequest {
  propertyId: string;
  serviceType: 'cleaning' | 'repair' | 'inspection' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  participants: string[];
  preferredDates?: string[];
  preferredTimeSlots?: string[];
}

export default function SchedulingPage() {
  const [formData, setFormData] = useState<SchedulingRequest>({
    propertyId: '',
    serviceType: 'cleaning',
    priority: 'medium',
    description: '',
    participants: [''],
    preferredDates: [],
    preferredTimeSlots: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = value;
    setFormData(prev => ({
      ...prev,
      participants: newParticipants
    }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, '']
    }));
  };

  const removeParticipant = (index: number) => {
    if (formData.participants.length > 1) {
      const newParticipants = formData.participants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        participants: newParticipants
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Filter out empty participants
    const validParticipants = formData.participants.filter(p => p.trim() !== '');

    if (validParticipants.length === 0) {
      setError('At least one participant is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          participants: validParticipants
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSubmitted(true);
      setRequestId(data.requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scheduling request');
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
            AI Scheduling Service
          </h1>
          <p className={styles.subtitle}>
            Let our AI handle the scheduling coordination for your property services. 
            Simply provide the details and we'll communicate with all participants to find the perfect time.
          </p>

          {!isSubmitted ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Property ID</label>
                <input
                  type="text"
                  name="propertyId"
                  placeholder="Enter property identifier"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="cleaning">Cleaning</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the service needed..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Participants</label>
                <div className={styles.participantsContainer}>
                  {formData.participants.map((participant, index) => (
                    <div key={index} className={styles.participantRow}>
                      <input
                        type="text"
                        placeholder="Email or phone number"
                        value={participant}
                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                        className={styles.input}
                      />
                      {formData.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className={styles.removeButton}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addParticipant}
                    className={styles.addButton}
                  >
                    + Add Participant
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className={styles.loading}>
                    <span className={styles.spinner}></span>
                    Creating Request...
                  </span>
                ) : (
                  'Create Scheduling Request'
                )}
              </button>
            </form>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>Scheduling Request Created!</h2>
              <p className={styles.successMessage}>
                Your AI scheduling request has been created successfully. 
                Our AI will now communicate with all participants to find the best time.
              </p>
              <div className={styles.requestId}>
                <strong>Request ID:</strong> {requestId}
              </div>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    propertyId: '',
                    serviceType: 'cleaning',
                    priority: 'medium',
                    description: '',
                    participants: [''],
                    preferredDates: [],
                    preferredTimeSlots: []
                  });
                }}
                className={styles.backButton}
              >
                Create Another Request
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