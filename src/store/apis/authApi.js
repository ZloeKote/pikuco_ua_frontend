import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../slices/authSlice";

// const authApi = createApi({
//   reducerPath: "auth1",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:9091/api/v1/auth",
//     credentials: 'include',
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token;
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//     fetchFn: async (...args) => {
//       return fetch(...args);
//     },
//   }),
//   endpoints(builder) {
//     return {
//       register: builder.mutation({
//         query: (newUser) => {
//           return {
//             url: "/register",
//             method: "POST",
//             body: newUser
//           };
//         },
//       }),
//     };
//   },
// });

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:9091/api/v1/auth",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.originalStatus === 403) {
    const refreshResult = await baseQuery("/refresh-token", api, extraOptions);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;

      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});

// export const { useRegisterMutation } = authApi;
// export { authApi };
