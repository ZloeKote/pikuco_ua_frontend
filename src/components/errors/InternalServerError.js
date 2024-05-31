import internalServerErrorImage from "../../img/errors/adobe-internal-server-error.png";

function InternalServerError() {
  return (
    <div className="grid place-items-center h-full">
      <img className="h-[700px]" src={internalServerErrorImage} alt="not found" />
    </div>
  );
}

export default InternalServerError;
