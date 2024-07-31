import { Fragment, useEffect, useState, useRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from "react-redux";
import { logOutFailure, logOutStart, logOutSuccess } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi';
import { getUserNotifications, markNotificationAsRead, clearUserNotifications } from '../api/notificationApi';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
};

export default function Navbar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  async function handleLogOut() {
    try {
      dispatch(logOutStart());
      const response = await logout(currentUser.username);
      dispatch(logOutSuccess());
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      dispatch(logOutFailure(error.response.data));
    }
    
  }

  async function getNotifications() {
    try {
      const response = await getUserNotifications(currentUser.username);
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
      const response = await markNotificationAsRead(notification);
      return response;
    } catch (error) {
      console.error(error.response.data);
    }
  }

  async function clearNotifications() {
    try {
      const response = await clearUserNotifications(currentUser.username);
    } catch (error) {
      console.error(error.response.data);
    }
  }

  return (
      <>
        <div className="bg-gray-800 h-16 inset-y-0 right-0 flex flex-row justify-end space-x-5 items-center pr-2 sm:static sm:inset-auto">

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
              <div className="absolute z-20 origin-top-right right-10 p-2 sm:w-96 bg-white rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-96">
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

                  <div className="rounded mb-1 text-sm space-y-2">
                    {
                      notifications.length === 0 
                        ? <div className="p-1 text-center">No notifications</div> 
                        : notifications.map((notification, index) => {
                          return (
                            <div 
                              key={notification._id} 
                              className={`border border-gray-300 p-2 ${notification.isRead ? "bg-gray-200" : "bg-white"}`}
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
      </>


  );
}

