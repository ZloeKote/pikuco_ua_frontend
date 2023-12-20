import { useContext, useEffect } from "react";
import QuizHeader from "../components/QuizHeader";
import QuizzesList from "../components/QuizzesList";
import QuizContext from "../context/quizzes";
import QuizFilterSort from "../components/QuizFilterSort";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";

function QuizzesPage() {
    // const { fetchQuizzes, quizzes } = useContext(QuizContext);
    // useEffect(() => {
    //     fetchQuizzes()
    // }, [fetchQuizzes]);

    const quizzes = [
        {
          id: "1f",
          title: "Epic Clash",
          description:
            "Fusce posuere varius sem a lobortis. Sed finibus nibh vel congue mollis. Nulla viverra erat sed quam viverra condimentum. Aliquam a lacus facilisis, consequat est nec, luctus massa. Donec in elementum ex. Aliquam facilisis dapibus massa id consectet",
          cover: quizCover,
          creator: {
            avatar: avatar,
            nickname: "ZloeKote",
          },
        },
        {
          id: "2f",
          title: "Music Clash",
          description: "Music festival celebrating various genres and local talent",
          cover: quizCover,
          creator: {
            avatar: avatar,
            nickname: "SuperStar",
          },
        },
        {
          id: "3f",
          title: "Supreme Championship",
          description: "Outdoor adventure race for teams to test their physical and mental abilities",
          cover: quizCover,
          creator: {
            avatar: avatar,
            nickname: "FunnyBunny",
          },
        },
        {
          id: "4f",
          title: "Victory Invitational",
          description: "Film festival showcasing independent and international films",
          cover: quizCover,
          creator: {
            avatar: avatar,
            nickname: "CoolCat123",
          },
        },
        {
          id: "5f",
          title: "Fall Frenzy",
          description: "Film festival showcasing independent and international films",
          cover: quizCover,
          creator: {
            avatar: avatar,
            nickname: "CoolCat123",
          },
        },
      ];
  return (
    <div className="flex flex-col mx-[50px] my-[40px]">
      {/* <QuizHeader>Турніри</QuizHeader> */}
      <QuizFilterSort />
      <QuizzesList quizzes={quizzes} />
    </div>
  );
}

export default QuizzesPage;
