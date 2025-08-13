const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
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
    return this.request(`/admin/payouts/${userId}/process`, {
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
