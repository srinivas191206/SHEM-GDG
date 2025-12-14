import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { householdSchema } from '../ValidationSchemas';

const HouseholdStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(householdSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData('household', data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="householdSize" className="block text-gray-300 text-sm font-bold mb-2">Household Size</label>
        <input
          type="number"
          id="householdSize"
          {...register('householdSize', { valueAsNumber: true })}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.householdSize ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="e.g., 4"
        />
        {errors.householdSize && <p className="text-red-500 text-xs mt-1">{errors.householdSize.message}</p>}
      </div>
      <div>
        <label htmlFor="houseType" className="block text-gray-300 text-sm font-bold mb-2">Type of House</label>
        <select
          id="houseType"
          {...register('houseType')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.houseType ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
        >
          <option value="">Select...</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
        </select>
        {errors.houseType && <p className="text-red-500 text-xs mt-1">{errors.houseType.message}</p>}
      </div>
      <div>
        <label htmlFor="energyProvider" className="block text-gray-300 text-sm font-bold mb-2">Energy Provider</label>
        <input
          type="text"
          id="energyProvider"
          {...register('energyProvider')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.energyProvider ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="e.g., PG&E"
        />
        {errors.energyProvider && <p className="text-red-500 text-xs mt-1">{errors.energyProvider.message}</p>}
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
          Next
        </button>
      </div>
    </form>
  );
};

export default HouseholdStep;