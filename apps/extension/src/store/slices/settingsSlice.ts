import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppTheme, SettingsState } from '../types';

const initialState: SettingsState = {
  baseCurrency: 'USD',
  autoLockTimeOut: 10,
  hidePortfolioBalances: false,
  openAsSidePanel: false,
  theme: 'dark',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.baseCurrency = action.payload;
    },
    setHidePortfolioBalances: (state, action: PayloadAction<boolean>) => {
      state.hidePortfolioBalances = action.payload;
    },
    resetSettings: () => initialState,
    setAutoLockTimeOut: (state, action: PayloadAction<number>) => {
      state.autoLockTimeOut = action.payload;
    },
    setOpenedAsSidePanel: (state, action: PayloadAction<boolean>) => {
      state.openAsSidePanel = action.payload;
    },
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
    },
    toggleSidePanel: (state) => {
      state.openAsSidePanel = !state.openAsSidePanel;
    },
  },
});

export const {
  setBaseCurrency,
  setHidePortfolioBalances,
  resetSettings,
  setAutoLockTimeOut,
  setOpenedAsSidePanel,
  setTheme,
  toggleSidePanel,
} = settingsSlice.actions;

export default settingsSlice.reducer;
