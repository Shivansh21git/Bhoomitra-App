const BASE_URL = 'https://ar.bhoomitra.space/api';

export const apiService = {
  async login(username, password) {
    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login Status:', response.status);

      const text = await response.text();
      console.log('Login Raw Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Backend returned HTML instead of JSON');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.log('Login Error:', error);
      throw error;
    }
  },

  async register(username, email, password, confirm_password) {
    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password,
        }),
      });

      console.log('Status Code:', response.status);

      const text = await response.text();
      console.log('Raw Response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON response from backend');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.log('Register Error:', error);
      throw error;
    }
  },

  async getHomeData(token) {
    try {
      const response = await fetch(`${BASE_URL}/home/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch home data');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async addDevice(token, devicePayload) {
    try {
      const response = await fetch(`${BASE_URL}/devices/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          device_id: devicePayload?.device_id || '',
          name: devicePayload?.name || '',
          location: devicePayload?.location || '',
          device_type: devicePayload?.device_type || '',
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error('Invalid JSON response from add device API');
      }

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Failed to add device');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
};
