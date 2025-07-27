import { useState } from "react";

export const useAddPatientButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    setIsOpen,
  };
};
