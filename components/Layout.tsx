import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GrHomeRounded } from 'react-icons/gr';
import { IoChevronDownOutline } from 'react-icons/io5';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
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
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const userPopupRef = useRef(null);

  useOutsideClick(userPopupRef, () => setUserPopupOpen(false));
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

  useEffect(() => {
    const unsub = fb().getAllProjectsRealtime(user, setProjectsList);
  }, []);

  return (
    <div className="bg-slate-200 w-full h-screen p-12">
      <div className="bg-white w-full h-full rounded-xl shadow-md flex py-10 px-10">
        <div className="w-1/4 h-full border-r border-gray-200  pr-4 group">
          <div className="mb-8 font-medium text-xl">Ilytodo</div>
          <div>
            <ul>
              <SidebarLink
                name={'Overview'}
                icon={<GrHomeRounded className="stroke-gray-theme" />}
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
                  className="ml-auto p-2 cursor-pointer rounded-md transition duration-300 opacity-0 hover:bg-gray-300 group-hover:opacity-100"
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
                    className="overflow-auto scroll max-h-[412px]"
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
                className="outline-none px-2 py-1 border border-transparent rounded-lg transition duration-300 hover:border-gray-theme focus:border-gray-theme"
              />
            </div>

            {session && !isLoading ? (
              <div className="relative" ref={userPopupRef}>
                <div
                  className="flex items-center"
                  onClick={() => setUserPopupOpen(!userPopupOpen)}
                >
                  <div className="flex items-center mr-6">
                    <div className="flex items-center">
                      {session?.user?.name
                        ? session?.user?.name
                        : session?.user?.email}
                      <span className="ml-2">
                        <IoChevronDownOutline />
                      </span>
                    </div>
                  </div>
                  <Image
                    src={session?.user?.image as string}
                    alt={'img'}
                    width="45px"
                    height="45px"
                    className="rounded-full"
                  />
                </div>
                {userPopupOpen && (
                  <AnimatePresence>
                    <motion.div
                      className="overflow-hidden absolute left-0 top-10 border border-gray-300 rounded-md py-2 flex flex-col"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="py-1 px-4 transtion duration-300 hover:bg-gray-300">
                        {user?.name ? user?.name : user?.email}
                      </div>
                      <button
                        className="py-1 px-4 transtion duration-300 hover:bg-gray-300"
                        onClick={() => {
                          router.push('/overview');
                          signOut();
                        }}
                      >
                        Sign out
                      </button>
                    </motion.div>
                  </AnimatePresence>
                )}
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
        isOpen={сreateProjectModalOpen}
        onRequestClose={() => setCreateProjectModalOpen(false)}
        className="pt-10 pb-6 px-8 max-w-lg w-full inset-y-24 bg-white rounded-lg"
        overlayClassName="fixed inset-0 bg-black/5 flex items-center justify-center"
      >
        <CreateProjectModal
          setModalClose={setCreateProjectModalOpen}
          handleProjectCreation={handleProjectCreation}
        />
      </Modal>
    </div>
  );
};

export default Layout;
