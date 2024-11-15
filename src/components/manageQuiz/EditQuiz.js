import { useState, Fragment, useEffect, useContext } from "react";
import classNames from "classnames";
import GeneralInfoQuiz from "../manageQuiz/GeneralInfoQuiz";
import QuizQuestionsInfo from "../manageQuiz/QuizQuestionsInfo";
import CreatingQuizConfirmation from "../manageQuiz/CreatingQuizConfirmation";
import { iso6393 } from "iso-639-3";
import { selectCurrentToken, useCreateQuizAsRoughDraftMutation, useCreateQuizMutation } from "../../store";
import { useSelector } from "react-redux";
import SnackbarsContext from "../../context/snackbars";
import { CircularProgress, Button, Box, Stepper, Step, StepLabel, Typography, Skeleton } from "@mui/material";
import Link from "../simpleComponents/Link";
import { ROUTES } from "../../ROUTES";
import { createCover, getYtThumbnail } from "../../hooks/yt-hooks";
import thumbnailQualities from "../../predefined/ytThumbnailQualities";
import { validateQuizDescription, validateQuizTitle } from "../../hooks/validate-hooks";
import { LoadingButton } from "@mui/lab";
import { RiDraftFill, RiSave3Fill } from "react-icons/ri";

function EditQuiz({ quiz, isFetchingQuiz }) {
  const { handleEnqueueSnackbar } = useContext(SnackbarsContext);
  const token = useSelector(selectCurrentToken);
  const [title, setTitle] = useState(quiz?.title);
  const [description, setDescription] = useState(quiz?.description);
  const [quizType, setQuizType] = useState(quiz?.type);
  const [language, setLanguage] = useState(
    quiz?.language === undefined ? "" : iso6393.find((lang) => lang.iso6391 === quiz?.language)
  );
  const [numQuestions, setNumQuestions] = useState(quiz?.numQuestions);
  const [questions, setQuestions] = useState(quiz?.questions);
  const [pseudoId, setPseudoId] = useState(quiz?.pseudoId);
  const [activeStep, setActiveStep] = useState(0);
  const [isTitleError, setIsTitleError] = useState(false);
  const [titleErrorMsg, setTitleErrorMsg] = useState("");
  const [isDescrError, setIsDescrError] = useState(false);
  const [descrErrorMsg, setDescrErrorMsg] = useState("");
  const [isLoadingCreatingCover, setIsLoadingCreatingCover] = useState(false);

  const [createQuiz, result] = useCreateQuizMutation();
  const [createQuizAsRoughDraft, resultRoughDraft] = useCreateQuizAsRoughDraftMutation();

  useEffect(() => {
    setTitle(quiz?.title);
    setDescription(quiz?.description);
    setQuizType(quiz?.type);
    setLanguage(iso6393.find((lang) => lang.iso6391 === quiz?.language));
    setNumQuestions(quiz?.numQuestions);
    setQuestions(quiz?.questions);
    setPseudoId(quiz?.pseudoId);
  }, [quiz]);
  useEffect(() => {
    if (questions?.length !== numQuestions) {
      let allQuestions = [...questions];
      for (let i = 0; i < numQuestions - questions?.length; i++) {
        allQuestions.push({ url: "", title: "", description: "" });
      }
      setQuestions(allQuestions);
    }
  }, [numQuestions, questions]);
  useEffect(() => {
    if (resultRoughDraft.isSuccess) {
      handleEnqueueSnackbar("Чернетка успішно збережена!", "success", false);
      setPseudoId(resultRoughDraft.data);
      resultRoughDraft.reset();
    }
    if (result.isSuccess) setPseudoId(result.data);
  }, [resultRoughDraft, result, handleEnqueueSnackbar]);

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

  const handleClickSaveRoughDraft = () => {
    if (!quiz.isRoughDraft) {
      handleEnqueueSnackbar("Ви не можете зберігати чернетку вже опублікованого турніру", "error", false);
      return;
    }
    const validQuizTitle = validateQuizTitle(title, setIsTitleError, setTitleErrorMsg);
    const validQuizDescr = validateQuizDescription(description, setIsDescrError, setDescrErrorMsg, false);
    if (!validQuizTitle || !validQuizDescr) {
      setActiveStep(0);
      return;
    }

    if (quizType === "") {
      handleEnqueueSnackbar("Поле типу вікторини не може бути пустим!", "error");
      return;
    } else if (language === null) {
      handleEnqueueSnackbar("Поле мови вікторини не може бути пустим!", "error");
      return;
    } else if (numQuestions === "") {
      handleEnqueueSnackbar("Поле кількості питань вікторини не може бути пустим!", "error");
      return;
    }
    // add cover to quiz if at least 2 questions are exist
    const actualNumQuestions = questions.filter(
      (question) => question.url !== "" || question.title !== ""
    ).length;
    if (actualNumQuestions >= 2) {
      const firstRandomIndex = Math.floor(Math.random() * actualNumQuestions);
      let secondRandomIndex;
      while (true) {
        secondRandomIndex = Math.floor(Math.random() * actualNumQuestions);
        if (secondRandomIndex !== firstRandomIndex) break;
      }
      createCover(
        getYtThumbnail(questions.at(firstRandomIndex).url, thumbnailQualities.high),
        getYtThumbnail(questions.at(secondRandomIndex).url, thumbnailQualities.high)
      ).then((dataUrl) => {
        createQuizAsRoughDraft({
          generalInfo: {
            title: title,
            description: description,
            quizType: quizType,
            pseudoId: pseudoId,
            language: language,
            numQuestions: numQuestions,
            cover: dataUrl,
          },
          questions: questions,
          token: token,
        })
          .unwrap()
          .catch((error) => {
            if (error.status === 400) {
              for (let i = 0; i < error.data.length; i++) {
                handleEnqueueSnackbar(error.data[i], "error");
              }
            } else if (error.status === 401 || error.status === 500) {
              handleEnqueueSnackbar(error.data.error, "error");
            } else if (error.originalStatus) {
              handleEnqueueSnackbar(error.data, "error");
            } else {
              handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data.error}`, "error");
            }
          });
      });
    } else {
      createQuizAsRoughDraft({
        generalInfo: {
          title: title,
          description: description,
          quizType: quizType,
          pseudoId: pseudoId,
          language: language,
          numQuestions: numQuestions,
        },
        questions: questions,
        token: token,
      })
        .unwrap()
        .catch((error) => {
          if (error.status === 400) {
            for (let i = 0; i < error.data.length; i++) {
              handleEnqueueSnackbar(error.data[i], "error");
            }
          } else if (error.status === 401 || error.status === 500) {
            handleEnqueueSnackbar(error.data.error, "error");
          } else if (error.originalStatus) {
            handleEnqueueSnackbar(error.data, "error");
          } else {
            handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data.error}`, "error");
          }
        });
    }
  };

  const handleClickCreateQuiz = () => {
    const validQuizTitle = validateQuizTitle(title, setIsTitleError, setTitleErrorMsg);
    const validQuizDescr = validateQuizDescription(description, setIsDescrError, setDescrErrorMsg);
    if (!validQuizTitle || !validQuizDescr) {
      setActiveStep(0);
      return;
    }
    if (quizType === "") {
      handleEnqueueSnackbar("Поле типу вікторини не може бути пустим!", "error");
      return;
    } else if (language === null) {
      handleEnqueueSnackbar("Поле мови вікторини не може бути пустим!", "error");
      return;
    } else if (numQuestions === "") {
      handleEnqueueSnackbar("Поле кількості питань вікторини не може бути пустим!", "error");
      return;
    }
    const actualNumQuestions = questions.filter(
      (question) => question.url !== "" || question.title !== ""
    ).length;
    if (actualNumQuestions === numQuestions) {
      const firstRandomIndex = Math.floor(Math.random() * actualNumQuestions);
      let secondRandomIndex;
      while (true) {
        secondRandomIndex = Math.floor(Math.random() * actualNumQuestions);
        if (secondRandomIndex !== firstRandomIndex) break;
      }
      setIsLoadingCreatingCover(true);
      createCover(
        getYtThumbnail(questions.at(firstRandomIndex).url, thumbnailQualities.high),
        getYtThumbnail(questions.at(secondRandomIndex).url, thumbnailQualities.high)
      ).then((dataUrl) => {
        setIsLoadingCreatingCover(false);
        createQuiz({
          generalInfo: {
            title: title,
            description: description,
            quizType: quizType,
            pseudoId: pseudoId,
            language: language,
            numQuestions: numQuestions,
            cover: dataUrl,
          },
          questions: questions,
          token: token,
        })
          .unwrap()
          .catch((error) => {
            if (error.status === 400) {
              for (let i = 0; i < error.data.length; i++) {
                handleEnqueueSnackbar(error.data[i], "error");
              }
            } else if (error.status === 401 || error.status === 500) {
              handleEnqueueSnackbar(error.data.error, "error");
            } else if (error.originalStatus) {
              handleEnqueueSnackbar(error.data, "error");
            } else {
              handleEnqueueSnackbar(`Сталася непередбачувана помилка :( ${error.data.error}`, "error");
            }
          });
        setActiveStep(activeStep + 1);
      });
    } else {
      handleEnqueueSnackbar("Для створення вікторини потрібно заповнити всі питання", "error");
    }
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
          isTitleError={isTitleError}
          setIsTitleError={setIsTitleError}
          titleErrorMsg={titleErrorMsg}
          setTitleErrorMsg={setTitleErrorMsg}
          isDescrError={isDescrError}
          setIsDescrError={setIsDescrError}
          descrErrorMsg={descrErrorMsg}
          setDescrErrorMsg={setDescrErrorMsg}
          isFetchingQuiz={isFetchingQuiz}
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
          language={language?.name}
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
    "w-[75rem] h-[90%] text-[20px]"
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
          <Button className={buttonClassname} color="primary" variant="contained">
            <Link to={ROUTES.Main}>Головна сторінка</Link>
          </Button>
          <Button className={buttonClassname} color="primary" variant="contained">
            <Link to={ROUTES.Quiz(pseudoId)}>Сторінка вікторини</Link>
          </Button>
        </div>
      </>
    );
  } else if (result.isError) {
    lastContent = (
      <>
        <span>На жаль, сталася помилка при редагуванні вікторини!</span>
        <span>Деталі помилки {result.originalStatus || result.error.status}:</span>
        <p>{result.originalStatus ? result.error.data : result.error.data[0]}</p>
        <Button className={buttonClassname} color="warning" variant="contained" onClick={handleBack}>
          Повернутися
        </Button>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", marginY: 2, gap: 2, flexDirection: "column", alignItems: "center" }}>
      <div className="text-[32px] leading-none">РЕДАГУВАННЯ ВІКТОРИНИ</div>
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
                    <LoadingButton
                      loading={isFetchingQuiz}
                      className={buttonClassname}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      color="warning"
                      variant="contained"
                      type="button"
                    >
                      Назад
                    </LoadingButton>
                  </div>
                  <div className="flex gap-2 mr-2">
                    {isFetchingQuiz ? (
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        height="100%"
                        width={240}
                        sx={{ borderRadius: 1 }}
                      />
                    ) : (
                      quiz?.isRoughDraft && (
                        <LoadingButton
                          className={"w-[240px] " + buttonClassname}
                          loading={resultRoughDraft.isLoading}
                          loadingPosition="start"
                          startIcon={<RiDraftFill />}
                          color="secondary"
                          variant="contained"
                          onClick={handleClickSaveRoughDraft}
                        >
                          <span>Зберегти як чернетку</span>
                        </LoadingButton>
                      )
                    )}
                    {isLastStep ? (
                      <LoadingButton
                        loading={isLoadingCreatingCover}
                        loadingPosition="start"
                        startIcon={<RiSave3Fill />}
                        className={"w-[200px] " + buttonClassname}
                        onClick={handleClickCreateQuiz}
                        color="success"
                        variant="contained"
                      >
                        <span>Відредагувати</span>
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        loading={isFetchingQuiz}
                        className={buttonClassname}
                        type="submit"
                        color="primary"
                        variant="contained"
                      >
                        Далі
                      </LoadingButton>
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
