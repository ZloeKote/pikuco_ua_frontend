import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const quizzesApi = createApi({
  reducerPath: "quizzes",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9091/api/v1/quizzes",
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints(builder) {
    return {
      fetchQuizzes: builder.query({
        query: (param) => {
          return {
            url: `/search${param !== undefined ? param : ""}`,
            method: "GET",
          };
        },
      }),
      fetchQuiz: builder.query({
        query: (pseudoId) => {
          return {
            url: `/${pseudoId}`,
            method: "GET"
          }
        }
      })
    }
  }
});

export const { useFetchQuizzesQuery, useFetchQuizQuery } = quizzesApi;
export {quizzesApi};