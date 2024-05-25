import { useState, Fragment, useContext } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Button from "../simpleComponents/Button";
import classNames from "classnames";
import GeneralInfoQuiz from "../manageQuiz/GeneralInfoQuiz";
import QuizQuestionsInfo from "../manageQuiz/QuizQuestionsInfo";
import CreatingQuizConfirmation from "../manageQuiz/CreatingQuizConfirmation";
import { iso6393 } from "iso-639-3";
import { selectCurrentToken, useEditQuizTranslationMutation } from "../../store";
import { useSelector } from "react-redux";
import SnackbarsContext from "../../context/snackbars";
import { CircularProgress } from "@mui/material";
import Link from "../simpleComponents/Link";
import { ROUTES } from "../../ROUTES";

function EditQuizTranslation({ quiz, translationLanguage }) {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const token = useSelector(selectCurrentToken);
  const [title, setTitle] = useState(
    quiz.translations?.find((tr) => tr.language === translationLanguage).title
  );
  const [description, setDescription] = useState(
    quiz.translations?.find((tr) => tr.language === translationLanguage).description
  );
  const language = iso6393.find(
    (lang) => lang.iso6391 === quiz.translations?.find((tr) => tr.language === translationLanguage).language
  );
  const [questions, setQuestions] = useState(
    quiz.translations?.find((tr) => tr.language === translationLanguage).questions
  );
  const [activeStep, setActiveStep] = useState(0);

  const [editTranslation, result] = useEditQuizTranslationMutation();

  const handleNext = (e) => {
    e?.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleChangeTitle = (title) => setTitle(title);
  const handleChangeDescription = (description) => setDescription(description);
  const handleChangeQuestion = (question, numQuestion) => {
    let changedQuestions = [...questions];
    changedQuestions[numQuestion] = question;
    setQuestions(changedQuestions);
  };

  const handleClickEditTranslation = () => {
    if (title === "") {
      handleEnqueueSnackbar("Поле назви не може бути пустим!", "error", false);
      return;
    } else if (description === "") {
      handleEnqueueSnackbar("Поле опису вікторини не може бути пустим!", "error", false);
      return;
    } else if (language === null) {
      handleEnqueueSnackbar("Поле мови вікторини не може бути пустим!", "error", false);
      return;
    }

    editTranslation({
      translation: {
        title: title,
        description: description,
        language: language.iso6391,
        questions: questions,
      },
      pseudoId: quiz.pseudoId,
      token: token,
    });
  };

  const steps = [
    {
      label: "Заповнення загальної інформації",
      element: (
        <GeneralInfoQuiz
          title={title}
          originalTitle={quiz.title}
          onChangeTitle={handleChangeTitle}
          description={description}
          originalDescription={quiz.description}
          onChangeDescription={handleChangeDescription}
          quizType={quiz.type}
          readOnlyQuizType
          language={language}
          readOnlyLanguage
          numQuestions={quiz.numQuestions}
          readOnlyNumQuestions
        />
      ),
    },
    {
      label: "Заповнення інформації про питання",
      element: (
        <QuizQuestionsInfo
          questions={questions}
          originalQuestions={quiz.questions}
          questionType={quiz.type}
          readOnlyUrl
          onChange={handleChangeQuestion}
        />
      ),
    },
    {
      label: "Підтвердження та редагування",
      element: (
        <CreatingQuizConfirmation
          title={title}
          description={description}
          quizType={quiz.type}
          language={language.name}
          numQuestions={quiz.numQuestions}
          questions={questions}
        />
      ),
    },
  ];

  const isLastStep = activeStep === steps.length - 1;

  const classnameLayout = classNames(
    "bg-[--dark-quizcard-background]",
    "flex",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "w-[75rem] h-[90%] text-[20px]"
  );
  const buttonClassname = classNames("w-[150px] h-[50px] rounded-xl leading-none");

  const content = steps[activeStep]?.element;

  let lastContent = null;
  if (result.isLoading) {
    lastContent = (
      <>
        <span>Переклад редагується. Будь ласка, зачекайте...</span>
        <CircularProgress />
      </>
    );
  } else if (result.isSuccess) {
    lastContent = (
      <>
        <span>Переклад успішно змінено!</span>
        <div className="flex gap-4">
          <Button className={buttonClassname} primary>
            <Link to={ROUTES.Main}>Головна сторінка</Link>
          </Button>
          <Button className={buttonClassname} primary>
            <Link to={ROUTES.Quiz(quiz.pseudoId)}>Сторінка вікторини</Link>
          </Button>
        </div>
      </>
    );
  } else if (result.isError) {
    lastContent = (
      <>
        <span>На жаль, сталася помилка при редагуванні перекладу!</span>
        <span>Деталі помилки {result.error.status}:</span>
        <p>{result.error.data}</p>
        <Button className={buttonClassname} warning onClick={handleBack}>
          Повернутися
        </Button>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", marginTop: 4, gap: 2, flexDirection: "column", alignItems: "center" }}>
      <Stepper activeStep={activeStep} sx={{ width: "80rem" }}>
        {steps.map((step) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={step.label} {...stepProps}>
              <StepLabel {...labelProps}>
                <Typography>{step.label}</Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <div className="flex flex-col gap-4 text-[22px] items-center max-w-[1200px]">{lastContent}</div>
      ) : (
        <Fragment>
          <div className={classnameLayout}>
            <div className="w-full">
              <form className="h-full flex flex-col justify-between" onSubmit={handleNext}>
                {content}
                <div className="w-full flex justify-between mb-2">
                  <div>
                    <Button
                      className={buttonClassname + " ml-2"}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      warning
                      type="button"
                    >
                      Назад
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {isLastStep ? (
                      <Button
                        className={buttonClassname + " mr-2"}
                        onClick={handleClickEditTranslation}
                        success
                      >
                        Редагувати
                      </Button>
                    ) : (
                      <Button className={buttonClassname + " mr-2"} primary>
                        Далі
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Box>
  );
}

export default EditQuizTranslation;
