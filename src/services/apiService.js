import axios from 'axios';

const API_URL = 'http://localhost:2000/api/';

export const register = (username, email, password) => {
  return axios.post(API_URL + 'auth/register', {
    username,
    email,
    password,
  });
};

export const login = (email, password) => {
  return axios.post(API_URL + 'auth/login', {
    email,
    password,
  }).then((response) => {
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  });
};

// search resorts 
export const searchResorts = (searchTerm) => {
    const token = localStorage.getItem('token');
    return axios.get(API_URL + 'resort/search', {
      headers: {
        'Authorization': `${token}`
      },
      params: {
        name: searchTerm,
      },
    }).then((response) => response.data);
  };

// New add resort to monitored list function
export const addResortToMonitoredList = (userId, resortId) => {
    // Assuming you're storing the user's token in local storage upon login
    const token = localStorage.getItem('token');    
    return axios.post(API_URL + `user/${userId}/monitor-resort/${resortId}`, {}, {
      headers: {
        // Include the token in the authorization header
        'Authorization': `${token}`,
      },
    });
  };

// get monitored resorts
export const getMonitoredResorts = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL + `user/${userId}/monitored-resorts`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monitored resorts:', error);
      throw error; // Rethrow or handle as needed
    }
  };
  

//admin resort related
  export const addNewResort = async ({ name, location, lat, lon }) => {
    const response = await axios.post(API_URL + 'resort/add', {
      name,
      location,
      lat: parseFloat(lat), // Ensure lat and lon are sent as numbers
      lon: parseFloat(lon),
    }, {
      headers: {
        // Include the admin's auth token in the request
        'Authorization': `${localStorage.getItem('adminToken')}`,
      },
    });
    return response.data;
  };

  export const getAllResorts = async () => {
    const response = await axios.get(API_URL + 'resort'); 
    return response.data;
  };
  
  export const deleteResort = async (resortId) => {
    await axios.delete(`${API_URL}resort/${resortId}`, {
      headers: { 'Authorization': `${localStorage.getItem('adminToken')}` },
    });
  };