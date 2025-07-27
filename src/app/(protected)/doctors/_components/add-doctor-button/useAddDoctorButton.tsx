import { useState } from "react";

export const useAddDoctorButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    setIsOpen,
  };
};
