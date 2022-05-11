import React, { MouseEvent } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import { IoChevronDownOutline } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import { AnimatePresence, motion } from 'framer-motion';
import SidebarLink from './SidebarLink';
import { Project } from '../pages/_app';

interface ProjectsListProps {
  setCreateProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectsList: Project[];
  onDragEnd: (res: DropResult) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  setCreateProjectModalOpen,
  projectsList,
  onDragEnd,
}) => {
  const [projectsListOpen, setProjectsListOpen] = React.useState(true);

  const handleProjectListOpen = () => setProjectsListOpen(!projectsListOpen);

  const openCreateModal = (e: MouseEvent) => {
    e.stopPropagation();
    setCreateProjectModalOpen(true);
  };

  return (
    <div>
      <div
        className="flex items-center mb-2 cursor-pointer relative"
        onClick={handleProjectListOpen}
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
          onClick={(e) => openCreateModal(e)}
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {projectsList?.map((project: Project, index: number) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <SidebarLink
                              {...project}
                              isProject
                              icon={
                                <div
                                  className={`w-3 h-3 rounded-full`}
                                  style={{ backgroundColor: project.color }}
                                />
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(ProjectsList);
