import { useState, useRef, useEffect } from "react";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, HomeIcon, UserIcon, UsersIcon, CurrencyDollarIcon, ClipboardDocumentIcon} from '@heroicons/react/24/outline';
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function SideBar() {

    const [isOpen, setIsOpen] = useState(false);

    const {currentUser} = useSelector(state => state.user);

    const navigate = useNavigate();

    const location = useLocation();

    const [navigation, setNavigation] = useState([
        { name: 'Dashboard', href: '/', current: true, icon: HomeIcon },
        { name: 'Users', href: '/users', current: false, icon: UsersIcon },
        { name: 'Records', href: '/records', current: false, icon: ClipboardDocumentIcon },
        { name: 'Expenses', href: '/expenses', current: false, icon: CurrencyDollarIcon },
        { name: 'Profile', href: `/user/${currentUser.username}`, current: false, icon: UserIcon },
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
            <div className="bg-gray-800 px-2 py-4 sticky h-auto min-h-lvh">
                {
                    
                    <div className="flex flex-col space-y-4">
                        
                        {
                            isOpen &&
                            <>
                                <div className="text-white font-semibold text-lg p-2">
                                    EasyTrack
                                </div>
                                {navigation.map((item) => {
                                    return (
                                        <div 
                                            key={item.name} 
                                            className={`p-2 flex flex-row text-white space-x-4 rounded-md hover:bg-gray-700 ${item.current ? "bg-gray-700" : ""}`}
                                            onClick={() => navigate(item.href)}
                                        >
                                            <div className="">
                                                <item.icon className="h-6 w-6"/>
                                            </div>
                                            <div className="sm:pr-20">
                                                {item.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                            
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
                }
            </div>
        </>
        
    );

}