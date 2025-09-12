// Session management utility for 5GLabX authentication
// Handles both admin and user session management

export interface AdminSession {
  email: string;
  username: string;
  role: string;
  permissions: string[];
  loginTime: number;
}

export interface UserSession {
  id: string;
  email: string;
  role: string;
  loginTime: number;
}

class SessionManager {
  private static instance: SessionManager;
  private readonly ADMIN_SESSION_KEY = 'adminUser';
  private readonly USER_SESSION_KEY = 'userSession';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Admin session management
  setAdminSession(adminData: Omit<AdminSession, 'loginTime'>): void {
    const session: AdminSession = {
      ...adminData,
      loginTime: Date.now()
    };
    localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
  }

  getAdminSession(): AdminSession | null {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (!sessionData) return null;

      const session: AdminSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() - session.loginTime > this.SESSION_TIMEOUT) {
        this.clearAdminSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting admin session:', error);
      this.clearAdminSession();
      return null;
    }
  }

  clearAdminSession(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  isAdminAuthenticated(): boolean {
    return this.getAdminSession() !== null;
  }

  // User session management
  setUserSession(userData: Omit<UserSession, 'loginTime'>): void {
    const session: UserSession = {
      ...userData,
      loginTime: Date.now()
    };
    localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(session));
  }

  getUserSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.USER_SESSION_KEY);
      if (!sessionData) return null;

      const session: UserSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() - session.loginTime > this.SESSION_TIMEOUT) {
        this.clearUserSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error getting user session:', error);
      this.clearUserSession();
      return null;
    }
  }

  clearUserSession(): void {
    localStorage.removeItem(this.USER_SESSION_KEY);
  }

  isUserAuthenticated(): boolean {
    return this.getUserSession() !== null;
  }

  // Clear all sessions
  clearAllSessions(): void {
    this.clearAdminSession();
    this.clearUserSession();
    localStorage.removeItem('auth_token');
  }

  // Check if user has specific permission (for admin)
  hasPermission(permission: string): boolean {
    const adminSession = this.getAdminSession();
    if (!adminSession) return false;

    // Super admin has all permissions
    if (adminSession.role === 'superadmin') return true;
    
    // Check if permission is in the user's permissions array
    return adminSession.permissions.includes(permission) || adminSession.permissions.includes('*');
  }

  // Get current user role
  getCurrentUserRole(): string | null {
    const adminSession = this.getAdminSession();
    if (adminSession) return adminSession.role;

    const userSession = this.getUserSession();
    if (userSession) return userSession.role;

    return null;
  }

  // Check if current user is admin
  isCurrentUserAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'admin' || role === 'superadmin' || role === 'manager';
  }
}

export const sessionManager = SessionManager.getInstance();
export default sessionManager;