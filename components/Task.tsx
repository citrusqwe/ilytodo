import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IoCheckmark } from 'react-icons/io5';
import useOutsideClick from '../hooks/useOutsideClick';
import { Task } from '../pages/project/[id]';
import { fb } from '../firebase/functions';
import { FormProvider, useForm } from 'react-hook-form';
import FormField from './FormField';

interface TaskProps {
  task: Task;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);
  const [taskEditOpen, setTaskEditOpen] = useState(false);
  const taskMenuRef = useRef(null);
  useOutsideClick(taskMenuRef, () => setTaskMenuOpen(false));
  const form = useForm({
    defaultValues: {
      text: task.text,
    },
  });

  const onSubmit = (data: any) => updateTask(data);

  const deleteTask = async () => {
    try {
      const deletedTask = await fb().deleteTask(task);
      console.log('task deleted', deleteTask);
      setTaskMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (data: any) => {
    try {
      const updatedTask = await fb().updateTask(task, data.text);
      console.log(updatedTask);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      key={task.id}
      className="flex items-center mb-2 border-b border-gray-100 pb-1 group"
    >
      {!taskEditOpen ? (
        <>
          <div>
            <div
              className={`opacity-0 transition duration-300 group-hover:opacity-100 w-4 h-4 mr-4 border broder-gray-theme rounded-full flex items-center justify-center ${
                task.completed ? 'bg-gray-300' : ''
              } cursor-pointer p-1`}
            >
              {task.completed && (
                <IoCheckmark className="w-3 h-3 stroke-black" />
              )}
            </div>
          </div>
          <div>{task.text}</div>
          <div className="ml-auto relative " ref={taskMenuRef}>
            <button
              className="p-1 opacity-0 transition duration-300 group-hover:opacity-100 focus:opacity-100"
              onClick={() => setTaskMenuOpen(!taskMenuOpen)}
            >
              <BiDotsHorizontalRounded className="w-7 h-7" />
            </button>
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
                  className="absolute w-[320px] right-0 py-2 border border-gray-300 rounded-md"
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
                    onClick={deleteTask}
                  >
                    <span className="mr-2">
                      <AiOutlineDelete />
                    </span>
                    Delete task
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </>
      ) : (
        <div className="mt-4 w-full">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col"
            >
              <FormField name={'text'} type={'textarea'} />
              <div className="flex">
                <button
                  type="submit"
                  className="mr-2 p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black focus:border-black"
                >
                  Edit task
                </button>
                <button
                  className=" p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black focus:border-black"
                  onClick={() => setTaskEditOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
};

export default Task;
