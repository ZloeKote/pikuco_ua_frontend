import { useLocation } from "react-router-dom";
import { selectCurrentToken, useFetchQuizQuery } from "../store";
import Button from "../components/simpleComponents/Button";
import CreateQuizTranslation from "../components/manageQuiz/CreateQuizTranslation";
import { useSelector } from "react-redux";
import QuizNotFound from "../components/errors/QuizNotFound";
import NotAuthorized from "../components/errors/NotAuthorized";

function CreateQuizTranslationPage() {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  const { data, isFetching, isError, error } = useFetchQuizQuery({
    pseudoId: location.state?.pseudoId,
    token,
  });

  let content = <CreateQuizTranslation quiz={data} isFetchingQuiz={isFetching} />;

  if (isError) {
    if (error.status === 401) return <NotAuthorized />;
    else if (error.status === 404) return <QuizNotFound />;

    content = (
      <div className="flex flex-col gap-2">
        <p>Ой! Сталася помилка при завантаженні вікторини для редагування</p>
        <p>Деталі помилки {error.status}:</p>
        <p>{error.message}</p>
        <div className="flex gap-4">
          <Button primary>Повторити спробу</Button>
          <Button secondary>Повернутися назад</Button>
        </div>
      </div>
    );
  }

  return content;
}

export default CreateQuizTranslationPage;
