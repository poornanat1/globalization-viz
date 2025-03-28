import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  year: 2024,
  viewMode: 'absolute',
  isLoading: false,
  dataLoaded: false,
  activeLayer: null,
  temperatureData: null,
  textureCache: {},
  differenceCache: {}
};

export const globeSlice = createSlice({
  name: 'globe',
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTemperatureData: (state, action) => {
      state.temperatureData = action.payload;
      state.dataLoaded = true;
    },
    cacheTexture: (state, action) => {
      const { year, texture } = action.payload;
      state.textureCache[`temp_${year}`] = texture;
    },
    cacheDifference: (state, action) => {
      const { year, texture } = action.payload;
      state.differenceCache[`diff_${year}`] = texture;
    }
  }
});

export const { 
  setYear, 
  setViewMode, 
  setLoading, 
  setTemperatureData,
  cacheTexture,
  cacheDifference
} = globeSlice.actions;

export default globeSlice.reducer; 