import notFoundImage from "../../img/errors/page-not-found.png";

function PageNotFound() {
  return (
    <div className="grid place-items-center h-full">
      <img src={notFoundImage} alt="not found" />
    </div>
  );
}

export default PageNotFound;
