import classNames from "classnames";
import Link from "../components/simpleComponents/Link";
import { ROUTES } from "../ROUTES";
import placeholderCover from "../img/placeholderCover.png";
import { quizTypes } from "../predefined/QuizTypes";
import { Skeleton } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function ShowQuiz({ quiz, language, isFetchingQuiz }) {
  const isDataLoaded = !isFetchingQuiz && quiz !== undefined;
  const quizType = quizTypes.find((type) => type.value === quiz?.type)?.label;

  const playButtonClassname = classNames(
    "w-[200px] h-[90px] text-[32px] flex",
    "border-green-400 bg-green-600 text-white hover:bg-green-500 rounded-full"
  );

  return (
    <>
      <div className="flex flex-col items-center text-center text-[24px]">
        <div className="mt-[10px] flex justify-center">
          {isDataLoaded ? (
            <img src={quiz?.cover || placeholderCover} alt="cover" />
          ) : (
            <Skeleton animation="wave" variant="rectangular" width={960} height={270} />
          )}
        </div>
        <div className="w-[60rem]">
          {isDataLoaded ? (
            <>
              <p className="my-[5px]">{quizType}</p>
              <p className="mb-[5px]">{quiz?.description}</p>
              <p className="mb-[15px]">{quiz?.amountQuestions} варіанти</p>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <Skeleton animation="wave" width="20%" sx={{ fontSize: "24px", marginY: "5px" }} />
              <Skeleton animation="wave" width="90%" sx={{ fontSize: "24px", marginBottom: "5px" }} />
              <Skeleton animation="wave" width="20%" sx={{ fontSize: "24px", marginBottom: "15px" }} />
            </div>
          )}
        </div>
      </div>
      {isDataLoaded ? (
        !quiz?.isRoughDraft && (
          <div className="flex justify-center mb-[20px]">
            <div className={playButtonClassname}>
              <Link
                className="w-full h-full flex justify-center items-center"
                to={ROUTES.PlayQuiz(quiz?.pseudoId) + `${!!language ? "?lang=" + language : ""}`}
              >
                Грати
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="flex justify-center mb-[20px]">
          <LoadingButton
            className="w-[200px] h-[90px]"
            loading={true}
            variant="contained"
            sx={{ borderRadius: "9999px" }}
          />
        </div>
      )}
    </>
  );
}

export default ShowQuiz;
