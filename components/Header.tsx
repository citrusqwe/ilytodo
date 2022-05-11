import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { AiOutlineMenu, AiOutlineSearch } from 'react-icons/ai';
import { IoChevronDownOutline } from 'react-icons/io5';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import { useDarkMode, useOutsideClick } from '../hooks';
import { TodoAppContext } from '../pages/_app';
import AnimatedPopup from './AnimatedPopup';

interface HeaderProps {
  handleSettingsModalOpen: () => void;
  handleSidebarOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({
  handleSettingsModalOpen,
  handleSidebarOpen,
}) => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const [theme, setTheme] = useState('light');
  const [themePopupOpen, setThemePopupOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const userPopupRef = useRef(null);
  const themePopupRef = useRef(null);

  useOutsideClick(userPopupRef, () => setUserPopupOpen(false));
  useOutsideClick(themePopupRef, () => setThemePopupOpen(false));
  useDarkMode(theme, setTheme);
  const router = useRouter();

  const handleTheme = (theme: string) => {
    setTheme(theme);
    setThemePopupOpen(false);
  };

  return (
    <TodoAppContext.Consumer>
      {({ _, user }: any) => (
        <div className="flex items-center justify-between mb-6 cursor-pointer px-4 sm:px-6 lg:px-8">
          <div>
            <button
              className="mr-4 p-2 rounded-md transition duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={handleSidebarOpen}
            >
              <AiOutlineMenu />
            </button>
            <Link href="/overview">Ilytodo</Link>
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
                      onClick={handleSettingsModalOpen}
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
      )}
    </TodoAppContext.Consumer>
  );
};

export default Header;
