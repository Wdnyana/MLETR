import { ButtonPropsLogout } from '@/types/general-type'

export type LoginMethod = 'EMAIL' | 'SMS' | 'SOCIAL' | 'FORM' | 'MAGIC'

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

  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  window.dispatchEvent(new Event('storageUpdate'));
  window.dispatchEvent(new Event('storage'));
}

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

export const logout = async ({
  setToken,
  magic,
  navigate,
}: ButtonPropsLogout) => {
  try {
    if (magic && (await magic.user.isLoggedIn())) {
      await magic.user.logout();
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('otpVerified');
    localStorage.removeItem('isAuthLoading');

    setToken('');

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
    }

    window.dispatchEvent(new Event('storageUpdate'));

    if (typeof navigate === 'function') {
      navigate('/authentication/login');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    if (token.split('.').length === 3) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      return Date.now() >= exp * 1000;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}