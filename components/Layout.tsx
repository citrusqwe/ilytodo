import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import Modal from 'react-modal';
import { fb } from '../firebase/functions';
import { useRouter } from 'next/router';
import { Sidebar, CreateProjectModal, Header, SidebarOverlay } from './';
import { useSize } from '../hooks';
import { DropResult } from 'react-beautiful-dnd';
import dynamic from 'next/dynamic';
import { Project, TodoAppContext } from '../pages/_app';

Modal.setAppElement('#__next');

interface LayoutProps {
  children: ReactElement[] | ReactElement | Text;
}

const ProjectsList = dynamic(() => import('../components/ProjectsList'), {
  ssr: false,
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const context = useContext(TodoAppContext);
  const [projectsList, setProjectsList] = useState(context.projects);
  const [сreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(true);

  const target = useRef(null);

  const { isOverlay, size } = useSize(target);
  const router = useRouter();

  const handleProjectCreation = async (values: any) => {
    try {
      const createdProject = await fb().createProject(values, context.user);
      setProjectsList([...projectsList, createdProject as Project]);
      router.push(`/project/${createdProject?.id}`);
      setCreateProjectModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const closeModal = () => {
    setCreateProjectModalOpen(false);
    setSettingsModalOpen(false);
  };

  const reorder = (list: Project[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;

    const items = reorder(
      projectsList,
      res.source.index,
      res.destination.index
    );

    setProjectsList(items);
  };

  const handleSideberOpen = () => setSidebarMenuOpen(!sidebarMenuOpen);
  const handleSettingsModalOpen = () =>
    setSettingsModalOpen(!settingsModalOpen);

  useEffect(() => {
    const unsub = fb().getAllProjectsRealtime(context.user, setProjectsList);
  }, []);

  useEffect(() => {
    if (size?.width < 1024) setSidebarMenuOpen(false);
    else setSidebarMenuOpen(true);
  }, [size]);

  return (
    <div
      className="bg-slate-200 transition duration-200 dark:bg-slate-900  dark:text-white w-full h-screen p-2 md:p-8 lg:p-12"
      ref={target}
    >
      <div className="bg-white overflow-hidden transition duration-200 dark:bg-gray-800 w-full h-full rounded-xl shadow-md py-8">
        <Header
          handleSettingsModalOpen={handleSettingsModalOpen}
          handleSidebarOpen={handleSideberOpen}
        />
        <div className="flex px-4 sm:px-6 lg:px-8 h-[calc(100%-45px-32px)]">
          {isOverlay && (
            <SidebarOverlay
              setSidebarMenuOpen={setSidebarMenuOpen}
              sidebarMenuOpen={sidebarMenuOpen}
            />
          )}
          <AnimatePresence>
            {sidebarMenuOpen && (
              <Sidebar size={size}>
                <ProjectsList
                  setCreateProjectModalOpen={setCreateProjectModalOpen}
                  projectsList={projectsList}
                  onDragEnd={onDragEnd}
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
        onRequestClose={closeModal}
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

export default React.memo(Layout);
