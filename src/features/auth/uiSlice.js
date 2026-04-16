import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { activePage: 'overview' },
  reducers: {
    setPage: (state, action) => { state.activePage = action.payload }
  }
})

export const { setPage } = uiSlice.actions
export const selectPage = (state) => state.ui.activePage
export default uiSlice.reducer
