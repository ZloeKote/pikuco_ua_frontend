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
      createQuiz: builder.mutation({
        query: ({ generalInfo, questions, token }) => {
          return {
            method: "POST",
            body: {
              title: generalInfo.title,
              description: generalInfo.description,
              type: generalInfo.quizType,
              questions: questions.filter((question) => question.url !== "" || question.title !== ""),
              pseudoId: generalInfo.pseudoId,
              isRoughDraft: false,
              language: generalInfo.language.iso6391,
              numQuestions: generalInfo.numQuestions,
              cover: generalInfo.cover
            },
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      createQuizAsRoughDraft: builder.mutation({
        query: ({ generalInfo, questions, token }) => {
          return {
            url: "",
            method: "POST",
            body: {
              title: generalInfo.title,
              description: generalInfo.description,
              type: generalInfo.quizType,
              questions: questions.filter((question) => question.url !== "" || question.title !== ""),
              pseudoId: generalInfo.pseudoId,
              isRoughDraft: true,
              language: generalInfo.language.iso6391,
              numQuestions: generalInfo.numQuestions,
              cover: generalInfo.cover,
            },
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      updateQuiz: builder.mutation({
        query: ({ generalInfo, questions, token }) => {
          return {
            url: `/${generalInfo.pseudoId}`,
            method: "PUT",
            body: {
              title: generalInfo.title,
              description: generalInfo.description,
              type: generalInfo.quizType,
              questions: questions.filter((question) => question.url !== "" || question.title !== ""),
              pseudoId: generalInfo.pseudoId,
              isRoughDraft: generalInfo.isRoughDraft,
              language: generalInfo.language.iso6391,
              numQuestions: generalInfo.numQuestions,
            },
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      deleteQuiz: builder.mutation({
        query: ({ pseudoId, token }) => {
          return {
            url: `/${pseudoId}`,
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      addQuizTranslation: builder.mutation({
        query: ({ translation, pseudoId, token }) => {
          return {
            url: `/${pseudoId}/translations`,
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: {
              title: translation.title,
              description: translation.description,
              language: translation.language,
              questions: translation.questions,
            },
          };
        },
      }),
      editQuizTranslation: builder.mutation({
        query: ({ translation, pseudoId, token }) => {
          return {
            url: `/${pseudoId}/translations/${translation.language}`,
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: {
              title: translation.title,
              description: translation.description,
              language: translation.language,
              questions: translation.questions,
            },
          };
        },
      }),
      fetchQuizzes: builder.query({
        query: (param) => {
          return {
            url: `/search${param !== undefined ? param : ""}`,
            method: "GET",
          };
        },
      }),
      fetchQuiz: builder.query({
        query: ({pseudoId, token}) => {
          return {
            url: `/${pseudoId}`,
            method: "GET",
            headers: { Authorization: !!token ? `Bearer ${token}` : "" },
          };
        },
      }),
      fetchPopularQuizzes: builder.query({
        query: (param) => {
          return {
            url: `/popular${param !== undefined ? param : ""}`,
            method: "GET",
          };
        },
      }),
      fetchQuizMain: builder.query({
        query: ({pseudoId, token}) => {
          return {
            url: `/${pseudoId}/main`,
            method: "GET",
            headers: { Authorization: !!token ? `Bearer ${token}` : "" },
          };
        },
      }),
      fetchUserCompletedQuizzes: builder.query({
        query: ({ token, param }) => {
          return {
            url: `/user${param !== undefined ? param : ""}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
      fetchUserWishlistedQuizzes: builder.query({
        query: ({ token, param }) => {
          return {
            url: `/user/wishlist${!!param ? param : ""}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          };
        },
      }),
    };
  },
});

export const {
  useFetchQuizzesQuery,
  useFetchPopularQuizzesQuery,
  useFetchQuizQuery,
  useFetchQuizMainQuery,
  useFetchUserCompletedQuizzesQuery,
  useFetchUserWishlistedQuizzesQuery,
  useCreateQuizMutation,
  useCreateQuizAsRoughDraftMutation,
  useDeleteQuizMutation,
  useAddQuizTranslationMutation,
  useEditQuizTranslationMutation,
} = quizzesApi;
export { quizzesApi };
