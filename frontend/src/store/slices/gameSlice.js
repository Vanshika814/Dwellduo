import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk to check game completion status
export const checkGameCompletion = createAsyncThunk(
  'game/checkCompletion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/game/completed');
      return response.data.data || false;
    } catch (error) {
      return rejectWithValue(false);
    }
  }
);

// Async thunk to fetch game questions
export const fetchGameQuestions = createAsyncThunk(
  'game/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/game/questions');
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

// Async thunk to submit game answers
export const submitGameAnswers = createAsyncThunk(
  'game/submitAnswers',
  async (answers, { rejectWithValue }) => {
    try {
      const response = await api.post('/game/submit', { answers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit answers');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    hasCompleted: null, // null = loading, true/false = status
    questions: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCompleted: (state, action) => {
      state.hasCompleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check completion
      .addCase(checkGameCompletion.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkGameCompletion.fulfilled, (state, action) => {
        state.hasCompleted = action.payload;
        state.loading = false;
      })
      .addCase(checkGameCompletion.rejected, (state) => {
        state.hasCompleted = false;
        state.loading = false;
      })
      // Fetch questions
      .addCase(fetchGameQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
      })
      .addCase(fetchGameQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit answers
      .addCase(submitGameAnswers.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitGameAnswers.fulfilled, (state) => {
        state.submitting = false;
        state.hasCompleted = true;
      })
      .addCase(submitGameAnswers.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCompleted } = gameSlice.actions;
export default gameSlice.reducer;
