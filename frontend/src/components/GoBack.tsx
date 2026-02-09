
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const GoBack = () => {
  const navigate = useNavigate();

  return (
      <ArrowLeft
        className="cursor-pointer hover:-translate-x-1 duration-300"
        onClick={() => navigate(-1)}
      />
  );
};

export default GoBack;
