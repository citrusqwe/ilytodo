import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoChevronDownOutline } from 'react-icons/io5';
import { Project } from './Layout';
import SidebarLink from './SidebarLink';

interface ProjectsListProps {
  setCreateProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseSidebar: () => void;
  projectsList: Project[];
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  setCreateProjectModalOpen,
  handleCloseSidebar,
  projectsList,
}) => {
  const [projectsListOpen, setProjectsListOpen] = React.useState(true);

  return (
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
        <button
          className="ml-auto p-2 cursor-pointer rounded-md transition duration-300 opacity-100 xl:opacity-0 xl:hover:bg-gray-300 xl:group-hover:opacity-100 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            setCreateProjectModalOpen(true);
            handleCloseSidebar();
          }}
        >
          <AiOutlinePlus />
        </button>
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
                handleCloseSidebar={handleCloseSidebar}
                isProject
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsList;
