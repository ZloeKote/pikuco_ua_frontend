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
import { validateQuizTitle, validateQuizDescription } from "../../hooks/validate-hooks";
import { RiFileEditFill } from "react-icons/ri";
import { LoadingButton } from "@mui/lab";

function EditQuizTranslation({ quiz, translationLanguage }) {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const token = useSelector(selectCurrentToken);
  const [title, setTitle] = useState(
    quiz.translations?.find((tr) => tr.language === translationLanguage).title
  );
  const [description, setDescription] = useState(
    quiz.translations?.find((tr) => tr.language === translationLanguage).description
  );
  const [questions, setQuestions] = useState(
    quiz.translations?.find((tr) => tr.language === translationLanguage).questions
  );
  const [activeStep, setActiveStep] = useState(0);
  const [isTitleError, setIsTitleError] = useState(false);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [isDescrError, setIsDescrError] = useState(false);
  const [descrErrorMsg, setDescrErrorMsg] = useState("");

  const language = iso6393.find(
    (lang) => lang.iso6391 === quiz.translations?.find((tr) => tr.language === translationLanguage).language
  );

  const [editTranslation, result] = useEditQuizTranslationMutation();

  const handleNext = (e) => {
    e?.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleChangeTitle = (title) => {
    setTitle(title);
    validateQuizTitle(title, setIsTitleError, setTitleErrorMsg);
    setActiveStep(0);
  };
  const handleChangeDescription = (description) => {
    setDescription(description);
    validateQuizDescription(description, setIsDescrError, setDescrErrorMsg, false);
    setActiveStep(0);
  };
  const handleChangeQuestion = (question, numQuestion) => {
    let changedQuestions = [...questions];
    changedQuestions[numQuestion] = question;
    setQuestions(changedQuestions);
  };

  const handleClickEditTranslation = () => {
    const validQuizTitle = validateQuizTitle(title, setIsTitleError, setTitleErrorMsg);
    const validQuizDescr = validateQuizDescription(description, setIsDescrError, setDescrErrorMsg);
    if (!validQuizTitle || !validQuizDescr) {
      setActiveStep(0);
      return;
    } else if (language === null) {
      handleEnqueueSnackbar("Поле мови вікторини не може бути пустим!", "error", false);
      return;
    }

    const actualNumQuestions = questions.filter(
      (question) => question.url !== "" || question.title !== ""
    ).length;
    if (actualNumQuestions === quiz.numQuestions) {
      setActiveStep(activeStep + 1);
      editTranslation({
        translation: {
          title: title,
          description: description,
          language: language.iso6391,
          questions: questions,
        },
        pseudoId: quiz.pseudoId,
        token: token,
      }).unwrap()
      .catch((error) => {
        console.log(error);
        if (error.status === 400) {
          for (let i = 0; i < error.data.length; i++) {
            handleEnqueueSnackbar(error.data[i], "error");
          }
        } else if (error.status === 401 || error.status === 500) {
          handleEnqueueSnackbar(error.data.error, "error");
        } else if (error.originalStatus) {
          handleEnqueueSnackbar(error.data, "error");
        } else {
          handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data?.error}`, "error");
        }
      });;
    }
  };

  const steps = [
    {
      label: "Заповнення загальної інформації",
      element: (
        <GeneralInfoQuiz
          title={title}
          descriptionRequired
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
          isTitleError={isTitleError}
          titleErrorMsg={titleErrorMsg}
          isDescrError={isDescrError}
          descrErrorMsg={descrErrorMsg}
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
          <Button className={buttonClassname} color="primary" variant="contained">
            <Link to={ROUTES.Main}>Головна сторінка</Link>
          </Button>
          <Button className={buttonClassname} color="primary" variant="contained">
            <Link to={ROUTES.Quiz(quiz.pseudoId)}>Сторінка вікторини</Link>
          </Button>
        </div>
      </>
    );
  } else if (result.isError) {
    lastContent = (
      <>
        <span>На жаль, сталася помилка при редагуванні перекладу!</span>
        <span>Деталі помилки {result.error.originalStatus || result.error.error.status}:</span>
        <p>{result.originalStatus ? result.error.data : result.error.data[0]}</p>
        <Button className={buttonClassname} color="warning" variant="contained" onClick={handleBack}>
          Повернутися
        </Button>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", marginY: 2, gap: 2, flexDirection: "column", alignItems: "center" }}>
      <div className="text-[32px] leading-none">РЕДАГУВАННЯ ПЕРЕКЛАДУ ВІКТОРИНИ</div>
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
                  <div className="ml-2">
                    <Button
                      className={buttonClassname}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      color="warning"
                      variant="contained"
                      type="button"
                    >
                      Назад
                    </Button>
                  </div>
                  <div className="flex gap-2 mr-2">
                    {isLastStep ? (
                      <LoadingButton
                        startIcon={<RiFileEditFill />}
                        className={buttonClassname}
                        onClick={handleClickEditTranslation}
                        color="success"
                        variant="contained"
                      >
                        <span>Редагувати</span>
                      </LoadingButton>
                    ) : (
                      <Button className={buttonClassname} type="submit" color="primary" variant="contained">
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
