import notFoundImage from "../../img/errors/user-not-found.png";

function UserNotFound() {
  return (
    <div className="grid place-items-center h-full">
      <img src={notFoundImage} alt="not found" />
    </div>
  );
}

export default UserNotFound;
