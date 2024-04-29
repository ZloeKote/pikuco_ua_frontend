import UserProfileLayout from "../components/UserProfileLayout";
import ProfileSections from "../predefined/ProfileSections";

function UserPrivacyPage() {
  return (
    <div className="flex justify-center mt-12">
      <UserProfileLayout title="КОНФІДЕНЦІЙНІСТЬ" section={ProfileSections.privacy}>asasa</UserProfileLayout>
    </div>
  );
}

export default UserPrivacyPage;
