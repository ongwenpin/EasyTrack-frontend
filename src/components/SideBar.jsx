import { useState, useRef, useEffect } from "react";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, HomeIcon, UserIcon, UsersIcon, CurrencyDollarIcon, ClipboardDocumentIcon, Cog6ToothIcon} from '@heroicons/react/24/outline';
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';

export default function SideBar() {

    const [isOpen, setIsOpen] = useState(false);

    const {currentUser, isAdmin} = useSelector(state => state.user);

    const navigate = useNavigate();

    const location = useLocation();

    const [navigation, setNavigation] = useState([
        { name: 'Dashboard', href: '/', current: true, icon: HomeIcon },
        { name: 'Users', href: '/users', current: false, icon: UsersIcon },
        { name: 'Records', href: '/records', current: false, icon: ClipboardDocumentIcon },
        { name: 'Expenses', href: '/expenses', current: false, icon: CurrencyDollarIcon },
        { name: 'Profile', href: `/user/${currentUser.username}`, current: false, icon: UserIcon },
        { name: 'Settings', href: '/settings', current: false, icon: Cog6ToothIcon},
    ]);

    useEffect(() => {
        setNavigation(navigation.map(item => {
            if (item.href === location.pathname) {
                return { ...item, current: true };
            } else {
                return { ...item, current: false };
            }
        }));
      }, [location]);
    
    
    return (
        <>
            <div className="bg-gray-800 px-2 py-4 h-full min-h-lvh max-w-44">
                
                <div className="flex flex-col space-y-6 sticky top-0">
                    
                        <div className="text-white font-semibold text-lg p-2 text-center">
                            {isOpen && "EasyTrack"}
                        </div>
    
                        {
                            navigation.map((item) => {
                                return (
                                    <div 
                                        key={item.name} 
                                        className={`p-2 text-white rounded-md hover:bg-gray-700 ${item.current ? "bg-gray-700" : ""}`}
                                        onClick={() => navigate(item.href)}
                                    >
                                        <Tooltip title={isOpen ? "" : item.name} placement="right">
                                            <div className="flex flex-row space-x-2">
                                                <div className="ml-1">
                                                    <item.icon className="h-6 w-6"/>
                                                </div>
                                                {
                                                    isOpen &&
                                                    <div className="sm:pr-20">
                                                        {item.name}
                                                    </div>
                                                }
                                            </div>
                                            
                                        </Tooltip>
                                        
                                    </div>
                                );
                            })
                        }  
                        
                        <div>
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="block p-2 rounded-md hover:bg-gray-700 w-full"
                            >
                                {
                                    isOpen 
                                    ? <ChevronDoubleLeftIcon className="h-8 w-8 text-white"/> 
                                    : <ChevronDoubleRightIcon className="h-8 w-8 text-white"/>
                                }
                            </button>
                        </div>
                        
                </div>
            </div>
        </>
        
    );

}