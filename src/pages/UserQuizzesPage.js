import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";

function UserQuizzesPage() {
  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title="МОЇ ВІКТОРИНИ" section={ProfileSections.my_quizzes}>asasa</UserProfileLayout>
    </div>
  );
}

export default UserQuizzesPage;
