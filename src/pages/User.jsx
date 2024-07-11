import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
    CheckIcon,
    PencilIcon, 
} from '@heroicons/react/20/solid';

import { useNavigate } from "react-router-dom";
import { changeUsernameSuccess } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { formatDate } from "../utils/dateFormatter";
import { getAccessToken } from "../utils/auth";

export function User() {

    const {isAdmin} = useSelector((state) => state.user);

    const [form, setForm] = useState({
        username: "",
        email:"",
        password: "",
        branch:"",
        dateofbirth:"",
        verified: false,
        role: "user"
    });

    const params = useParams();

    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);

    const [originalUser, setOriginalUser] = useState("");

    const [isNewUser, setIsNewUser] = useState(true);

    const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

    async function fetchUserData() {

        try {
            const username = params.username;
        
            const link = `http://localhost:5050/api/users/` + username;
            const response = await axios.get(link, {withCredentials: true});
            
            const formattedDate = formatDate(response.data.dateofbirth);

            const user = {...response.data, dateofbirth: formattedDate};
            return user;

        } catch (error) {
            if (error.response.status == 401 && error.response.data === "Access token expired") {
                throw new Error("Access token expired");
                
            }
            navigate("/login");
            return;
        }

    }
    
    useEffect(() => {
        const username = params.username?.toString() || undefined;
        if (!username) {
            setIsEditing(true);
            return;
        }

        setIsNewUser(false);

        fetchUserData().then(user => {
            setForm(user);
            setOriginalUser(user.username);
        }).catch(error => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return fetchUserData();
                }).then((user) => {
                    setForm(user);
                    setOriginalUser(user.username);
                })
            }
            
        });

    }, []);

    const toggleEditingMode = () => {
        setIsEditing(prev => !prev);
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            if (isNewUser) {
                const response = await axios.post("http://localhost:5050/api/users", form, {withCredentials: true});
                navigate("/user/" + form.username);
                changeUsernameSuccess(form.username);
            } else {
                const response = await axios.patch("http://localhost:5050/api/users/" + originalUser, form, {withCredentials: true});
                if (originalUser !== form.username) {
                    navigate("/user/" + form.username);
                    changeUsernameSuccess(form.username);
                }

            }
            
        } catch (error) {
            console.log(error.response.data);
        }
    }


    return (
        <>
            <>
                <Transition show={showSubmitSuccess}>
                    <Dialog className="relative z-10" onClose={setShowSubmitSuccess}>
                        <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </TransitionChild>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <TransitionChild
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        User Successfully {isNewUser ? "Created" : "Updated"}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            User has been successfully {isNewUser ? "created" : "updated"}.
                                        </p>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={() => {
                                        setShowSubmitSuccess(false);
                                        navigate("/users")
                                    }}
                                    data-autofocus
                                >
                                    Close
                                </button>
                                </div>
                            </DialogPanel>
                            </TransitionChild>
                        </div>
                        </div>
                    </Dialog>
                </Transition>
            </>

            <>
                <form 
                    onSubmit={(e) => {
                    handleSubmitUser(e).then(() => {
                        toggleEditingMode();
                        setShowSubmitSuccess(true);
                    }).catch(error => {
                        console.log(error);
                    });
                    className="p-5"
                }}>
                    <div className="border-2 border-gray-900/10 p-10 pt-5 m-5 rounded-lg">

                        <div className="flex justify-center my-3 text-bold text-center">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">User Profile</h2>
                        </div>
                        

                        <div className="sm:col-span-1 flex justify-center">
                            {!isEditing && isAdmin && 
                                <div className="sm:col-span-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toggleEditingMode();
                                        }}
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />      
                                        Edit User
                                    </button>
                                </div>
                            }

                            {isEditing 
                                ? <div className="sm:col-span-3 flex justify-center space-x-4">
                                    <button type="submit" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        <CheckIcon className="-ml-1.5 mr-1.5 h-5 w-7" aria-hidden="true" />
                                        Confirm
                                    </button>
                                    {   
                                        !isNewUser &&
                                        <div className="sm:col-span-3">
                                            <button 
                                                type="button"
                                                onClick={() => {  
                                                    fetchUserData().then(user => {
                                                        setForm(user);
                                                        toggleEditingMode();
                                                    }).catch(error => {
                                                        console.log(error);
                                                    });
                                                }}
                                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                >
                                                    Cancel 
                                            </button>
                                        </div>
                                    }
                                </div> 
                                : <div className="sm:col-span-1"></div>
                            }

                        </div>

                        <fieldset disabled={!isEditing} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            
                            <div className="sm:col-span-2">
                                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username:</label>
                                <input
                                    id="username"  
                                    value={form.username}
                                    required
                                    onChange={e => {
                                            setForm(prev => ({...prev, username: e.target.value}))
                                        }
                                    }
                                    className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email:</label>
                                <input 
                                    id="email"  
                                    value={form.email}
                                    required
                                    type="email"
                                    onChange={e => {
                                            setForm(prev => ({...prev, email: e.target.value}))
                                        }
                                    }
                                    className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                />
                            </div>

                            {
                                isNewUser &&
                                <div className="sm:col-span-2">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
                                    <input 
                                        id="password"  
                                        value={form.password}
                                        required
                                        type="password"

                                        onChange={e => {
                                                setForm(prev => ({...prev, password: e.target.value}))
                                            }
                                        }
                                        className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            }

                            <div className="sm:col-span-2">
                                <label htmlFor="dateofbirth" className="block text-sm font-medium leading-6 text-gray-900">Date of Birth:</label>
                                <input 
                                    id="dateofbirth"  
                                    value={form.dateofbirth}
                                    required
                                    type="date"
                                    onChange={e => {
                                            setForm(prev => ({...prev, dateofbirth: e.target.value}))
                                        }
                                    }
                                    className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="branch" className="block text-sm font-medium leading-6 text-gray-900">Branch:</label>
                                <select 
                                        name="branch" 
                                        value={form.branch}
                                        required
                                        onChange={e => {setForm(prev => ({...prev, branch: e.target.value}))}}
                                        className="block flex-1 rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-full sm:text-sm sm:leading-6"
                                >
                                    <option></option>
                                    <option value="woodlands">Woodlands</option>
                                    <option value="jurong">Jurong</option>
                                    <option value="tampines">Tampines</option>
                                    <option value="cbd">CBD</option>
                                </select>
                            </div>

                            
                            
                            {
                                !isNewUser && 
                                <>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">Role:</label>
                                        <select 
                                                name="role" 
                                                value={form.role}
                                                onChange={e => {setForm(prev => ({...prev, role: e.target.value}))}}
                                                className="block flex-1 rounded-md border-0 py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-full sm:text-sm sm:leading-6"
                                        >
                                            <option></option>
                                            <option value="admin">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2 flex flex-row items-center">
                                        <label htmlFor="verified" className="block text-sm font-medium leading-6 text-gray-900 mr-2">Status:</label>
                                        {form.verified
                                            ? <h2 className="text-green-500 text-sm">
                                                Verified
                                            </h2>
                                            : <h2 className="text-red-500 textsm">
                                                Not Verified
                                            </h2>
                                        }
                                    </div>    
                                </>
                            }

                            

                        </fieldset>
                        
                    </div>
                    
                </form>
            </>
        </>
        
    );






}