import { useLocation } from "react-router-dom";
import { useFetchQuizQuery } from "../store";
import { LinearProgress } from "@mui/material";
import Button from "../components/simpleComponents/Button";
import EditQuizTranslation from "../components/manageQuiz/EditQuizTranslation";

function EditQuizTranslationPage() {
  const location = useLocation();

  const { data, isSuccess, isError, error } = useFetchQuizQuery(location.state?.pseudoId);

  let content = <LinearProgress />;

  if (isSuccess) {
    content = <EditQuizTranslation quiz={data} translationLanguage={location.state?.language} />;
  } else if (isError) {
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
