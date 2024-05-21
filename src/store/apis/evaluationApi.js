import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const evaluationApi = createApi({
  reducerPath: "evaluation",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9091/api/v1/evaluations",
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      fetchEvaluationQuiz: builder.query({
        query: ({ pseudoId, token }) => {
          return {
            url: `/quizzes/${pseudoId}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      addEvaluationQuiz: builder.mutation({
        query: ({ isLiked, pseudoId, token }) => {
          return {
            url: `/quizzes/${pseudoId}`,
            method: "POST",
            body: { isLiked: isLiked },
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      deleteEvaluationQuiz: builder.mutation({
        query: ({ pseudoId, token }) => {
          return {
            url: `/quizzes/${pseudoId}`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
    };
  },
});

export const { useFetchEvaluationQuizQuery, useLazyFetchEvaluationQuizQuery, useAddEvaluationQuizMutation, useDeleteEvaluationQuizMutation } =
  evaluationApi;
export { evaluationApi };
