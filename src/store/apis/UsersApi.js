import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const usersApi = createApi({
  reducerPath: "users",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9091/api/v1/users",
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      fetchUserByNickname: builder.query({
        query: (nickname) => {
          return {
            url: `/${nickname}`,
            method: "GET",
          };
        },
      }),
      updateUserPublic: builder.mutation({
        query: ({newNickname, newDescription, nickname, token}) => {
          return {
            url: `/${nickname}`,
            method: "PUT",
            body: { nickname: newNickname, description: newDescription },
            headers: {Authorization: `Bearer ${token}`},
          };
        },
      }),
    };
  },
});

export const { useFetchUserByNicknameQuery, useUpdateUserPublicMutation } = usersApi;
export { usersApi };
