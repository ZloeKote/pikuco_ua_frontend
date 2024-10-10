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
      fetchUserPrivacyByNickname: builder.query({
        query: ({ nickname, token }) => {
          return {
            url: `/${nickname}/privacy`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      updateUserPublic: builder.mutation({
        query: ({ newNickname, newDescription, nickname, token }) => {
          return {
            url: `/${nickname}`,
            method: "PUT",
            body: { nickname: newNickname, description: newDescription },
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      updateUserPrivacy: builder.mutation({
        query: ({ newEmail, newPassword, currentPassword, nickname, token }) => {
          return {
            url: `/${nickname}/privacy`,
            method: "PUT",
            body: { email: newEmail, newPassword: newPassword, currentPassword: currentPassword },
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      deleteUser: builder.mutation({
        query: ({nickname, deleteQuizzes, token}) => {
          return {
            url: `/${nickname}`,
            params: {"delete_quizzes": deleteQuizzes},
            method: "DELETE",
            headers: {Authorization: `Bearer ${token}`}
          };
        },
      }),
    };
  },
});

export const {
  useFetchUserByNicknameQuery,
  useFetchUserPrivacyByNicknameQuery,
  useUpdateUserPublicMutation,
  useUpdateUserPrivacyMutation,
  useDeleteUserMutation,
} = usersApi;
export { usersApi };
