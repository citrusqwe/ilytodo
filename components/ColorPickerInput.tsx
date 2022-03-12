import React from 'react';
import { useField } from 'formik';

const ColorPickerInput = () => {
  const [field, meta, helpers] = useField('color');
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor="color" className="mb-1">
        Name
      </label>
      <div className="inline-flex items-center border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black dark:bg-gray-600 dark:border-gray-700">
        <input
          type="color"
          className="mr-2 appearance-none border-none w-auto h-auto cursor-pointer bg-none color-input"
          onChange={(e) => helpers.setValue(e.target.value)}
        />
        <input
          id="color"
          name="color"
          className="border-none w-full text-xs outline-none py-2 dark:bg-gray-600"
          value={field.value}
          disabled
        />
      </div>
      {meta.touched && meta.error ? (
        <span className="error">{meta.error}</span>
      ) : null}
    </div>
  );
};

export default ColorPickerInput;
