'use client';

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import DemoModal from "../components/DemoModal";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gustavo.AI
            <span className="block text-4xl text-blue-600 mt-2">Scheduling Service</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Intelligent AI-powered scheduling that automates property service coordination 
            through email and SMS communication. Let our AI handle the complex task of 
            finding the perfect time for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/scheduling"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Scheduling Request
            </Link>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🎬</span>
              <span>Watch Demo</span>
            </button>
            <Link 
              href="/dashboard"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Communication</h3>
              <p className="text-gray-600">
                Our AI automatically sends emails and SMS messages to coordinate with all participants.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Integration</h3>
              <p className="text-gray-600">
                Seamlessly integrates with Google Calendar, Outlook, and Apple Calendar.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Coordination</h3>
              <p className="text-gray-600">
                AI finds the optimal meeting time by analyzing everyone's availability.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Submit Request</h4>
                <p className="text-sm text-gray-600">Fill out the scheduling form with service details and participants.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Outreach</h4>
                <p className="text-sm text-gray-600">Our AI contacts all participants via email and SMS.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Collect Availability</h4>
                <p className="text-sm text-gray-600">AI gathers availability preferences from all participants.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  4
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Schedule Event</h4>
                <p className="text-sm text-gray-600">AI finds the best time and creates calendar events for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DemoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)} 
      />
    </div>
  );
}
