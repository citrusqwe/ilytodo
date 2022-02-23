import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormField = ({ name, type }: any) => {
  const { register, formState } = useFormContext();

  if (type === 'textarea') {
    return (
      <textarea
        className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black resize-none"
        {...register(name, { required: true, maxLength: 60, minLength: 1 })}
        name={name}
        id={name}
        placeholder="Type something"
      />
    );
  }

  return (
    <input
      className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black"
      {...register(name, { required: true, maxLength: 60, minLength: 1 })}
      name={name}
      id={name}
    />
  );
};

export default FormField;
