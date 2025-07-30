import { useState } from "react";

const useAddAppointmentsButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
  };
};
export { useAddAppointmentsButton };
