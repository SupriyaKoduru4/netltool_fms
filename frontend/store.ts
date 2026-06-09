import { configureStore } from "@reduxjs/toolkit";
import { blogApi } from "./src/services/api/blogSlice";
import { usersApi } from "./src/services/api/userSlice";
import { rolePermissionRoleSlice } from "./src/services/api/rolePermissionSlice";


export const store = configureStore({
  reducer: {
    [blogApi.reducerPath]: blogApi.reducer,
    [usersApi.reducerPath]:usersApi.reducer,
    [rolePermissionRoleSlice.reducerPath]:rolePermissionRoleSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blogApi.middleware).concat(usersApi.middleware).concat(rolePermissionRoleSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;