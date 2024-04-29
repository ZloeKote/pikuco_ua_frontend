import UserProfileLayout from "../components/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";

function UserCQuizzesPage() {
  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title="ПРОЙДЕНІ ВІКТОРИНИ" section={ProfileSections.completed_quizzes}>asasa</UserProfileLayout>
    </div>
  );
}

export default UserCQuizzesPage;
