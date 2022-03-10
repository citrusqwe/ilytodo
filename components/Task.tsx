import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IoCheckmark } from 'react-icons/io5';
import useOutsideClick from '../hooks/useOutsideClick';
import { Task } from '../pages/project/[id]';
import { fb } from '../firebase/functions';
import { Field, Form, Formik } from 'formik';
import { TaskSchema } from '../schemas';

interface TaskProps {
  task: Task;
  deleteTask: any;
  updateTask: any;
}

const Task: React.FC<TaskProps> = ({ task, deleteTask, updateTask }) => {
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const [taskEditOpen, setTaskEditOpen] = useState(false);
  const [taskComplete, setTaskComplete] = useState(task.completed);
  const taskMenuRef = useRef(null);
  useOutsideClick(taskMenuRef, () => setTaskMenuOpen(false));

  const handleTaskDelete = () => {
    deleteTask(task);
    setTaskMenuOpen(false);
  };

  const handleTaskUpdate = (data: any) => {
    updateTask(task, data);
    setTaskEditOpen(false);
  };

  return (
    <div
      key={task.id}
      className="flex items-center mb-2 border-b border-gray-200 pb-1 group"
    >
      {!taskEditOpen ? (
        <>
          <div>
            <div
              className={`w-4 h-4 mr-4 border border-gray-500 rounded-full flex items-center justify-center ${
                taskComplete ? 'bg-gray-500' : ''
              } cursor-pointer`}
              onClick={() => {
                setTaskComplete(!taskComplete);
                updateTask(task, { completed: !taskComplete });
              }}
            >
              {taskComplete && (
                <IoCheckmark className="w-[10px] h-[10px]  stroke-white" />
              )}
            </div>
          </div>
          <p className="break">{task.text}</p>
          <div className="ml-auto relative self-start" ref={taskMenuRef}>
            <button
              className="p-1 opacity-0 transition duration-300 group-hover:opacity-100 focus:opacity-100"
              onClick={() => setTaskMenuOpen(!taskMenuOpen)}
            >
              <BiDotsHorizontalRounded className="w-7 h-7" />
            </button>
          </div>
          {taskMenuOpen && (
            <AnimatePresence exitBeforeEnter>
              <motion.div
                variants={{
                  visible: { opacity: 1, transition: { duration: 0.2 } },
                  hidden: { opacity: 0, transition: { duration: 0.2 } },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute z-[2000] bg-white w-[320px] translate-y-14 right-8 py-2 border border-gray-300 rounded-md shadow-md"
              >
                <div
                  className="flex items-center py-1 px-4 transition duration-300 cursor-pointer hover:bg-gray-300"
                  onClick={() => setTaskEditOpen(!taskEditOpen)}
                >
                  <span className="mr-2">
                    <AiOutlineEdit />
                  </span>
                  Edit task
                </div>
                <div
                  className="flex items-center py-1 px-4 transition duration-300 cursor-pointer hover:bg-gray-300"
                  onClick={handleTaskDelete}
                >
                  <span className="mr-2">
                    <AiOutlineDelete />
                  </span>
                  Delete task
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      ) : (
        <div className="mt-4 w-full">
          <Formik
            initialValues={{
              text: '',
            }}
            validationSchema={TaskSchema}
            onSubmit={(values) => handleTaskUpdate(values)}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col">
                <Field
                  name="text"
                  as="textarea"
                  className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black resize-none"
                  placeholder="Type something"
                />
                {errors.text && touched.text ? (
                  <span className="text-red-500">{errors.text}</span>
                ) : null}
                <div className="flex">
                  <button
                    type="submit"
                    className="mr-2 p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black disabled:text-gray-300 focus:border-black"
                    disabled={isSubmitting}
                  >
                    Edit task
                  </button>
                  <button
                    className=" p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black disabled:text-gray-300 focus:border-black"
                    disabled={isSubmitting}
                    onClick={() => setTaskEditOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default Task;
