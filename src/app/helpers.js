// src/app/helpers.js
import { jwtDecode } from 'jwt-decode';

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.id; // or use the key that matches your payload structure
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Universal helper function for API calls
const fetchApi = async ({ route, method = 'GET', token = '', body = null, customHeaders = {} }) => {
  try {
    const host = process.env.NEXT_PUBLIC_BACKEND_HOST;

      if (!host) {
        console.error('Backend host is missing. Please set NEXT_PUBLIC_BACKEND_HOST in your environment variables.');
        return;
      }
    const url = `${host}${route}`;

    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Add the token directly without "Bearer"
    if (token) {
      headers['Authorization'] = token;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // Check for response errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during API call:', error);
    throw error; // Re-throwing for further handling if needed
  }
};

export {
  getUserIdFromToken,
  fetchApi
};