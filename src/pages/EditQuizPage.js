import { useLocation } from "react-router-dom";
import { selectCurrentToken, useFetchQuizQuery } from "../store";
import EditQuiz from "../components/manageQuiz/EditQuiz";
import Button from "../components/simpleComponents/Button";
import { useSelector } from "react-redux";
import QuizNotFound from "../components/errors/QuizNotFound";

function EditQuizPage() {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  const { data, isFetching, isError, error } = useFetchQuizQuery({
    pseudoId: location.state?.pseudoId,
    token,
  });

  let content = <EditQuiz quiz={data} isFetchingQuiz={isFetching} />;

  if (isError) {
    if (error.status === 403) {
      content = <QuizNotFound />;
    }
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

export default EditQuizPage;
