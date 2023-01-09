import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "../slices/users.slice";
import authReducer from "../slices/auth.slice";
import studentReducer from "../slices/studentSlice";
import quizReducer from "../slices/quizSlice";
import questionReducer from "../slices/questionSlice";

const persistConfig = {
  keyPrefix: "redux-",
  key: "root",
  storage,

  whitelist: [
    "auth",
    "user",
    "student",
    "quiz",
    "question",
  ],
};

const rootReducer = combineReducers({
  // Add your reducers here
  auth: authReducer,
  user: userReducer,
  student: studentReducer,
  quiz: quizReducer,
  question: questionReducer,
});

export { persistConfig, rootReducer };
