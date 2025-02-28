import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const quizResultsApi = createApi({
  reducerPath: "quizResults",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9091/api/v1/quiz-results",
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  endpoints(builder) {
    return {
      fetchQuizResults: builder.query({
        providesTags: (result, error, args) => {
          return [{ type: "quizResults" }];
        },
        query: (pseudoId) => {
          return {
            url: `/${pseudoId}`,
            method: "GET",
          };
        },
      }),
      fetchIndividualResults: builder.query({
        providesTags: (result, error, args) => {
          return [{ type: "quizIndResults" }];
        },
        query: ({pseudoId, token}) => {
          return {
            url: `/${pseudoId}/user`,
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          };
        },
      }),
      addQuizResult: builder.mutation({
        query: ({pseudoId, results, token}) => {
          console.log("results");
          console.log(results);
          return {
            url: `/${pseudoId}`,
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: {questions: results},
          }
        }
      })
    };
  },
});

export const { useFetchQuizResultsQuery, useFetchIndividualResultsQuery, useAddQuizResultMutation } = quizResultsApi;
export { quizResultsApi };
