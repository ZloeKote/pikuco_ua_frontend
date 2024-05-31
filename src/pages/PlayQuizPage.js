import { useParams, useSearchParams } from "react-router-dom";
import { selectCurrentToken, useFetchQuizQuery } from "../store";
import PlayQuizLayout from "../components/PlayQuizLayout";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import QuizNotFound from "../components/errors/QuizNotFound";

function PlayQuizPage() {
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const token = useSelector(selectCurrentToken);
  const {
    data: fetchedQuizData,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useFetchQuizQuery({ pseudoId, token });
  const language = searchParams.get("lang");

  let quiz = null;
  if (isSuccess) {
    if (language === null) {
      if (fetchedQuizData.translations?.some((tr) => tr.language === "uk")) {
        const quizTranslationUk = fetchedQuizData.translations.find((tr) => tr.language === "uk");
        quiz = { ...quizTranslationUk, pseudoId: fetchedQuizData.pseudoId, type: fetchedQuizData.type };
      } else quiz = fetchedQuizData;
    } else if (language !== fetchedQuizData.language && !!fetchedQuizData.translations) {
      const quizTranslation = fetchedQuizData.translations.find((tr) => tr.language === language);
      if (!!quizTranslation)
        quiz = { ...quizTranslation, pseudoId: fetchedQuizData.pseudoId, type: fetchedQuizData.type };
      else if (fetchedQuizData.translations.some((tr) => tr.language === "uk")) {
        const quizTranslationUk = fetchedQuizData.translations.find((tr) => tr.language === "uk");
        quiz = { ...quizTranslationUk, pseudoId: fetchedQuizData.pseudoId, type: fetchedQuizData.type };
      } else quiz = fetchedQuizData;
    } else quiz = fetchedQuizData;
  }
  if (isError) {
    if (error.status === 403) {
      return <QuizNotFound />;
    }
  }
  return <>{isLoading ? <LinearProgress /> : <PlayQuizLayout quiz={quiz} />}</>;
}

export default PlayQuizPage;
