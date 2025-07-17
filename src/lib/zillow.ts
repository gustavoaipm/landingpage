// Zillow API integration for property value fetching
// Note: This is a simplified implementation. In production, you'd need to:
// 1. Sign up for Zillow API access
// 2. Handle rate limiting
// 3. Implement proper error handling
// 4. Cache results to avoid hitting API limits

interface ZillowPropertyData {
  zpid: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  zestimate: {
    amount: number;
    currency: string;
    lastUpdated: string;
    valueChange: number;
    valueLow: number;
    valueHigh: number;
  };
  rentZestimate?: {
    amount: number;
    currency: string;
    lastUpdated: string;
    valueLow: number;
    valueHigh: number;
  };
}

interface ZillowSearchResult {
  properties: ZillowPropertyData[];
}

export class ZillowService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ZILLOW_API_KEY || '';
    this.baseUrl = 'https://api.bridgedataoutput.com/api/v2'; // Zillow API endpoint
  }

  /**
   * Search for a property by address
   */
  async searchProperty(address: string, city: string, state: string, zipcode: string): Promise<ZillowPropertyData | null> {
    try {
      if (!this.apiKey) {
        console.warn('Zillow API key not configured');
        return null;
      }

      const response = await fetch(`${this.baseUrl}/properties`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        // Note: This is a simplified query. Real Zillow API has different parameters
        // You'll need to adjust based on the actual Zillow API documentation
      });

      if (!response.ok) {
        console.error('Zillow API error:', response.status, response.statusText);
        return null;
      }

      const data: ZillowSearchResult = await response.json();
      
      if (data.properties && data.properties.length > 0) {
        return data.properties[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching Zillow data:', error);
      return null;
    }
  }

  /**
   * Get property value estimate
   */
  async getPropertyValue(address: string, city: string, state: string, zipcode: string): Promise<{
    value: number;
    confidence: number;
    source: string;
    lastUpdated: string;
  } | null> {
    try {
      const propertyData = await this.searchProperty(address, city, state, zipcode);
      
      if (!propertyData) {
        return null;
      }

      return {
        value: propertyData.zestimate.amount,
        confidence: this.calculateConfidence(propertyData.zestimate),
        source: 'zillow',
        lastUpdated: propertyData.zestimate.lastUpdated,
      };
    } catch (error) {
      console.error('Error getting property value:', error);
      return null;
    }
  }

  /**
   * Get rental estimate
   */
  async getRentalEstimate(address: string, city: string, state: string, zipcode: string): Promise<{
    rent: number;
    confidence: number;
    source: string;
    lastUpdated: string;
  } | null> {
    try {
      const propertyData = await this.searchProperty(address, city, state, zipcode);
      
      if (!propertyData || !propertyData.rentZestimate) {
        return null;
      }

      return {
        rent: propertyData.rentZestimate.amount,
        confidence: this.calculateConfidence(propertyData.rentZestimate),
        source: 'zillow_rent',
        lastUpdated: propertyData.rentZestimate.lastUpdated,
      };
    } catch (error) {
      console.error('Error getting rental estimate:', error);
      return null;
    }
  }

  /**
   * Calculate confidence score based on value range
   */
  private calculateConfidence(zestimate: { valueLow: number; valueHigh: number; amount: number }): number {
    const range = zestimate.valueHigh - zestimate.valueLow;
    const percentage = (range / zestimate.amount) * 100;
    
    // Lower percentage range = higher confidence
    if (percentage <= 5) return 0.95;
    if (percentage <= 10) return 0.85;
    if (percentage <= 15) return 0.75;
    if (percentage <= 20) return 0.65;
    if (percentage <= 25) return 0.55;
    return 0.45;
  }

  /**
   * Mock implementation for development/testing
   */
  async getMockPropertyValue(address: string): Promise<{
    value: number;
    confidence: number;
    source: string;
    lastUpdated: string;
  } | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a mock value based on address
    const hash = address.split('').reduce((a: number, b: string) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const baseValue = 300000 + Math.abs(hash) % 400000; // Random value between 300k-700k
    const confidence = 0.7 + (Math.random() * 0.25); // Random confidence between 0.7-0.95

    return {
      value: baseValue,
      confidence,
      source: 'zillow_mock',
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Mock rental estimate for development/testing
   */
  async getMockRentalEstimate(address: string): Promise<{
    rent: number;
    confidence: number;
    source: string;
    lastUpdated: string;
  } | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generate a mock rent based on address
    const hash = address.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const baseRent = 1500 + Math.abs(hash) % 2000; // Random rent between 1500-3500
    const confidence = 0.6 + (Math.random() * 0.3); // Random confidence between 0.6-0.9

    return {
      rent: baseRent,
      confidence,
      source: 'zillow_rent_mock',
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const zillowService = new ZillowService(); 