const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log(`Making API request to: ${url}`);
    console.log('Request options:', { ...options, headers: { ...this.getAuthHeaders(), ...options.headers } });
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('API Error Response:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
      
    } catch (error) {
      console.error('Network/Fetch Error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string; referralCode?: string }) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async adminRegister(userData: { name: string; email: string; password: string; adminCode: string }) {
    const response = await this.request('/auth/admin-register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Referral endpoints
  async getReferralDashboard() {
    return this.request('/referrals/dashboard');
  }

  async generateReferralCode() {
    return this.request('/referrals/generate-code', {
      method: 'POST'
    });
  }

  async getReferralCode() {
    return this.request('/referrals/code');
  }

  async getReferralStats() {
    return this.request('/referrals/stats');
  }

  async getReferredUsers() {
    return this.request('/referrals/referred-users');
  }

  async getEarningsHistory() {
    return this.request('/referrals/earnings');
  }

  async validateReferralCode(code: string) {
    return this.request(`/referrals/validate/${code}`);
  }

  async getAdminReferralStats() {
    return this.request('/admin/referrals/stats');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getRecentReferrals() {
    return this.request('/admin/referrals/recent');
  }

  // Purchase endpoints
  async createPurchase(purchaseData: { amount: number; packsBought: number }) {
    return this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData)
    });
  }

  async getPurchaseHistory() {
    return this.request('/purchases/history');
  }

  // Admin endpoints
  async toggleUserInfluencer(userId: number, isInfluencer: boolean) {
    return this.request(`/admin/users/${userId}/influencer`, {
      method: 'PATCH',
      body: JSON.stringify({ isInfluencer })
    });
  }

  async getEligiblePayouts() {
    return this.request('/admin/payouts/eligible');
  }

  async processPayout(userId: number) {
    return this.request(`/admin/payouts/${userId}`, {
      method: 'POST'
    });
  }

  // Utility methods
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
}

export const apiService = new ApiService();