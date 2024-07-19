import { Fragment, useEffect, useState, useRef } from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from "react-redux";
import { logOutFailure, logOutStart, logOutSuccess } from '../redux/userSlice';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const navigation = [
    { name: 'Dashboard', href: '/', current: true },
    { name: 'Users', href: '/users', current: false },
    { name: 'Records', href: '/records', current: false},
    { name: 'Expenses', href: '/expenses', current: false},
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
};

export default function Navbar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotification, setShowNotification] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef();

  // If clicked outside the notification bell, close the notification
  useEffect(() => {
    function handleClickOutside(event) {
      if (!notificationRef.current.contains(event.target) && showNotification) {
        setShowNotification(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  });

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    navigation.forEach((item) => {
      if (location.pathname === item.href) {
        item.current = true;
      } else {
        item.current = false;
      }
    });
  }, [location]);

  async function handleLogOut() {
    try {
      dispatch(logOutStart());
      const response = await axios.post("http://localhost:5050/api/logout", {username: currentUser.username}, {withCredentials: true});
      dispatch(logOutSuccess());
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
      dispatch(logOutFailure(error.response.data));
    }
    
  }

  function handleNavClick(name) {
    navigation.forEach((item) => {
      if (item.name === name) {
        item.current = true;
      } else {
        item.current = false;
      }
    });
  }

  async function getNotifications() {
    try {
      const response = await axios.get(`http://localhost:5050/api/notification/${currentUser.username}`, {withCredentials: true});
      return response;
    } catch (error) {
      console.error(error.response.data);
    }
  }

  useEffect(() => {
    getNotifications().then((response) => {
      if (response.data.length > 0) {
        setNotifications(response.data);
      }
    });
  }, []);

  async function markAsRead(notification) {
    try {
      const response = await axios.patch(`http://localhost:5050/api/notification/${notification._id}`, {isRead: true}, {withCredentials: true});
      return response;
    } catch (error) {
      console.error(error.response.data);
    }
  }

  async function clearNotifications() {
    try {
      const response = await axios.delete(`http://localhost:5050/api/notification/${currentUser.username}`, {withCredentials: true});
    } catch (error) {
      console.error(error.response.data);
    }
  }

  return (
      <>
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => handleNavClick(item.name)}
                            className={classNames(
                              item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                    {/* Notification bell */}
                    <div ref={notificationRef}>
                      <button 
                        className="relative bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring focus:ring-offset focus:ring-white"
                        onClick={() => {
                          if (showNotification) {
                            setShowNotification(false);
                            return;
                          } else {
                            getNotifications().then((response) => {
                              if (response.data.length > 0) {
                                setNotifications(response.data);
                              }
                              setShowNotification(!showNotification)
                            });    
                          }
                          
                        }}
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        {
                          notifications.filter(notification => !notification.isRead).length > 0 && 
                          <div className="rounded-full bg-red-500 text-white absolute top-0 right-0 text-sm px-2">{notifications.filter(notification => !notification.isRead).length}</div>
                        }
                        
                      </button>
                      
                      {
                        showNotification &&
                        <div className="absolute z-20 origin-top-right p-2 right-12 top-12 sm:w-96 bg-white rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="flex flex-col">

                            <div className="flex flex-1 flex-row justify-between">
                              <div className="text-md font-semibold p-1">
                                Notification
                              </div>
                              <div>
                                <button 
                                  className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                                  onClick={() => {
                                    clearNotifications().then(() => {
                                      setNotifications([]);
                                    });
                                  }}
                                >
                                  Clear all
                                </button>
                              </div>
                            </div>

                            <div className="border rounded shadow-md mb-1 text-sm">
                              {
                                notifications.length === 0 
                                  ? <div className="p-1 text-center">No notifications</div> 
                                  : notifications.map((notification, index) => {
                                    return (
                                      <div 
                                        key={notification._id} 
                                        className={`border p-2 ${notification.isRead ? "bg-gray-200" : "bg-white"}`}
                                        onClick={() => {
                                          markAsRead(notification).then(() => {
                                            setNotifications(notifications.map((item) => {
                                              if (item._id === notification._id) {
                                                item.isRead = true;
                                              }
                                              return item;
                                            }));
                                          });
                                        }}
                                      >
                                        {notification.message}
                                      </div>
                                    )
                                  })
                              }
                            </div>
                          </div>
                        </div>
                      }

                    </div>
                    
                    
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                    <div>
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <Bars3Icon className="h-8 w-8 text-white" />
                        </MenuButton>
                    </div>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <MenuItem>
                            {({ focus }) => (
                              <a
                                href={`/user/${currentUser.username}`}
                                className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Profile
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ focus }) => (
                              <a
                                onClick={handleLogOut}
                                className={classNames(focus ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Log out
                              </a>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </>


  );
}

