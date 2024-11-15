import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiRewind, FiRotateCcw } from "react-icons/fi";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useAddQuizResultMutation, selectCurrentToken } from "../store";
import { ROUTES } from "../ROUTES";
import QuizDuoBattle from "../components/QuizDuoBattle";
import { Skeleton } from "@mui/material";

function PlayQuizLayout({ quiz, isFetchingQuiz }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useSelector(selectCurrentToken);
  const [questionList, setQuestionList] = useState({
    curr: Array.from(new Array(4)),
    next: [],
    excluded: [],
    round: 1,
    stage: 1,
    place: 0,
  });
  let amountRounds = Math.floor(quiz?.questions.length / Math.pow(2, questionList.stage));
  const amountStages = Math.round(Math.pow(quiz?.questions.length, 0.5));
  const isDataLoaded = !isFetchingQuiz && quiz !== undefined;

  const [isCompleted, setIsCompleted] = useState(false);
  const [addResult] = useAddQuizResultMutation();

  useEffect(() => {
    if (isDataLoaded) {
      setQuestionList({
        curr: shuffle(quiz?.questions),
        next: [],
        excluded: [],
        round: 1,
        stage: 1,
        place: quiz?.questions.length,
      });
    }
  }, [isDataLoaded, quiz?.questions]);
  useEffect(() => {
    const addQuizResult = async () => {
      if (token) {
        const pseudoId = quiz.pseudoId;
        const questionsToAdd = [...questionList.excluded];
        await addResult({ pseudoId: pseudoId, results: questionsToAdd, token: token });
      }
      setIsCompleted(true);
    };

    if (!questionList.curr.length && isDataLoaded) {
      addQuizResult();
    }
  }, [questionList, navigate, quiz?.pseudoId, addResult, token, isDataLoaded]);

  if (isCompleted) {
    navigate(
      {
        pathname: ROUTES.QuizStats(quiz.pseudoId),
        search: searchParams.size > 0 ? "?" + searchParams.toString() : "",
      },
      {
        state: {
          isIndividual: true,
          resultsAfterPassing: questionList.excluded,
        },
      }
    );
  }

  let question1Content;
  let question2Content;
  if (isDataLoaded) {
    if (questionList.curr[0]?.description == null) {
      question1Content = (
        <div className="w-[48%] flex justify-center items-center">
          <div className="text-[36px]">{questionList.curr[0]?.title}</div>
        </div>
      );
    } else {
      question1Content = (
        <div className="w-[48%] text-center">
          <h2 className="h-[40%] text-[30px]">{questionList.curr[0]?.title}</h2>
          <div className="h-[60%] text-[22px] text-[--dark-quizcard-description] leading-tight">
            {questionList.curr[0]?.description}
          </div>
        </div>
      );
    }

    if (questionList.curr[1]?.description == null) {
      question2Content = (
        <div className="w-[48%] flex justify-center items-center">
          <div className="text-[36px]">{questionList.curr[1]?.title}</div>
        </div>
      );
    } else {
      question2Content = (
        <div className="w-[48%] text-center">
          <h2 className="h-[40%] text-[30px]">{questionList.curr[1]?.title}</h2>
          <div className="h-[60%] text-[22px] text-[--dark-quizcard-description] leading-tight">
            {questionList.curr[1]?.description}
          </div>
        </div>
      );
    }
  } else {
    question1Content = question2Content = (
      <div className="w-[48%] flex flex-col items-center">
        <h2 className="h-[40%] w-[70%] text-[30px]">
          <Skeleton animation="wave" />
        </h2>
        <div className="h-[60%] w-[85%] text-[22px] text-[--dark-quizcard-description] leading-tight">
          <Skeleton animation="wave" />
        </div>
      </div>
    );
  }

  const handleWinner = (winner) => {
    if (winner === 1) {
      setQuestionList({
        ...questionList,
        next: [...questionList.next, questionList.curr[0]],
        excluded: [...questionList.excluded, { ...questionList.curr[1], place: questionList.place }],
      });
    } else {
      setQuestionList({
        ...questionList,
        next: [...questionList.next, questionList.curr[1]],
        excluded: [...questionList.excluded, { ...questionList.curr[0], place: questionList.place }],
      });
    }

    if (questionList.curr.length === 2) {
      setQuestionList((prevState) => ({
        ...prevState,
        curr: prevState.next,
        next: [],
        round: 1,
        stage: prevState.stage + 1,
        place: prevState.place - 1,
      }));
    } else {
      const updatedList = questionList.curr.filter((q, index) => {
        if (index === 0 || index === 1) {
          return false;
        }
        return true;
      });
      setQuestionList((prevState) => ({
        ...prevState,
        curr: updatedList,
        next: [...prevState.next],
        excluded: [...prevState.excluded],
        round: prevState.round + 1,
        place: prevState.place - 1,
      }));
    }

    if (questionList.stage === amountStages) {
      setQuestionList((prevState) => ({
        ...prevState,
        curr: [],
        excluded: [...prevState.excluded, { ...prevState.curr[0], place: 1 }],
      }));
      setQuestionList((prevState) => {
        const updatedList = prevState.excluded.sort((a, b) => {
          return a.place - b.place;
        });
        return {
          ...prevState,
          excluded: updatedList,
        };
      });
    }
  };

  return (
    <div className="grid grid-rows-[50px_100px_1fr_100px] h-[100vh]">
      <div className="flex gap-[50px] text-[--dark-text] text-[32px] justify-center">
        <div>Етап: {isDataLoaded ? `${questionList.stage}/${amountStages}` : "1/?"}</div>
        <div>Раунд: {isDataLoaded ? `${questionList.round}/${amountRounds}` : "1/??"}</div>
      </div>

      <div className="flex text-[--dark-text] border border-[--dark-quizcard-border] bg-[--dark-nav]">
        {question1Content}
        <div className="flex flex-col justify-around items-center border-x border-[--dark-quizcard-border] w-[4%] bg-[--dark-background-secondary] text-[36px]">
          <div className="pl-1 pr-2 rounded-xl hover:bg-[--dark-link-background-hover] hover:cursor-pointer">
            <FiRewind title="Повернутися на попередній раунд" />
          </div>
          <div className="p-1 pl-2 rounded-xl hover:bg-[--dark-link-background-hover] hover:cursor-pointer">
            <NavLink to={ROUTES.Quiz(quiz?.pseudoId)}>
              <FiRotateCcw title="Повернутися на сторінку вікторини" />
            </NavLink>
          </div>
        </div>
        {question2Content}
      </div>

      <QuizDuoBattle
        question1={questionList.curr[0]}
        question2={questionList.curr[1]}
        type={quiz?.type}
        handleWinner={handleWinner}
        isDataLoaded={isDataLoaded}
      />
    </div>
  );
}

