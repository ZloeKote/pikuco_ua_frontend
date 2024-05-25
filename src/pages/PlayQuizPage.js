import { useParams, useSearchParams } from "react-router-dom";
import { useFetchQuizQuery } from "../store";
import PlayQuizLayout from "../components/PlayQuizLayout";

function PlayQuizPage() {
  const [searchParams] = useSearchParams();
  const { pseudoId } = useParams();
  const { data: fetchedQuizData, error, isLoading, isSuccess } = useFetchQuizQuery(pseudoId);
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

  return <>{isLoading ? <div>Loading...</div> : <PlayQuizLayout quiz={quiz} />}</>;
}

export default PlayQuizPage;
