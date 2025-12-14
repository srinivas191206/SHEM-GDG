import { useState } from 'react';

const useRegistration = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      password: '',
      address: '',
      phone: '',
    },
    household: {
      householdSize: 1,
      houseType: '',
      energyProvider: '',
    },
    deviceSetup: {
      deviceId: '',
      deviceLocation: '',
    },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (stepName, newData) => {
    setFormData((prev) => ({
      ...prev,
      [stepName]: { ...prev[stepName], ...newData },
    }));
  };

  return {
    step,
    formData,
    nextStep,
    prevStep,
    updateFormData,
  };
};

export default useRegistration;