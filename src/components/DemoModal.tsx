'use client';

import { useState, useEffect } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
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
      description: "Property manager fills out the scheduling form",
      content: (
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Property Manager</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                "Need to schedule a plumbing inspection for Unit 3B. 
                Available participants: tenant, plumber, property manager"
              </p>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Form submitted to Gustavo.AI
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 2: AI Outreach",
      description: "AI automatically contacts all participants",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Email to Tenant</span>
              </div>
              <p className="text-xs text-gray-600">
                "Hi Sarah, we need to schedule a plumbing inspection..."
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">SMS to Plumber</span>
              </div>
              <p className="text-xs text-gray-600">
                "Mike, new job at 123 Main St. Unit 3B..."
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Calendar Check</span>
              </div>
              <p className="text-xs text-gray-600">
                "Checking property manager's availability..."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Collect Responses",
      description: "AI gathers availability from all participants",
      content: (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tenant Response:</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
              <div className="text-xs text-gray-600">
                "I'm available Tuesday 2-4pm or Wednesday 10am-12pm"
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plumber Response:</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
              <div className="text-xs text-gray-600">
                "Tuesday 2-4pm works for me"
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Property Manager:</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
              <div className="text-xs text-gray-600">
                "Tuesday 2-4pm is perfect"
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Step 4: AI Schedules Event",
      description: "AI finds the optimal time and creates calendar events",
      content: (
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Event Scheduled Successfully!
            </h3>
            <div className="text-sm text-green-700">
              <p><strong>Date:</strong> Tuesday, December 17th</p>
              <p><strong>Time:</strong> 2:00 PM - 4:00 PM</p>
              <p><strong>Location:</strong> 123 Main St, Unit 3B</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium text-blue-800">Calendar Events Created</div>
              <div className="text-blue-600">For all participants</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-medium text-green-800">Confirmation Sent</div>
              <div className="text-green-600">Email + SMS</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="font-medium text-purple-800">Reminders Set</div>
              <div className="text-purple-600">24h & 1h before</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Demo Complete!",
      description: "That's how Gustavo.AI makes scheduling effortless",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-900">
            Scheduling Made Simple
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="font-medium">Saves Hours</div>
              <div className="text-gray-600">No more back-and-forth emails</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-medium">AI-Powered</div>
              <div className="text-gray-600">Intelligent coordination</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-medium">Calendar Sync</div>
              <div className="text-gray-600">Works with your existing tools</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isOpen && isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying, isOpen, demoSteps.length]);

  const startDemo = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {demoSteps[currentStep].title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {demoSteps[currentStep].description}
          </p>
        </div>

        <div className="p-6">
          {demoSteps[currentStep].content}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isPlaying ? (
                <button
                  onClick={startDemo}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ▶️ Start Demo
                </button>
              ) : (
                <button
                  onClick={resetDemo}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🔄 Restart
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {demoSteps.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