export default PlayQuizLayout;

function shuffle(array) {
  let currentIndex = array.length;
  let tempArray = [...array];
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [tempArray[currentIndex], tempArray[randomIndex]] = [tempArray[randomIndex], tempArray[currentIndex]];
  }
  return tempArray;
}

//another variant
// const updatedList = questionList.curr.filter((q, index) => {
//   if (index === 0 || index === 1) {
//     return false;
//   }
//   return true;
// });

// if (winner === 1) {
//   if (questionList.curr.length === 2) {
//     if (questionList.stage === amountStages) {
//       setQuestionList({
//         ...questionList,
//         excluded: [
//           ...questionList.excluded,
//           { ...questionList.curr[1], place: 2 },
//           { ...questionList.curr[0], place: 1 },
//         ],
//       });
//       setQuestionList((prevState) => ({
//         ...questionList,
//         excluded: prevState.excluded.sort((a, b) => {
//           return a.place - b.place;
//         }),
//       }));
//       // add results to db if user authorized
//       navigate(ROUTES.QuizStats(quiz.pseudoId), {
//         state: {
//           isIndividual: true,
//           resultsAfterPassing: questionList.excluded,
//         },
//       });
//     } else {
//       setQuestionList({
//         ...questionList,
//         curr: [...questionList.next, questionList.curr[0]],
//         next: [],
//         excluded: [...questionList.excluded, { ...questionList.curr[1], place: questionList.place }],
//         round: 1,
//         stage: questionList.stage + 1,
//         place: questionList.place - 1,
//       });
//     }
//   } else {
//     setQuestionList({
//       ...questionList,
//       curr: updatedList,
//       next: [...questionList.next, questionList.curr[0]],
//       excluded: [...questionList.excluded, { ...questionList.curr[1], place: questionList.place }],
//       round: questionList.round + 1,
//       place: questionList.place - 1,
//     });
//   }
// } else {
//   if (questionList.curr.length === 2) {
//     if (questionList.stage === amountStages) {
//       setQuestionList({
//         ...questionList,
//         excluded: [
//           ...questionList.excluded,
//           { ...questionList.curr[0], place: 2 },
//           { ...questionList.curr[1], place: 1 },
//         ],
//       });
//       setQuestionList((prevState) => ({
//         ...questionList,
//         excluded: prevState.excluded.sort((a, b) => {
//           return a.place - b.place;
//         }),
//       }));
//       // add results to db if user authorized
//       navigate(ROUTES.QuizStats(quiz.pseudoId), {
//         state: {
//           isIndividual: true,
//           resultsAfterPassing: questionList.excluded,
//         },
//       });
//     } else {
//       setQuestionList({
//         ...questionList,
//         curr: [...questionList.next, questionList.curr[1]],
//         next: [],
//         excluded: [...questionList.excluded, { ...questionList.curr[0], place: questionList.place }],
//         round: 1,
//         stage: questionList.stage + 1,
//         place: questionList.place - 1,
//       });
//     }
//   } else {
//     setQuestionList({
//       ...questionList,
//       curr: updatedList,
//       next: [...questionList.next, questionList.curr[1]],
//       excluded: [...questionList.excluded, { ...questionList.curr[0], place: questionList.place }],
//       round: questionList.round + 1,
//       place: questionList.place - 1,
//     });
//   }
// }
