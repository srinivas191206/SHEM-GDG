import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deviceSetupSchema } from '../ValidationSchemas';

const DeviceSetupStep = ({ formData, updateFormData, nextStep, prevStep, onSubmitRegistration }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(deviceSetupSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData('deviceSetup', data);
    onSubmitRegistration();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="deviceId" className="block text-gray-300 text-sm font-bold mb-2">Device ID</label>
        <input
          type="text"
          id="deviceId"
          {...register('deviceId')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.deviceId ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="e.g., SHEM-ESP32-001"
        />
        {errors.deviceId && <p className="text-red-500 text-xs mt-1">{errors.deviceId.message}</p>}
      </div>
      <div>
        <label htmlFor="deviceLocation" className="block text-gray-300 text-sm font-bold mb-2">Device Location</label>
        <input
          type="text"
          id="deviceLocation"
          {...register('deviceLocation')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.deviceLocation ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="e.g., Living Room"
        />
        {errors.deviceLocation && <p className="text-red-500 text-xs mt-1">{errors.deviceLocation.message}</p>}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default DeviceSetupStep;