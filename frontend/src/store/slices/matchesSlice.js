import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk to fetch compatibility matches
export const fetchCompatibilityMatches = createAsyncThunk(
  'matches/fetchCompatibility',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/matches/top');
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch matches');
    }
  }
);

// Async thunk to fetch location-based matches
export const fetchLocationMatches = createAsyncThunk(
  'matches/fetchLocation',
  async ({ lat, lng, radius }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/matches/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch location matches');
    }
  }
);

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  'matches/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users');
      const users = response.data.data || [];
      // Transform UserDto to UserMatchDto format
      return users.map(user => ({
        id: user.id,
        matchedUser: user,
        compatibilityScore: null,
        distance: null,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Async thunk to fetch users by city
export const fetchUsersByCity = createAsyncThunk(
  'matches/fetchUsersByCity',
  async (city, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/city/${city}`);
      const users = response.data.data || [];
      // Transform UserDto to UserMatchDto format
      return users.map(user => ({
        id: user.id,
        matchedUser: user,
        compatibilityScore: null,
        distance: null,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users by city');
    }
  }
);

// Async thunk to generate matches
export const generateMatches = createAsyncThunk(
  'matches/generate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/matching/generate');
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate matches');
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    list: [],
    filters: {
      mode: null, // 'location' | 'compatibility' | null
      viewMode: 'all', // 'all' | 'roommate'
      location: {
        lat: null,
        lng: null,
        radius: 10000,
      },
    },
    selectedMatch: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedMatch: (state, action) => {
      state.selectedMatch = action.payload;
    },
    clearMatches: (state) => {
      state.list = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch compatibility matches
      .addCase(fetchCompatibilityMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompatibilityMatches.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.filters.mode = 'compatibility';
      })
      .addCase(fetchCompatibilityMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch location matches
      .addCase(fetchLocationMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationMatches.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.filters.mode = 'location';
      })
      .addCase(fetchLocationMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.filters.mode = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch users by city
      .addCase(fetchUsersByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersByCity.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.filters.mode = 'city';
      })
      .addCase(fetchUsersByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate matches
      .addCase(generateMatches.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateMatches.fulfilled, (state, action) => {
        state.list = action.payload;
        state.generating = false;
      })
      .addCase(generateMatches.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setSelectedMatch, clearMatches, clearError } = matchesSlice.actions;
export default matchesSlice.reducer;
