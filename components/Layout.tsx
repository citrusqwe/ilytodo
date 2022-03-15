import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import Modal from 'react-modal';
import { fb } from '../firebase/functions';
import { useRouter } from 'next/router';
import {
  Sidebar,
  ProjectsList,
  CreateProjectModal,
  Header,
  SidebarOverlay,
} from './';
import { useSize } from '../hooks';

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
  const [projectsList, setProjectsList] = useState(projects);
  const [сreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(true);

  const target = useRef(null);

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

  const handleSideberOpen = () => setSidebarMenuOpen(!sidebarMenuOpen);
  const handleSettingsModalOpen = () =>
    setSettingsModalOpen(!settingsModalOpen);

  useEffect(() => {
    const unsub = fb().getAllProjectsRealtime(user, setProjectsList);
  }, []);

  useEffect(() => {
    if (size?.width < 1024) setSidebarMenuOpen(false);
    else setSidebarMenuOpen(true);
  }, [size]);

  const handleCloseSidebar = () => {
    if (size?.width + size?.y * 2 < 1024) setSidebarMenuOpen(false);
  };

  const widthCheck = () => size?.width + size?.y * 2 < 1024;

  return (
    <div
      className="bg-slate-200 transition duration-200 dark:bg-slate-900  dark:text-white w-full h-screen p-2 md:p-8 lg:p-12"
      ref={target}
    >
      <div className="bg-white overflow-hidden transition duration-200 dark:bg-gray-800 w-full h-full rounded-xl shadow-md py-8">
        <Header
          user={user}
          handleSettingsModalOpen={handleSettingsModalOpen}
          handleSidebarOpen={handleSideberOpen}
        />
        <div className="flex px-4 sm:px-6 lg:px-8 h-[calc(100%-45px-32px)]">
          {widthCheck() && (
            <SidebarOverlay
              setSidebarMenuOpen={setSidebarMenuOpen}
              sidebarMenuOpen={sidebarMenuOpen}
            />
          )}
          <AnimatePresence>
            {sidebarMenuOpen && (
              <Sidebar size={size} handleCloseSidebar={handleCloseSidebar}>
                <ProjectsList
                  setCreateProjectModalOpen={setCreateProjectModalOpen}
                  handleCloseSidebar={handleCloseSidebar}
                  projectsList={projectsList}
                />
              </Sidebar>
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
        overlayClassName="fixed px-2 sm:px-0 inset-0 z-[2999] bg-black/5 flex items-center justify-center dark:bg-black/20"
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
