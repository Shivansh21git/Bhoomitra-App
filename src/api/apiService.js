const BASE_URL = 'https://ar.bhoomitra.space/api';

const parseJsonResponse = async (response, fallbackError) => {
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    const error = new Error(
      data.message ||
      data.detail ||
      fallbackError
    );
    error.status = response.status;
    throw error;
  }

  return data;
};

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

      const data = await parseJsonResponse(response, 'Invalid username or password');
      if (data.status && data.status !== 'success') {
        throw new Error(data.message || 'Invalid username or password');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  async register(payload) {
    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return await parseJsonResponse(response, 'Registration failed');
    } catch (error) {
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

      return await parseJsonResponse(response, 'Failed to fetch home data');
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

      return await parseJsonResponse(response, 'Failed to add device');
    } catch (error) {
      throw error;
    }
  },

  async getDeviceAnalytics(token, deviceId) {
    try {
      const response = await fetch(`${BASE_URL}/device/${encodeURIComponent(deviceId)}/analytics/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return await parseJsonResponse(response, 'Failed to fetch device analytics');
    } catch (error) {
      throw error;
    }
  },

  async getReports(token) {
    try {
      const response = await fetch(`${BASE_URL}/reports/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return await parseJsonResponse(response, 'Failed to fetch reports');
    } catch (error) {
      throw error;
    }
  },

  async getProfile(token) {
    try {
      const response = await fetch(`${BASE_URL}/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return await parseJsonResponse(response, 'Failed to fetch profile');
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(token, payload) {
    try {
      const response = await fetch(`${BASE_URL}/profile/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      return await parseJsonResponse(response, 'Failed to update profile');
    } catch (error) {
      throw error;
    }
  }
};
