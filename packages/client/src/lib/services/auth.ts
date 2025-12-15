import { browser } from '$app/environment';
import type { User, AuthResponse, OAuthProvider } from '../types/auth';

class AuthService {
  private static readonly API_BASE = '/api';
  
  static async getUser(): Promise<User | null> {
    if (!browser) return null;
    
    try {
      const response = await fetch(`${this.API_BASE}/auth/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const { user } = await response.json();
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async initiateOAuth(provider: OAuthProvider['provider']): Promise<void> {
    if (!browser) return;
    
    window.location.href = `/auth/${provider}`;
  }

  static async logout(): Promise<boolean> {
    if (!browser) return false;
    
    try {
      const response = await fetch(`${this.API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }
}

export default AuthService;