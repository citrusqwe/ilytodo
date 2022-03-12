import React, { useEffect, useRef, useState } from 'react';
import { NextPage, NextPageContext } from 'next';
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
} from 'react-icons/ai';
import { fb } from '../../firebase/functions';
import Task from '../../components/Task';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import useOutsideClick from '../../hooks/useOutsideClick';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import Modal from 'react-modal';
import { Field, Form, Formik } from 'formik';
import CreateProjectModal from '../../components/CreateProjectModal';
import Head from 'next/head';
import { Project } from '../../components/Layout';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { TaskSchema } from '../../schemas';
import StartSvg from '../../public/start_project.svg';
import Image from 'next/image';
import AnimatedPopup from '../../components/AnimatedPopup';

export type Task = {
  completed: boolean;
  timestamp: number;
  text: string;
  projectId: string;
  id: string;
};

interface ProjectProps {
  project: {
    id: string;
    name: string;
    color: string;
  };
  tasks: Task[];
}

Modal.setAppElement('#__next');

const Project: NextPage<ProjectProps> = ({ project, tasks }) => {
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [showCompletedTask, setShowCompletedTask] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);
  const [tasksList, setTasksList] = useState<Task[]>(tasks);

  const projectMenuRef = useRef(null);
  useOutsideClick(projectMenuRef, () => setProjectMenuOpen(false));
  const router = useRouter();

  useEffect(() => {
    setCurrentProject(project);
    setTasksList(tasks);
  }, [project]);

  const createTask = async (data: any) => {
    const task = {
      ...data,
      completed: false,
      projectId: currentProject.id,
    };

    try {
      const createdTask = await fb().createTask(task);
      setTasksList([createdTask, ...tasksList]);
      setCreateTaskOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async (data: any) => {
    try {
      const updatedProject = await fb().updateProject(currentProject, data);
      setCurrentProject({ ...updatedProject, ...data });
      setProjectModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = async () => {
    try {
      router.push('/overview');
      const deletedProject = await fb().deleteProject(currentProject);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (task: any) => {
    try {
      const deletedTask = await fb().deleteTask(task);
      const updatedTaskList = tasksList.filter((t) => t.id !== deletedTask.id);
      setTasksList(updatedTaskList);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (task: Task, data: any) => {
    try {
      const updatedTask = await fb().updateTask(task, data);
      tasksList.splice(tasksList.indexOf(task), 1, {
        ...updatedTask,
        ...data,
      });
      setTasksList([...tasksList]);
    } catch (error) {
      console.log('update error', error);
    }
  };

  useEffect(() => {
    const filteredTasks = tasks?.filter((t) =>
      showCompletedTask ? t : t.completed === false
    );
    setTasksList(filteredTasks);
  }, [showCompletedTask]);

  if (!currentProject) return <div>Error happend</div>;

  return (
    <div>
      <Head>
        <title>{currentProject?.name}</title>
      </Head>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl capitalize break-words max-w-[600px]">
          {currentProject?.name}
        </h3>
        <div className="relative self-start" ref={projectMenuRef}>
          <button
            className="p-1"
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
          >
            <BiDotsHorizontalRounded className="w-7 h-7" />
          </button>
          {projectMenuOpen && (
            <AnimatedPopup>
              <div
                className="flex items-center py-2 px-4 transition duration-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setProjectModalOpen(!projectModalOpen)}
              >
                <span className="mr-2">
                  <AiOutlineEdit />
                </span>
                Edit project
              </div>
              <div
                className="flex items-center py-2 px-4 transition duration-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowCompletedTask(!showCompletedTask)}
              >
                {showCompletedTask ? (
                  <>
                    <span className="mr-2">
                      <AiOutlineCloseCircle />
                    </span>
                    Hide completed tasks
                  </>
                ) : (
                  <>
                    <span className="mr-2">
                      <IoCheckmarkCircleOutline />
                    </span>
                    Show completed task
                  </>
                )}
              </div>
              <div
                className="flex items-center py-2 px-4 transition duration-300 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={deleteProject}
              >
                <span className="mr-2">
                  <AiOutlineDelete />
                </span>
                Delete project
              </div>
            </AnimatedPopup>
          )}
        </div>
      </div>
      <div className="mb-8 pr-2 overflow-auto max-h-80 scroll dark:scroll-dark">
        {tasksList?.map((task) => (
          <Task
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))}
      </div>
      {createTaskOpen ? (
        <div className="mt-4 w-1/2">
          <Formik
            initialValues={{
              text: '',
            }}
            validationSchema={TaskSchema}
            onSubmit={(values) => createTask(values)}
          >
            {({ errors, touched, isSubmitting, isValid }) => (
              <Form className="flex flex-col">
                <Field
                  name="text"
                  as="textarea"
                  className="border border-gray-300 rounded-md p-2 mb-2 outline-none focus:border-black resize-none dark:bg-gray-600"
                  placeholder="Type something"
                />
                {errors.text && touched.text ? (
                  <span className="text-red-500">{errors.text}</span>
                ) : null}
                <div className="flex">
                  <button
                    type="submit"
                    className="mr-2 p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black disabled:text-gray-300 focus:border-black  dark:hover:border-gray-600 dark:disabled:border-gray-600  dark:disabled:text-gray-600"
                    disabled={isSubmitting || !isValid}
                  >
                    Add task
                  </button>
                  <button
                    className=" p-2 border border-gray-300 rounded-md transition duration-300 hover:border-black disabled:text-gray-300 focus:border-black dark:disabled:bg-gray-600 dark:hover:border-gray-600"
                    onClick={() => setCreateTaskOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <button
          className="flex items-center transition duration-300 mb-4 hover:text-black dark:hover:text-gray-400"
          onClick={() => setCreateTaskOpen(!createTaskOpen)}
        >
          <span className="mr-2">
            <AiOutlinePlus />
          </span>
          Add task
        </button>
      )}
      {tasksList.length < 1 && (
        <div className="text-center mt-4">
          <Image
            src={StartSvg.src}
            width={StartSvg.width}
            height={160}
            alt="Start image"
          />
          <div className="text-center">
            <span className="block  mt-8">Organize your tasks</span>
            <span>Add a new one!</span>
          </div>
        </div>
      )}
      <Modal
        isOpen={projectModalOpen}
        onRequestClose={() => setProjectModalOpen(false)}
        className="pt-10 pb-6 px-8 max-w-lg w-full inset-y-24 bg-white rounded-lg dark:text-white dark:bg-gray-800"
        overlayClassName="fixed inset-0 bg-black/5 flex items-center justify-center dark:bg-black/20"
      >
        <CreateProjectModal
          currentProject={currentProject}
          setModalClose={setProjectModalOpen}
          handleProjectUpdate={updateProject}
          isEdit
        />
      </Modal>
    </div>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  try {
    const user = await getSession(ctx);
    const projectId = ctx.query.id as string;
    const project = await fb().getProject(projectId);
    const tasks = await fb().getProjectTasks(projectId);

    if (user?.id !== project.userId) {
      return {
        props: {},
        redirect: {
          destination: '/overview',
          permanent: false,
        },
      };
    } else {
      return {
        props: { project, tasks },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}

export default Project;
