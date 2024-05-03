import UserProfileLayout from "../components/userProfile/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";

function UserWQuizzesPage() {
  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title="СПИСОК БАЖАНОГО" section={ProfileSections.wishlisted_quizzes}>
        asasa
      </UserProfileLayout>
    </div>
  );
}

export default UserWQuizzesPage;
