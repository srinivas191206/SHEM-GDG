import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '../ValidationSchemas';

const PersonalInfoStep = ({ formData, updateFormData, nextStep }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData('personalInfo', data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">Full Name</label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.name ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">Email Address</label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.email ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="your@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.password ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="********"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="address" className="block text-gray-300 text-sm font-bold mb-2">Address</label>
        <input
          type="text"
          id="address"
          {...register('address')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.address ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="123 Main St"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-gray-300 text-sm font-bold mb-2">Phone Number</label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={`w-full px-3 py-2 mt-1 text-white bg-gray-700 rounded-md focus:outline-none ${errors.phone ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
          placeholder="123-456-7890"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        Next
      </button>
    </form>
  );
};

export default PersonalInfoStep;