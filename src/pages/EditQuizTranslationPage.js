import { useLocation } from "react-router-dom";
import { selectCurrentToken, useFetchQuizQuery } from "../store";
import { LinearProgress } from "@mui/material";
import Button from "../components/simpleComponents/Button";
import EditQuizTranslation from "../components/manageQuiz/EditQuizTranslation";
import { useSelector } from "react-redux";
import QuizNotFound from "../components/errors/QuizNotFound";

function EditQuizTranslationPage() {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  const { data, isSuccess, isError, error } = useFetchQuizQuery({
    pseudoId: location.state?.pseudoId,
    token,
    param: `?lang=${location.state?.language}`
  });

  let content = <LinearProgress />;

  if (isSuccess) {
    content = <EditQuizTranslation quiz={data} translationLanguage={location.state?.language} />;
  } else if (isError) {
    if (error.status === 403) {
      return <QuizNotFound />;
    }
    content = (
      <div className="flex flex-col gap-2">
        <p>Ой! Сталася помилка при завантаженні вікторини для редагування</p>
        <p>Деталі помилки {error.status}:</p>
        <p>{error.data}</p>
        <div className="flex gap-4">
          <Button primary>Повторити спробу</Button>
          <Button secondary>Повернутися назад</Button>
        </div>
      </div>
    );
  }

  return content;
}

export default EditQuizTranslationPage;
