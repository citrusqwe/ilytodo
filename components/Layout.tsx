import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import { IoChevronDownOutline } from 'react-icons/io5';
import {
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlinePlus,
  AiOutlineSearch,
} from 'react-icons/ai';
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
import useSize from '../hooks/useSize';

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
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(true);

  const userPopupRef = useRef(null);
  const themePopupRef = useRef(null);
  const target = useRef(null);

  useOutsideClick(userPopupRef, () => setUserPopupOpen(false));
  useOutsideClick(themePopupRef, () => setThemePopupOpen(false));
  useDarkMode(theme, setTheme);
  const size: DOMRectReadOnly = useSize(target);
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

  useEffect(() => {
    if (size?.width < 1024) setSidebarMenuOpen(false);
    else setSidebarMenuOpen(true);
  }, [size]);

  const checkXIndent = (size: number) => {
    if (size < 639) return -15;
    else if (size > 639 && size < 768) return -23;
    else if (size < 1120 && size >= 767) return -24;
    else return 0;
  };

  const handleCloseSidebar = () => {
    if (size?.width + size?.y * 2 < 1024) setSidebarMenuOpen(false);
  };

  return (
    <div
      className="bg-slate-200 transition duration-200 dark:bg-slate-900  dark:text-white w-full h-screen p-2 md:p-8 lg:p-12"
      ref={target}
    >
      <div className="bg-white overflow-hidden transition duration-200 dark:bg-gray-800 w-full h-full rounded-xl shadow-md py-8">
        <div className="flex items-center justify-between mb-6 cursor-pointer px-4 sm:px-6 lg:px-8">
          <div>
            <button
              className="mr-4 p-2 rounded-md transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setSidebarMenuOpen(!sidebarMenuOpen)}
            >
              <AiOutlineMenu />
            </button>
            <span>Ilytodo</span>
          </div>
          <div className="items-center md:flex hidden">
            <span className="mr-2">
              <AiOutlineSearch className="stroke-gray-theme w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="outline-none max-w-[200px] w-full px-2 dark:bg-gray-600 py-1 border border-transparent rounded-lg transition duration-300 hover:border-gray-theme focus:border-gray-theme"
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
                  <img
                    src={session?.user?.image as string}
                    alt="Profile picture"
                    className="rounded-full w-9 h-9 md:w-10 md:h-10 xl:w-12 xl:h-12"
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
        <div className="flex px-4 sm:px-6 lg:px-8 h-[calc(100%-45px-32px)]">
          {size?.width + size?.y * 2 < 1024 && (
            <motion.div
              animate={sidebarMenuOpen ? 'open' : 'collapsed'}
              variants={{
                open: { opacity: 1, visibility: 'visible' },
                collapsed: { opacity: 0, visibility: 'hidden' },
              }}
              className="bg-black/20 w-full h-full fixed left-0 right-0 z-[1100]"
              onClick={() => setSidebarMenuOpen(false)}
            />
          )}
          <AnimatePresence>
            {sidebarMenuOpen && (
              <motion.div
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { x: checkXIndent(size?.width) },
                  collapsed: { x: -300 },
                }}
                transition={{
                  duration: 0.3,
                }}
                className={`lg:w-56 w-48 lg:static lg:pr-4 px-4 dark:bg-gray-800 group absolute z-[3000] bg-white 
                h-[calc(100%-45px-32*2px)] md:h-[calc(100%-45px-32*3px-20px)]  rounded-b-md mb-2`}
              >
                <ul>
                  <SidebarLink
                    name={'Overview'}
                    icon={
                      <AiOutlineHome className="stroke-gray-theme dark:stroke-white" />
                    }
                    handleCloseSidebar={handleCloseSidebar}
                    margin
                  />
                </ul>
                <div>
                  <div
                    className="flex items-center mb-2 cursor-pointer relative"
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
                      className="ml-auto p-2 cursor-pointer rounded-md transition duration-300 opacity-100 xl:opacity-0 xl:hover:bg-gray-300 xl:group-hover:opacity-100 dark:hover:bg-gray-600"
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
                            handleCloseSidebar={handleCloseSidebar}
                            isProject
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimateSharedLayout>
            <motion.div layout className="lg:pl-8 flex-1">
              {children}
            </motion.div>
          </AnimateSharedLayout>
        </div>
      </div>
      <Modal
        isOpen={сreateProjectModalOpen || settingsModalOpen}
        onRequestClose={() => {
          setCreateProjectModalOpen(false);
          setSettingsModalOpen(false);
        }}
        className="pt-6 pb-4 px-6 sm:pt-10 sm:pb-6 z-[3000] sm:px-8 max-w-lg w-full inset-y-24 bg-white rounded-lg dark:bg-gray-800 dark:text-white"
        overlayClassName="fixed px-2 sm:px-0 inset-0 bg-black/5 flex items-center justify-center dark:bg-black/20"
      >
        {сreateProjectModalOpen && !settingsModalOpen ? (
          <CreateProjectModal
            setModalClose={setCreateProjectModalOpen}
            handleProjectCreation={handleProjectCreation}
          />
        ) : (
          <div>
            <div>In progress</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Layout;
