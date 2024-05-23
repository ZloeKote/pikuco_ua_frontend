import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const wishlistApi = createApi({
  reducerPath: "wishlist",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9091/api/v1/wishlists",
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      addQuizToWishlist: builder.mutation({
        query: ({ pseudoId, token }) => {
          return {
            url: `/quizzes/${pseudoId}/user`,
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      deleteQuizFromWishlist: builder.mutation({
        query: ({ pseudoId, token }) => {
          return {
            url: `/quizzes/${pseudoId}/user`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      checkIsInWishlist: builder.query({
        query: ({ pseudoId, token }) => {
          return {
            url: `/quizzes/${pseudoId}/user`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
    };
  },
});

export const {
  useAddQuizToWishlistMutation,
  useDeleteQuizFromWishlistMutation,
  useCheckIsInWishlistQuery,
  useLazyCheckIsInWishlistQuery,
} = wishlistApi;
export { wishlistApi };
