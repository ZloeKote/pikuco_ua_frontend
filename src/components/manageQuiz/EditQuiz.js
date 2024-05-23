import { useState, Fragment, useEffect, useContext } from "react";
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
import { selectCurrentToken, useCreateQuizAsRoughDraftMutation, useCreateQuizMutation } from "../../store";
import { useSelector } from "react-redux";
import SnackbarsContext from "../../context/snackbars";
import { CircularProgress } from "@mui/material";
import Link from "../simpleComponents/Link";
import { ROUTES } from "../../ROUTES";

function EditQuiz({ quiz }) {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const token = useSelector(selectCurrentToken);
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [quizType, setQuizType] = useState(quiz.type);
  const [language, setLanguage] = useState(iso6393.find((lang) => lang.iso6391 === quiz.language));
  const [numQuestions, setNumQuestions] = useState(quiz.numQuestions);
  const [questions, setQuestions] = useState(quiz.questions);
  const [pseudoId, setPseudoId] = useState(quiz.pseudoId);
  const [activeStep, setActiveStep] = useState(0);

  const [createQuiz, result] = useCreateQuizMutation();
  const [createQuizAsRoughDraft, resultRoughDraft] = useCreateQuizAsRoughDraftMutation();

  const handleNext = (e) => {
    e?.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleChangeQuizType = (quizType) => setQuizType(quizType);
  const handleChangeLanguage = (lang) => setLanguage(lang);
  const handleChangeNumQuestions = (numQuestions) => {
    setNumQuestions(numQuestions);

    const emptyQuestion = { url: "", title: "", description: "" };
    let emptyQuestions = [];
    for (let i = 0; i < numQuestions; i++) emptyQuestions.push(emptyQuestion);

    setQuestions(emptyQuestions);
  };
  const handleChangeTitle = (title) => setTitle(title);
  const handleChangeDescription = (description) => setDescription(description);
  const handleChangeQuestion = (question, numQuestion) => {
    let changedQuestions = [...questions];
    changedQuestions[numQuestion] = question;
    setQuestions(changedQuestions);
  };

  const handleClickCreateQuiz = () => {
    createQuiz({
      generalInfo: {
        title: title,
        description: description,
        quizType: quizType,
        pseudoId: pseudoId,
        language: language,
      },
      questions: questions,
      token: token,
    });
  };

  useEffect(() => {
    if (resultRoughDraft.isSuccess) {
      handleEnqueueSnackbar("Чернетка успішно збережена!", "success", false);
      setPseudoId(resultRoughDraft.data);
      resultRoughDraft.reset();
    }
    if (result.isSuccess) setPseudoId(result.data);
  }, [resultRoughDraft, result, handleEnqueueSnackbar]);

  const handleClickSaveRoughDraft = () => {
    if (!quiz.isRoughDraft) {
      handleEnqueueSnackbar("Ви не можете зберігати чернетку вже опублікованого турніру", "error", false);
      return;
    }

    if (title === "") {
      handleEnqueueSnackbar("Поле назви не може бути пустим!", "error", false);
      return;
    } else if (description === "") {
      handleEnqueueSnackbar("Поле опису вікторини не може бути пустим!", "error", false);
      return;
    } else if (quizType === "") {
      handleEnqueueSnackbar("Поле типу вікторини не може бути пустим!", "error", false);
      return;
    } else if (language === null) {
      handleEnqueueSnackbar("Поле мови вікторини не може бути пустим!", "error", false);
      return;
    } else if (numQuestions === "") {
      handleEnqueueSnackbar("Поле кількості питань вікторини не може бути пустим!", "error", false);
      return;
    }

    createQuizAsRoughDraft({
      generalInfo: {
        title: title,
        description: description,
        quizType: quizType,
        pseudoId: pseudoId,
        isRoughDraft: quiz.isRoughDraft,
        language: language,
      },
      questions: questions,
      token: token,
    });
  };

  const steps = [
    {
      label: "Заповнення загальної інформації",
      element: (
        <GeneralInfoQuiz
          title={title}
          onChangeTitle={handleChangeTitle}
          description={description}
          onChangeDescription={handleChangeDescription}
          quizType={quizType}
          onChangeQuizType={handleChangeQuizType}
          language={language}
          onChangeLanguage={handleChangeLanguage}
          numQuestions={numQuestions}
          onChangeNumQuestions={handleChangeNumQuestions}
        />
      ),
    },
    {
      label: "Заповнення інформації про питання",
      element: (
        <QuizQuestionsInfo questions={questions} questionType={quizType} onChange={handleChangeQuestion} />
      ),
    },
    {
      label: "Підтвердження та редагування",
      element: (
        <CreatingQuizConfirmation
          title={title}
          description={description}
          quizType={quizType}
          language={language.name}
          numQuestions={numQuestions}
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
    "w-[75rem] h-full text-[20px]"
  );
  const buttonClassname = classNames("w-[150px] h-[50px] rounded-xl leading-none");

  const content = steps[activeStep]?.element;

  let lastContent = null;
  if (result.isLoading) {
    lastContent = (
      <>
        <span>Вікторина редагується. Будь ласка, зачекайте...</span>
        <CircularProgress />
      </>
    );
  } else if (result.isSuccess) {
    lastContent = (
      <>
        <span>Вікторина успішно відредагована!</span>
        <div className="flex gap-4">
          <Button className={buttonClassname} primary>
            <Link to={ROUTES.Main}>Головна сторінка</Link>
          </Button>
          <Button className={buttonClassname} primary>
            <Link to={ROUTES.Quiz(pseudoId)}>Сторінка вікторини</Link>
          </Button>
        </div>
      </>
    );
  } else if (result.isError) {
    lastContent = (
      <>
        <span>На жаль, сталася помилка при редагуванні вікторини!</span>
        <span>Деталі помилки {result.error.status}:</span>
        <p>{result.error.message}</p>
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
                    {quiz.isRoughDraft && (
                      <Button
                        className={buttonClassname}
                        type="button"
                        secondary
                        onClick={handleClickSaveRoughDraft}
                      >
                        Зберегти як чернетку
                      </Button>
                    )}
                    {isLastStep ? (
                      <Button className={buttonClassname + " mr-2"} onClick={handleClickCreateQuiz} success>
                        Відредагувати
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

export default EditQuiz;
