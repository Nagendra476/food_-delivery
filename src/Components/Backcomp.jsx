import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

function MyComponent() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="p-2 rounded-full hover:bg-gray-200 transition"
    >
      <IoArrowBack size={26} className="text-black hover:text-black" />
    </button>
  );
}

export default MyComponent;