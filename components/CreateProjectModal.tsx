import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Project } from './Layout';
import ColorPickerInput from './ColorPickerInput';
import { ProjectSchema } from '../schemas';

export type Color = {
  id: string;
  value: string;
  label: string;
};

interface CreateProjectModalProps {
  currentProject?: Project;
  setModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  handleProjectUpdate?: any;
  handleProjectCreation?: any;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  currentProject,
  setModalClose,
  isEdit,
  handleProjectCreation,
  handleProjectUpdate,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium">
          {isEdit ? 'Edit project' : 'Add project'}
        </h2>
      </div>
      <Formik
        initialValues={{
          name: currentProject?.name ? currentProject?.name : '',
          color: currentProject?.color ? currentProject?.color : '#000000',
        }}
        validationSchema={ProjectSchema}
        onSubmit={async (values) => {
          try {
            if (isEdit) {
              await handleProjectUpdate(values);
            } else {
              await handleProjectCreation(values);
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {({ errors, touched, isSubmitting, isValid }) => (
          <Form className="flex flex-col">
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="mb-1">
                Name
              </label>
              <Field
                id="firstName"
                name="name"
                className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black dark:bg-gray-600 dark:border-gray-700"
              />
              {errors.name && touched.name ? (
                <span className="text-red-500">{errors.name}</span>
              ) : null}
            </div>
            <ColorPickerInput />
            <div className="self-end">
              <button
                className="border border-gray-300 rounded-md p-2 mb-2 outline-none mr-4 transtition duration-300 disabled:text-gray-300 hover:border-black focus:border-black"
                type="button"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  setModalClose(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-gray-300 rounded-md p-2 mb-2 outline-none transtition duration-300 disabled:text-gray-300 hover:border-black focus:border-black
                dark:hover:border-gray-600  dark:disabled:border-gray-600 dark:disabled:text-gray-600"
                disabled={isSubmitting || !isValid}
              >
                {!isEdit ? 'Create' : 'Update'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateProjectModal;
