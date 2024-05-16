import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onRegister, onLogin, onLogout } from "../../api/auth";
import { User } from "../../interfaces/User";
import { getDocumentsData } from "../../api/docs";
import { FileData } from "../../interfaces/Document";

interface UserState {
  loading: boolean;
  user: User | null;
  isAwaitingVerification: boolean;
  isLoggedIn: boolean;
  files: FileData[];
  errors: Error[];
}

const initialState: UserState = {
  loading: false,
  user: null,
  isAwaitingVerification: false,
  isLoggedIn: false,
  files: [],
  errors: [],
};

export const registerUser = createAsyncThunk<User | any, Object>("user/registerUser", async (data, thunkAPI) => {
  try {
    const response = await onRegister(data);
    thunkAPI.dispatch(awaitValidation(true));
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const loginUser = createAsyncThunk<Object, string | Object>("user/loginUser", async (data, thunkAPI) => {
  try {
    const response = await onLogin(data);
    thunkAPI.dispatch(setUserData(response.data.user));
    thunkAPI.dispatch(authenticateUser(true));
    thunkAPI.dispatch(awaitValidation(false));
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error });
  }
});

export const getDocuments = createAsyncThunk<void>("user/getCurrentUser", async (_, thunkAPI) => {
  try {
    const response = await getDocumentsData();
    if (response.data) {
      thunkAPI.dispatch(setFilesData(response.data.data));
    } else {
      thunkAPI.dispatch(authenticateUser(false));
      return;
    }
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error });
  }
});

export const logOutUser = createAsyncThunk<void>("user/logout", async (_, thunkAPI) => {
  try {
    await onLogout();
    thunkAPI.dispatch(authenticateUser(false));
    thunkAPI.dispatch(resetUser(null));
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticateUser: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    awaitValidation: (state, action) => {
      state.isAwaitingVerification = action.payload;
    },
    setFilesData: (state, action) => {
      state.files = action.payload;
    },
    resetUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { authenticateUser, setUserData, awaitValidation, setFilesData, resetUser } = authSlice.actions;
export default authSlice.reducer;
