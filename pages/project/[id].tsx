import React, { useRef, useState } from 'react';
import { NextPage, NextPageContext } from 'next';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { fb } from '../../firebase/functions';
import Task from '../../components/Task';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { AnimatePresence, motion } from 'framer-motion';
import useOutsideClick from '../../hooks/useOutsideClick';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import Modal from 'react-modal';
import { Field, Form, Formik } from 'formik';
import CreateProjectModal from '../../components/CreateProjectModal';

export type Task = {
  completed: boolean;
  timestamp: string;
  text: string;
  projectId: string;
  id: string;
};

interface ProjectProps {
  currentProject: {
    id: string;
    name: string;
    color: string;
  };
  tasks: Task[];
}

Modal.setAppElement('#__next');

const Project: NextPage<ProjectProps> = ({ currentProject, tasks }) => {
  const [inputOpen, setInputOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const projectMenuRef = useRef(null);
  useOutsideClick(projectMenuRef, () => setProjectMenuOpen(false));

  const createTask = async (data: any) => {
    const task = {
      ...data,
      completed: false,
      projectId: currentProject.id,
    };

    try {
      const createdTask = await fb().createTask(task);
      setInputOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = async () => {
    try {
      const deletedProject = await fb().deleteProject(currentProject);
      console.log('project deleted', deletedProject);
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentProject) return <div>Error happend</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl capitalize">{currentProject?.name}</h3>
        <div className="relative" ref={projectMenuRef}>
          <button
            className="p-1"
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
          >
            <BiDotsHorizontalRounded className="w-7 h-7" />
          </button>
          {projectMenuOpen && (
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
                  className="flex items-center py-2 px-4 transition duration-300 cursor-pointer hover:bg-gray-300"
                  onClick={() => setProjectModalOpen(!projectModalOpen)}
                >
                  <span className="mr-2">
                    <AiOutlineEdit />
                  </span>
                  Edit project
                </div>
                <div className="flex items-center py-2 px-4 transition duration-300 cursor-pointer hover:bg-gray-300">
                  <span className="mr-2">
                    <IoCheckmarkCircleOutline />
                  </span>
                  Show completed tasks
                </div>
                <div
                  className="flex items-center py-2 px-4 transition duration-300 cursor-pointer hover:bg-gray-300"
                  onClick={deleteProject}
                >
                  <span className="mr-2">
                    <AiOutlineDelete />
                  </span>
                  Delete project
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <div className="mb-8">
        {tasks?.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
      <button
        className="flex items-center transition duration-300 mb-4 hover:text-black"
        onClick={() => setInputOpen(!inputOpen)}
      >
        <span className="mr-2">
          <AiOutlinePlus />
        </span>
        Add task
      </button>
      {inputOpen && (
        <div className="mt-4 w-1/2">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
            }}
            onSubmit={(values) => createTask(values)}
          >
            <Form className="flex flex-col">
              <Field
                name="text"
                as="textarea"
                className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black resize-none"
                placeholder="Type something"
              />
              <div className="flex">
                <button
                  type="submit"
                  className="mr-2 p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black focus:border-black"
                >
                  Add task
                </button>
                <button
                  className=" p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black focus:border-black"
                  onClick={() => setInputOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      )}

      <Modal
        isOpen={projectModalOpen}
        onRequestClose={() => setProjectModalOpen(false)}
        className="pt-10 pb-6 px-8 max-w-lg w-full inset-y-24 bg-white rounded-lg"
        overlayClassName="fixed inset-0 bg-black/5 flex items-center justify-center"
      >
        <CreateProjectModal
          currentProject={currentProject}
          setModalClose={setProjectModalOpen}
          isEdit
        />
      </Modal>
    </div>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const projectId = ctx.query.id as string;
    const currentProject = await fb().getProject(projectId);
    const tasks = await fb().getProjectTasks(projectId);

    return {
      props: { currentProject, tasks },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}

export default Project;
