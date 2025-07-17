'use client';

import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TooltipItem,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface Property {
  id: string;
  address: string;
  value: number;
  monthlyRent: number;
  isOccupied: boolean;
  lastPaymentDate: string;
  paymentStatus: 'on_time' | 'late' | 'overdue';
  zillowValue?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'ai_completed' | 'ai_pending' | 'human_attention';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedDate?: string;
  propertyId?: string;
}

interface PortfolioMetrics {
  totalValue: number;
  monthlyRentCollected: number;
  monthlyRentToCollect: number;
  occupancyRate: number;
  latePayments: number;
  overduePayments: number;
}

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    monthlyRentCollected: 0,
    monthlyRentToCollect: 0,
    occupancyRate: 0,
    latePayments: 0,
    overduePayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would come from your API
      const mockProperties: Property[] = [
        {
          id: '1',
          address: '123 Main St, Downtown',
          value: 450000,
          monthlyRent: 2800,
          isOccupied: true,
          lastPaymentDate: '2024-01-15',
          paymentStatus: 'on_time',
        },
        {
          id: '2',
          address: '456 Oak Ave, Suburbs',
          value: 320000,
          monthlyRent: 2100,
          isOccupied: true,
          lastPaymentDate: '2024-01-10',
          paymentStatus: 'late',
        },
        {
          id: '3',
          address: '789 Pine Rd, City Center',
          value: 580000,
          monthlyRent: 3500,
          isOccupied: false,
          lastPaymentDate: '2024-01-01',
          paymentStatus: 'overdue',
        },
        {
          id: '4',
          address: '321 Elm St, Westside',
          value: 380000,
          monthlyRent: 2400,
          isOccupied: true,
          lastPaymentDate: '2024-01-20',
          paymentStatus: 'on_time',
        },
      ];

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Lease Renewal Processed',
          description: 'AI automatically processed lease renewal for 123 Main St',
          type: 'ai_completed',
          priority: 'medium',
          completedDate: '2024-01-20',
          propertyId: '1',
        },
        {
          id: '2',
          title: 'Maintenance Request Scheduled',
          description: 'Plumbing repair scheduled for 456 Oak Ave',
          type: 'ai_pending',
          priority: 'high',
          dueDate: '2024-01-25',
          propertyId: '2',
        },
        {
          id: '3',
          title: 'Late Payment Follow-up',
          description: 'Tenant at 789 Pine Rd has overdue payment - requires human intervention',
          type: 'human_attention',
          priority: 'high',
          dueDate: '2024-01-22',
          propertyId: '3',
        },
        {
          id: '4',
          title: 'Property Value Update',
          description: 'AI updated property values using latest market data',
          type: 'ai_completed',
          priority: 'low',
          completedDate: '2024-01-19',
        },
      ];

      setProperties(mockProperties);
      setTasks(mockTasks);

      // Calculate metrics
      const totalValue = mockProperties.reduce((sum, prop) => sum + prop.value, 0);
      const monthlyRentCollected = mockProperties
        .filter(prop => prop.paymentStatus === 'on_time')
        .reduce((sum, prop) => sum + prop.monthlyRent, 0);
      const monthlyRentToCollect = mockProperties
        .filter(prop => prop.paymentStatus !== 'on_time')
        .reduce((sum, prop) => sum + prop.monthlyRent, 0);
      const occupancyRate = (mockProperties.filter(prop => prop.isOccupied).length / mockProperties.length) * 100;
      const latePayments = mockProperties.filter(prop => prop.paymentStatus === 'late').length;
      const overduePayments = mockProperties.filter(prop => prop.paymentStatus === 'overdue').length;

      setMetrics({
        totalValue,
        monthlyRentCollected,
        monthlyRentToCollect,
        occupancyRate,
        latePayments,
        overduePayments,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const pieChartData = {
    labels: properties.map(prop => prop.address),
    datasets: [
      {
        data: properties.map(prop => prop.value),
        backgroundColor: [
          '#667eea', // Primary blue
          '#764ba2', // Secondary purple
          '#f093fb', // Light purple
          '#f5576c', // Pink
          '#4facfe', // Light blue
          '#00f2fe', // Cyan
        ],
        borderWidth: 3,
        borderColor: '#ffffff',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          color: '#333',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            const value = context.parsed;
            const percentage = ((value / metrics.totalValue) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'ai_completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ai_pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'human_attention':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 border-b-4 border-gradient-to-r from-blue-500 to-purple-600"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Portfolio Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your rental properties and monitor performance with AI-powered insights
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Portfolio Value</h3>
                  <p className="text-2xl font-bold text-gray-900">${metrics.totalValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Rent Collected</h3>
                  <p className="text-2xl font-bold text-green-600">${metrics.monthlyRentCollected.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Rent to Collect</h3>
                  <p className="text-2xl font-bold text-yellow-600">${metrics.monthlyRentToCollect.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">⏳</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Occupancy Rate</h3>
                  <p className="text-2xl font-bold text-blue-600">{metrics.occupancyRate.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">🏠</span>
                </div>
              </div>
            </div>
          </div>

          {/* Late Payment Alerts */}
          {(metrics.latePayments > 0 || metrics.overduePayments > 0) && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">⚠️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800">
                      Payment Alerts
                    </h3>
                    <div className="mt-2">
                      <p>
                        {metrics.latePayments > 0 && `${metrics.latePayments} late payment${metrics.latePayments > 1 ? 's' : ''}`}
                        {metrics.latePayments > 0 && metrics.overduePayments > 0 && ' and '}
                        {metrics.overduePayments > 0 && `${metrics.overduePayments} overdue payment${metrics.overduePayments > 1 ? 's' : ''}`}
                        {metrics.latePayments > 0 || metrics.overduePayments > 0 ? ' require attention.' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Portfolio Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Portfolio Distribution</h2>
                <p className="text-sm text-gray-500">Property values by location</p>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
                <p className="text-sm text-gray-500">Current status and payment information</p>
              </div>
              <div className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <div key={property.id} className="p-6 bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">{property.address}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Value:</span> ${property.value.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Rent:</span> ${property.monthlyRent.toLocaleString()}
                          </div>
                          <div>
                            <span className={`font-medium ${property.isOccupied ? 'text-green-600' : 'text-red-600'}`}>
                              {property.isOccupied ? '✅ Occupied' : '❌ Vacant'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentStatusColor(property.paymentStatus)}`}>
                          {property.paymentStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Tasks */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">AI Tasks</h2>
                <p className="text-sm text-gray-500">Completed and upcoming automated tasks</p>
              </div>
              <div className="divide-y divide-gray-100">
                {tasks.filter(task => task.type !== 'human_attention').map((task) => (
                  <div key={task.id} className="p-6 bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTaskTypeColor(task.type)}`}>
                            {task.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        {task.completedDate && (
                          <p className="text-xs text-green-600">
                            ✅ Completed: {new Date(task.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Human Attention Tasks */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Requires Human Attention</h2>
                <p className="text-sm text-gray-500">Tasks that need your intervention</p>
              </div>
              <div className="divide-y divide-gray-100">
                {tasks.filter(task => task.type === 'human_attention').map((task) => (
                  <div key={task.id} className="p-6 bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTaskTypeColor(task.type)}`}>
                            {task.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        {task.dueDate && (
                          <p className="text-xs text-red-600">
                            ⏰ Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                        Take Action →
                      </button>
                    </div>
                  </div>
                ))}
                {tasks.filter(task => task.type === 'human_attention').length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <p className="text-gray-500 font-medium">No tasks requiring human attention at this time.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 