import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
    CheckIcon,
    PencilIcon 
} from '@heroicons/react/20/solid';

import { useNavigate } from "react-router-dom";
import { changeUsernameSuccess } from "../redux/userSlice";

export function User() {

    const [form, setForm] = useState({
        username: "",
        name:"",
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

    async function fetchUsers() {
        const username = params.username;
        setOriginalUser(prev => username);
        const link = `http://localhost:5050/api/users/` + username;
        const response = await axios.get(link, {withCredentials: true});
        
        const date = new Date(response.data.dateofbirth);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        
        // Combine them into the desired format
        const formattedDate = `${year}-${month}-${day}`;

        const user = {...response.data, dateofbirth: formattedDate};
        setForm(user);

    }
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleEditingMode = () => {
        setIsEditing(prev => !prev);
    };


    return (
        <>
            <form onSubmit={async (e)=>{
                e.preventDefault()
                try {
                    const response = await axios.patch("http://localhost:5050/api/users/" + originalUser, form, {withCredentials: true});
                    console.log("User updated successfully");
                    if (originalUser !== form.username) {
                        navigate("/user/" + form.username);
                        changeUsernameSuccess(form.username);
                    }
                    toggleEditingMode();
                } catch (error) {
                    e.stopPropagation();
                    console.log(error.response.data);
                }
                    
            }}>
                <div className="border-b border-gray-900/10 pb-12 ml-7">

                    <div className="flex justify-center mb-5">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">User Profile</h2>
                    </div>
                    

                    <div className="sm:col-span-1 flex justify-center">
                        {!isEditing && <div className="sm:col-span-4">
                        <button
                            type="button"
                            onClick={() => {
                                toggleEditingMode();
                            }}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Edit
                        </button>
                        </div>}

                        {isEditing && <div className="sm:col-span-1">
                            <button 
                                type="button"
                                onClick={() => {
                                    toggleEditingMode();
                                    fetchUsers();
                                }}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Cancel Edit
                                </button>
                        </div>}
                    </div>

                    <fieldset disabled={!isEditing} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        
                        <div className="sm:col-span-2">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username:</label>
                            <input
                                id="username"  
                                value={form.username}
                                onChange={e => {
                                        setForm(prev => ({...prev, username: e.target.value}))
                                    }
                                }
                                className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name:</label>
                            <input 
                                id="name"  
                                value={form.name}
                                onChange={e => {
                                        setForm(prev => ({...prev, name: e.target.value}))
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
                                type="email"
                                onChange={e => {
                                        setForm(prev => ({...prev, email: e.target.value}))
                                    }
                                }
                                className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
                            <input 
                                id="password"  
                                value={form.password}
                                type="password"

                                onChange={e => {
                                        setForm(prev => ({...prev, password: e.target.value}))
                                    }
                                }
                                className="block flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="branch" className="block text-sm font-medium leading-6 text-gray-900">Branch:</label>
                            <select 
                                    name="branch" 
                                    value={form.branch}
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

                        <div className="sm:col-span-2">
                            <label htmlFor="dateofbirth" className="block text-sm font-medium leading-6 text-gray-900">Date of Birth:</label>
                            <input 
                                id="dateofbirth"  
                                value={form.dateofbirth}
                                type="date"
                                onChange={e => {
                                        setForm(prev => ({...prev, dateofbirth: e.target.value}))
                                    }
                                }
                                className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                            />
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

                        {isEditing 
                            ? <div className="sm:col-span-6 flex justify-center">
                                <button type="submit" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    <CheckIcon className="-ml-1.5 mr-1.5 h-5 w-7" aria-hidden="true" />
                                    Confirm Changes
                                </button>
                            </div> 
                            : <div className="sm:col-span-1"></div>
                        }

                    </fieldset>
                    
                </div>
                
            </form>
        </>
    );






}