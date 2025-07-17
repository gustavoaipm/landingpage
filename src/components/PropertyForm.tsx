'use client';

import { useState } from 'react';
import { zillowService } from '@/lib/zillow';

interface PropertyFormProps {
  onSubmit: (propertyData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function PropertyForm({ onSubmit, onCancel, initialData }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    address: initialData?.address || '',
    unit_number: initialData?.unit_number || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip_code: initialData?.zip_code || '',
    property_type: initialData?.property_type || 'residential',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    square_feet: initialData?.square_feet || '',
    year_built: initialData?.year_built || '',
    manual_value: initialData?.manual_value || '',
  });

  const [loading, setLoading] = useState(false);
  const [zillowLoading, setZillowLoading] = useState(false);
  const [zillowValue, setZillowValue] = useState<number | null>(null);
  const [useZillowValue, setUseZillowValue] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zip_code.trim()) {
      newErrors.zip_code = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const fetchZillowValue = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.zip_code) {
      setErrors({
        address: 'Complete address is required to fetch Zillow value',
      });
      return;
    }

    setZillowLoading(true);
    try {
      const value = await zillowService.getMockPropertyValue(
        `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`
      );

      if (value) {
        setZillowValue(value.value);
        setUseZillowValue(true);
      } else {
        setErrors({
          address: 'Could not find property value on Zillow',
        });
      }
    } catch (error) {
      setErrors({
        address: 'Error fetching Zillow value',
      });
    } finally {
      setZillowLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        manual_value: formData.manual_value ? parseFloat(formData.manual_value) : null,
        zillow_value: useZillowValue ? zillowValue : null,
        use_zillow_value: useZillowValue,
      };

      await onSubmit(propertyData);
    } catch (error) {
      console.error('Error submitting property:', error);
      setErrors({
        submit: 'Failed to save property',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? 'Edit Property' : 'Add New Property'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123 Main St"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="unit_number" className="block text-sm font-medium text-gray-700 mb-1">
              Unit Number
            </label>
            <input
              type="text"
              id="unit_number"
              name="unit_number"
              value={formData.unit_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apt 1B"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Los Angeles"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="CA"
              maxLength={2}
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>

          <div>
            <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.zip_code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="90210"
              maxLength={10}
            />
            {errors.zip_code && <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed Use</option>
            </select>
          </div>

          <div>
            <label htmlFor="year_built" className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              type="number"
              id="year_built"
              name="year_built"
              value={formData.year_built}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1995"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2.5"
              min="0"
              step="0.5"
            />
          </div>

          <div>
            <label htmlFor="square_feet" className="block text-sm font-medium text-gray-700 mb-1">
              Square Feet
            </label>
            <input
              type="number"
              id="square_feet"
              name="square_feet"
              value={formData.square_feet}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1500"
              min="0"
            />
          </div>
        </div>

        {/* Property Value */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Value</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="manual_value" className="block text-sm font-medium text-gray-700 mb-1">
                Manual Value ($)
              </label>
              <input
                type="number"
                id="manual_value"
                name="manual_value"
                value={formData.manual_value}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="450000"
                min="0"
                step="1000"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={fetchZillowValue}
                disabled={zillowLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {zillowLoading ? 'Fetching...' : 'Get Zillow Value'}
              </button>
              
              {zillowValue && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Zillow Estimate:</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${zillowValue.toLocaleString()}
                  </span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useZillowValue}
                      onChange={(e) => setUseZillowValue(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Use this value</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (initialData ? 'Update Property' : 'Add Property')}
          </button>
        </div>
      </form>
    </div>
  );
} 