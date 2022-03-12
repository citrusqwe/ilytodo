import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoChevronDownOutline } from 'react-icons/io5';
import { AiOutlineHome, AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import SidebarLink from '../components/SidebarLink';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CreateProjectModal from './CreateProjectModal';
import Modal from 'react-modal';
import Link from 'next/link';
import useOutsideClick from '../hooks/useOutsideClick';
import { fb } from '../firebase/functions';
import { useRouter } from 'next/router';
import AnimatedPopup from './AnimatedPopup';
import useDarkMode from '../hooks/useDarkMode';

Modal.setAppElement('#__next');

export type Project = {
  id: string;
  name: string;
  color: string;
};

interface LayoutProps {
  children: ReactElement[] | ReactElement | Text;
  projects: Project[];
  user: any;
}

const Layout: React.FC<LayoutProps> = ({ children, projects, user }) => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const [projectsList, setProjectsList] = useState(projects);
  const [projectsListOpen, setProjectsListOpen] = useState(true);
  const [сreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [themePopupOpen, setThemePopupOpen] = useState(false);

  const userPopupRef = useRef(null);
  const themePopupRef = useRef(null);

  useOutsideClick(userPopupRef, () => setUserPopupOpen(false));
  useOutsideClick(themePopupRef, () => setThemePopupOpen(false));
  useDarkMode(theme, setTheme);
  const router = useRouter();

  const handleProjectCreation = async (values: any) => {
    try {
      const createdProject = await fb().createProject(values, user);
      setProjectsList([...projectsList, createdProject as Project]);
      router.push(`/project/${createdProject?.id}`);
      setCreateProjectModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTheme = (theme: string) => {
    setTheme(theme);
    setThemePopupOpen(false);
  };

  useEffect(() => {
    const unsub = fb().getAllProjectsRealtime(user, setProjectsList);
  }, []);

  return (
    <div className="bg-slate-200 transition duration-200 dark:bg-slate-900  dark:text-white w-full h-screen p-12">
      <div className="bg-white transition duration-200 dark:bg-gray-800 w-full h-full rounded-xl shadow-md flex py-10 px-10">
        <div className="w-1/4 h-full border-r border-gray-200 dark:border-gray-600  pr-4 group">
          <div className="mb-8 font-medium text-xl">Ilytodo</div>
          <div>
            <ul>
              <SidebarLink
                name={'Overview'}
                icon={
                  <AiOutlineHome className="stroke-gray-theme dark:stroke-white" />
                }
                margin
              />
            </ul>
            <div>
              <div
                className="flex items-center mb-2 cursor-pointer relative z-50"
                onClick={() => setProjectsListOpen(!projectsListOpen)}
              >
                <span className="mr-4 cursor-pointer">
                  <IoChevronDownOutline
                    className={`${
                      projectsListOpen ? '' : '-rotate-90'
                    } transition duration-300`}
                  />
                </span>
                Projects
                <span
                  className="ml-auto p-2 cursor-pointer rounded-md transition duration-300 opacity-0 hover:bg-gray-300 group-hover:opacity-100 dark:hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateProjectModalOpen(true);
                  }}
                >
                  <AiOutlinePlus />
                </span>
              </div>
              <AnimatePresence initial={false}>
                {projectsListOpen && (
                  <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: 'auto' },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                    className="overflow-auto pr-2 scroll dark:scroll-dark max-h-[412px]"
                  >
                    {projectsList?.map((project: Project) => (
                      <SidebarLink
                        key={project.id}
                        name={project.name}
                        icon={
                          <div
                            className={`w-3 h-3 rounded-full`}
                            style={{ backgroundColor: project.color }}
                          />
                        }
                        id={project.id}
                        currentId={router.query.id}
                        isProject
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="pl-4 flex-1">
          <div className="flex items-center justify-between mb-6 cursor-pointer">
            <div className="flex items-center">
              <span className="mr-2">
                <AiOutlineSearch className="stroke-gray-theme w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search"
                name=""
                id=""
                className="outline-none px-2 dark:bg-gray-600 py-1 border border-transparent rounded-lg transition duration-300 hover:border-gray-theme focus:border-gray-theme"
              />
            </div>

            {session && !isLoading ? (
              <div className="flex items-center">
                <div className="mr-6 relative" ref={themePopupRef}>
                  <button
                    className="p-2"
                    onClick={() => setThemePopupOpen(!themePopupOpen)}
                  >
                    {theme === 'light' ? (
                      <MdOutlineLightMode className="w-[19px] h-[19px] fill-sky-500" />
                    ) : (
                      <MdOutlineDarkMode className="w-[19px] h-[19px] fill-sky-500" />
                    )}
                  </button>
                  {themePopupOpen && (
                    <AnimatedPopup isHeader>
                      <li
                        className={`flex items-center py-1 px-4 dark:text-white w-full transtion duration-300 ${
                          theme === 'light' ? 'text-sky-400' : ''
                        } hover:bg-gray-300 dark:hover:bg-gray-600`}
                        onClick={() => handleTheme('light')}
                      >
                        <MdOutlineDarkMode className="mr-2" />
                        Light
                      </li>
                      <li
                        className={`flex items-center py-1 px-4  w-full transtion duration-300 ${
                          theme === 'dark' ? 'text-sky-400' : ''
                        } hover:bg-gray-300 dark:hover:bg-gray-600`}
                        onClick={() => handleTheme('dark')}
                      >
                        <MdOutlineLightMode className="mr-2" />
                        Dark
                      </li>
                    </AnimatedPopup>
                  )}
                </div>
                <div className="relative" ref={userPopupRef}>
                  <div
                    className="flex items-center"
                    onClick={() => setUserPopupOpen(!userPopupOpen)}
                  >
                    <Image
                      src={session?.user?.image as string}
                      alt={'img'}
                      width="45px"
                      height="45px"
                      className="rounded-full"
                    />
                    <IoChevronDownOutline className="ml-2" />
                  </div>

                  {userPopupOpen && (
                    <AnimatedPopup isHeader>
                      <li className="py-1 text-center px-4 w-full transtion duration-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                        {user?.name ? user?.name : user?.email}
                      </li>
                      <li
                        className="w-full text-center py-1 px-4 transtion duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={() => setSettingsModalOpen(!settingsModalOpen)}
                      >
                        Settings
                      </li>
                      <li className="w-full text-center transtion duration-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                        <button
                          className="py-1 px-4"
                          onClick={() => {
                            router.push('/overview');
                            signOut();
                          }}
                        >
                          Sign out
                        </button>
                      </li>
                    </AnimatedPopup>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Skeleton width={100} className="mr-4" />
                <Skeleton
                  circle
                  height="100%"
                  containerClassName="w-[45px] h-[45px] leading-[1]"
                />
              </div>
            )}
            {!isLoading && !session && (
              <Link href="/api/auth/signin">
                <a className="px-4 py-1 border border-gray-300 transition duration-300 rounded-md hover:border-black">
                  Login
                </a>
              </Link>
            )}
          </div>
          {children}
        </div>
      </div>
      <Modal
        isOpen={сreateProjectModalOpen || settingsModalOpen}
        onRequestClose={() => {
          setCreateProjectModalOpen(false);
          setSettingsModalOpen(false);
        }}
        className="pt-10 pb-6 px-8 max-w-lg w-full inset-y-24 bg-white rounded-lg dark:bg-gray-800 dark:text-white"
        overlayClassName="fixed inset-0 bg-black/5 flex items-center justify-center dark:bg-black/20"
      >
        {сreateProjectModalOpen && !settingsModalOpen ? (
          <CreateProjectModal
            setModalClose={setCreateProjectModalOpen}
            handleProjectCreation={handleProjectCreation}
          />
        ) : (
          <div>
            <div>
              <h3>Theme</h3>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Layout;
