import { ButtonPropsLogout } from '@/types/general-type'

export type LoginMethod = 'EMAIL' | 'SMS' | 'SOCIAL' | 'FORM' | 'MAGIC'

// Save user info to local storage
export const saveUserInfo = (
  token: string,
  loginMethod: LoginMethod,
  userAddress: string,
  userData?: any
) => {
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthLoading', 'false');
  localStorage.setItem('loginMethod', loginMethod);
  localStorage.setItem('user', userAddress);
  localStorage.setItem('otpVerified', 'true');

  // Save additional user data if provided
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Dispatch events to notify other components
  window.dispatchEvent(new Event('storageUpdate'));
  window.dispatchEvent(new Event('storage'));
}

// Get user info from local storage
export function getUserInfo() {
  const token = localStorage.getItem('token');
  let userData = null;
  
  try {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      userData = JSON.parse(userDataStr);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  return {
    token: token || '',
    user: localStorage.getItem('user') || '',
    loginMethod: localStorage.getItem('loginMethod') || '',
    otpVerified: localStorage.getItem('otpVerified') === 'true',
    userData
  }
}

// Logout function
export const logout = async ({
  setToken,
  magic,
  navigate,
}: ButtonPropsLogout) => {
  try {
    // Check if user is logged in with Magic
    if (magic && (await magic.user.isLoggedIn())) {
      await magic.user.logout();
    }
    
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('otpVerified');
    localStorage.removeItem('isAuthLoading');

    setToken('');

    // Call backend logout endpoint if available
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (logoutError) {
      console.error('Error logging out from backend:', logoutError);
      // Continue with local logout even if backend logout fails
    }

    // Dispatch storage update event
    window.dispatchEvent(new Event('storageUpdate'));

    // Navigate to login page if navigate function is provided
    if (typeof navigate === 'function') {
      navigate('/authentication/login');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Helper function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    // For JWT tokens
    if (token.split('.').length === 3) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      return Date.now() >= exp * 1000;
    }
    
    // For Magic Link tokens
    return false; // Magic Link tokens are handled by the Magic SDK
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume token is expired if there's an error
  }
}