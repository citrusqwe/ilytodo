import React, { useEffect, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Project } from './Layout';
import { fb } from '../firebase/functions';

export type Color = {
  id: string;
  value: string;
  label: string;
};

interface CreateProjectModalProps {
  currentProject?: Project;
  setModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  user: any;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  currentProject,
  setModalClose,
  isEdit,
  user,
}) => {
  const [colors, setColors] = useState([]);

  const getColors = async () => {
    try {
      const colors = await fb().getColors();
      setColors(colors);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getColors();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium text-black">
          {isEdit ? 'Edit project' : 'Add project'}
        </h2>
      </div>
      <Formik
        initialValues={{
          name: currentProject?.name ? currentProject?.name : '',
          color: currentProject?.color ? currentProject?.color : '',
        }}
        onSubmit={async (values) => {
          try {
            if (isEdit) {
            } else {
              console.log(values);
              const createdProject = await fb().createProject(values, user);
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form className="flex flex-col">
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="mb-1">
              Name
            </label>
            <Field
              id="firstName"
              name="name"
              className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="color" className="mb-1">
              Color
            </label>
            <Field
              id="lastName"
              name="color"
              className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black"
              as="select"
            >
              {colors?.map((color: Color) => (
                <option key={color.id} value={color.value}>
                  {color.label}
                </option>
              ))}
            </Field>
          </div>
          <div className="self-end">
            <button
              className="border border-gray-300 rounded-md p-2 mb-2 outline-none mr-4 transtition duration-300 hover:border-black focus:border-black"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setModalClose(false);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-gray-300 rounded-md p-2 mb-2 outline-none transtition duration-300 hover:border-black focus:border-black"
            >
              Create
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateProjectModal;
