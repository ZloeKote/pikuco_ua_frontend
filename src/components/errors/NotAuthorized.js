import notAuthorizedImage from "../../img/errors/not-authorized-rafiki1.png";

function NotAuthorized() {
  return (
    <div className="grid place-items-center h-full">
      <img src={notAuthorizedImage} alt="not found" />
    </div>
  );
}

export default NotAuthorized;
