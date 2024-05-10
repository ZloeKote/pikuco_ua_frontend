import { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import Button from "../components/simpleComponents/Button";
import classNames from "classnames";
import GeneralInfoQuiz from "../components/manageQuiz/GeneralInfoQuiz";
import QuizQuestionsInfo from "../components/manageQuiz/QuizQuestionsInfo";
import CreatingQuizConfirmation from "../components/manageQuiz/CreatingQuizConfirmation";
import { iso6393 } from "iso-639-3";

function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizType, setQuizType] = useState("");
  const [language, setLanguage] = useState(iso6393.find((lang) => lang.iso6391 === "en"));
  const [numQuestions, setNumQuestions] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (e) => {
    e?.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleReset = () => setActiveStep(0);

  const handleChangeQuizType = (quizType) => setQuizType(quizType);
  const handleChangeLanguage = (lang) => setLanguage(lang);
  const handleChangeNumQuestions = (numQuestions) => setNumQuestions(numQuestions);
  const handleChangeTitle = (title) => setTitle(title);
  const handleChangeDescription = (description) => setDescription(description);

  const handleClickCreateQuiz = () => {
    // creating quiz
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
    { label: "Заповнення інформації про питання", element: <QuizQuestionsInfo /> },
    { label: "Підтвердження та створення", element: <CreatingQuizConfirmation /> },
  ];

  const isLastStep = activeStep === steps.length - 1;

  const classnameLayout = classNames(
    "bg-[--dark-quizcard-background]",
    "flex",
    "border border-[--dark-quizcard-border] rounded-2xl",
    "w-[75rem] h-[40rem] text-[20px]"
  );
  const buttonClassname = classNames("w-[150px] h-[50px] rounded-xl");

  const content = steps[activeStep].element;

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
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button className={buttonClassname} onClick={handleReset} danger>
              Скинути
            </Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <div className={classnameLayout}>
            <div className="w-full">
              <form className="h-full flex flex-col justify-between" onSubmit={handleNext}>
                {content}
                <div className="w-full flex justify-between mb-2">
                  <Button
                    className={buttonClassname + " ml-2"}
                    type="button"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    warning
                  >
                    Назад
                  </Button>
                  {isLastStep ? (
                    <Button
                      className={buttonClassname + " mr-2"}
                      type="button"
                      onClick={handleClickCreateQuiz}
                      success
                    >
                      Створити
                    </Button>
                  ) : (
                    <Button className={buttonClassname + " mr-2"} type="submit" primary>
                      Далі
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Box>
  );
}

export default CreateQuizPage;
