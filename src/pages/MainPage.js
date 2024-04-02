import QuizHeader from "../components/QuizHeader";
import QuizzesList from "../components/QuizzesList";
import avatar from "../img/avatar.png";
import quizCover from "../img/quizCover.png";

import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../store/slices/authSlice";
import { Link } from "react-router-dom";

function MainPage() {
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
  ];

  return (
    <div className="main-page-layout mx-[3rem] mt-[30px]">
      <div>
        <QuizHeader>Популярні вікторини</QuizHeader>
        <QuizzesList quizzes={quizzes} />
      </div>
      <div className="mt-[40px]">
        <QuizHeader>Нові вікторини</QuizHeader>
        <QuizzesList quizzes={quizzes} />
      </div>
    </div>
  );
}
// className="bg-dark-main-background"
export default MainPage;
