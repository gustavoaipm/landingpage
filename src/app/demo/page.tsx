'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      title: "Welcome to Gustavo.AI",
      description: "Let's see how our AI scheduling service works in action",
      content: (
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg text-gray-600">
            Our AI will demonstrate how it coordinates property service scheduling
          </p>
        </div>
      )
    },
    {
      title: "Step 1: Submit Scheduling Request",
      description: "Property manager submits a service request",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900">Property Manager Request</h4>
            <p className="text-sm text-blue-700">
              Service: HVAC Maintenance<br/>
              Property: 123 Main St, Unit 4B<br/>
              Participants: 3 technicians, 1 tenant<br/>
              Preferred Dates: Dec 15-20, 2024
            </p>
          </div>
          <div className="text-center text-green-600">
            ✅ Request submitted successfully
          </div>
        </div>
      )
    },
    {
      title: "Step 2: AI Outreach",
      description: "AI automatically contacts all participants",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900">📧 Email Sent</h4>
              <p className="text-sm text-green-700">
                To: tech1@company.com<br/>
                Subject: HVAC Maintenance - Availability Request<br/>
                "Hi John, we need to schedule HVAC maintenance..."
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">📱 SMS Sent</h4>
              <p className="text-sm text-blue-700">
                To: +1 (555) 123-4567<br/>
                "Gustavo.AI: Please confirm your availability for HVAC maintenance on Dec 15-20"
              </p>
            </div>
          </div>
          <div className="text-center text-green-600">
            ✅ Messages sent to all 4 participants
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Collect Responses",
      description: "AI processes participant availability",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900">📊 Analyzing Responses</h4>
            <div className="text-sm text-yellow-700 space-y-2">
              <div>✅ Tech 1: Available Dec 16, 18, 19</div>
              <div>✅ Tech 2: Available Dec 15, 17, 20</div>
              <div>✅ Tech 3: Available Dec 16, 19, 20</div>
              <div>✅ Tenant: Available Dec 15, 16, 18</div>
            </div>
          </div>
          <div className="text-center text-green-600">
            ✅ AI found optimal time: Dec 16, 2024 at 2:00 PM
          </div>
        </div>
      )
    },
    {
      title: "Step 4: AI Schedules Event",
      description: "AI creates calendar events and confirms with everyone",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900">📅 Calendar Events Created</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <div>✅ Google Calendar: HVAC Maintenance - 123 Main St</div>
              <div>✅ Outlook Calendar: Service Appointment</div>
              <div>✅ Apple Calendar: Property Maintenance</div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900">✅ Confirmation Sent</h4>
            <p className="text-sm text-green-700">
              All participants confirmed for Dec 16, 2024 at 2:00 PM
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Demo Complete!",
      description: "See how Gustavo.AI automates the entire process",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900">
            That's how Gustavo.AI works!
          </h3>
          <p className="text-gray-600">
            From request to scheduled event in minutes, not hours.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900">What just happened:</h4>
            <ul className="text-sm text-blue-700 text-left mt-2 space-y-1">
              <li>• Property manager submitted one request</li>
              <li>• AI contacted 4 participants automatically</li>
              <li>• AI analyzed all availability responses</li>
              <li>• AI found the optimal meeting time</li>
              <li>• AI created calendar events for everyone</li>
              <li>• Everyone confirmed automatically</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (currentStep === demoSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, isPlaying, demoSteps.length]);

  const startDemo = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Gustavo.AI
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gustavo.AI Demo
          </h1>
          <p className="text-lg text-gray-600">
            Watch our AI scheduling service in action
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center mb-8 space-x-4">
          {!isPlaying ? (
            <button
              onClick={startDemo}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🎬 Start Demo
            </button>
          ) : (
            <button
              onClick={resetDemo}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              🔄 Reset Demo
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Step {currentStep + 1} of {demoSteps.length}
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {demoSteps[currentStep].title}
              </h2>
              <p className="text-gray-600">
                {demoSteps[currentStep].description}
              </p>
            </div>
            
            <div className="min-h-[300px] flex items-center justify-center">
              {demoSteps[currentStep].content}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to try Gustavo.AI?
            </h3>
            <p className="text-gray-600 mb-4">
              Join our waitlist to be among the first to experience intelligent property management.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 