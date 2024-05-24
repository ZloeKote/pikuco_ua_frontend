import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { quizzesApi } from "./apis/quizzesApi";
import { quizResultsApi } from "./apis/quizResultsApi";
import { apiSlice } from "./apis/authApi";
import authReducer from "./slices/authSlice";
import { usersApi } from "./apis/UsersApi";
import { evaluationApi } from "./apis/evaluationApi";
import { wishlistApi } from "./apis/wishlistApi";

export const store = configureStore({
  reducer: {
    [quizzesApi.reducerPath]: quizzesApi.reducer,
    [quizResultsApi.reducerPath]: quizResultsApi.reducer,
    [evaluationApi.reducerPath]: evaluationApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(quizzesApi.middleware)
      .concat(quizResultsApi.middleware)
      .concat(evaluationApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(apiSlice.middleware)
      .concat(usersApi.middleware);
  },
  devTools: true,
});

setupListeners(store.dispatch);

export {
  useFetchQuizzesQuery,
  useFetchPopularQuizzesQuery,
  useFetchQuizQuery,
  useFetchUserCompletedQuizzesQuery,
  useFetchUserWishlistedQuizzesQuery,
  useCreateQuizMutation,
  useCreateQuizAsRoughDraftMutation,
  useDeleteQuizMutation,
  useAddQuizTranslationMutation,
  useEditQuizTranslationMutation,
} from "./apis/quizzesApi";

export {
  useFetchQuizResultsQuery,
  useFetchIndividualResultsQuery,
  useAddQuizResultMutation,
} from "./apis/quizResultsApi";

export {
  useFetchEvaluationQuizQuery,
  useLazyFetchEvaluationQuizQuery,
  useAddEvaluationQuizMutation,
  useDeleteEvaluationQuizMutation,
} from "./apis/evaluationApi";

export {
  useAddQuizToWishlistMutation,
  useDeleteQuizFromWishlistMutation,
  useCheckIsInWishlistQuery,
  useLazyCheckIsInWishlistQuery,
} from "./apis/wishlistApi";

export {
  useLoginMutation,
  useSignupMutation,
  useRecreateTokenMutation,
  useLogoutMutation,
} from "./slices/authApiSlice";

export {
  setCredentials,
  logOut,
  selectCurrentToken,
  selectCurrentUser,
  selectCurrentAvatar,
} from "./slices/authSlice";

export {
  useFetchUserByNicknameQuery,
  useFetchUserPrivacyByNicknameQuery,
  useUpdateUserPublicMutation,
  useUpdateUserPrivacyMutation,
} from "./apis/UsersApi";
