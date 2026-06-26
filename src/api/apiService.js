const BASE_URL = 'https://ar.bhoomitra.space/api';

// Intercept fetch calls for debugging
const originalFetch = global.fetch;
const fetch = async (url, options = {}) => {
  console.log(`\n==== [API Request] ====`);
  console.log(`Method: ${options.method || 'GET'}`);
  console.log(`URL:    ${url}`);
  if (options.headers) {
    console.log(`Headers:`, JSON.stringify(options.headers, null, 2));
  }
  if (options.body) {
    console.log(`Body:   `, options.body);
  }
  console.log(`=======================\n`);

  try {
    const response = await originalFetch(url, options);
    console.log(`\n==== [API Response Status] ====`);
    console.log(`Status: ${response.status} (${response.statusText || 'OK'})`);
    console.log(`URL:    ${url}`);
    console.log(`===============================\n`);
    return response;
  } catch (error) {
    console.error(`\nxxxx [API Request Failed] xxxx`);
    console.error(`URL:   ${url}`);
    console.error(`Error:`, error);
    console.error(`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n`);
    throw error;
  }
};

const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const parseJsonResponse = async (response, fallbackError) => {
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.warn(`[API Response JSON Parse Failed] url: ${response.url}, text: ${text}`);
    throw new Error('Invalid response from server');
  }

  console.log(`\n==== [API Response Data] ====`);
  console.log(`URL:  ${response.url}`);
  console.log(`Data:`, JSON.stringify(data, null, 2));
  console.log(`=============================\n`);

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
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(token),
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
        headers: getHeaders(token),
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
        headers: getHeaders(token),
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
        headers: getHeaders(token),
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
        headers: getHeaders(token),
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
        headers: getHeaders(token),
        body: JSON.stringify(payload),
      });

      return await parseJsonResponse(response, 'Failed to update profile');
    } catch (error) {
      throw error;
    }
  },

  async startTest(token, deviceId) {
    try {
      const response = await fetch(`${BASE_URL}/start-test/${encodeURIComponent(deviceId)}/`, {
        method: 'POST',
        headers: getHeaders(token),
      });

      return await parseJsonResponse(response, 'Failed to start soil test');
    } catch (error) {
      throw error;
    }
  },

  async completeTest(token, testId, samples) {
    try {
      const response = await fetch(`${BASE_URL}/complete-test/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({
          test_id: testId,
          samples: samples,
        }),
      });

      const data = await parseJsonResponse(response, 'Failed to complete soil test');
      if (data && data.soil_health) {
        return {
          health_score: data.soil_health.score,
          health_label: data.soil_health.label,
          avg_data: data.avg_data
        };
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  async failTest(token, testId) {
    try {
      const response = await fetch(`${BASE_URL}/fail-test/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ test_id: testId }),
      });

      return await parseJsonResponse(response, 'Failed to fail soil test');
    } catch (error) {
      throw error;
    }
  }
};
