import { configureStore } from "@reduxjs/toolkit";
import imageEditorReducer from "./reducers/imageEditorReducer";

const store = configureStore({
  reducer: {
    imageEditor: imageEditorReducer,
  }
});

export default store;
