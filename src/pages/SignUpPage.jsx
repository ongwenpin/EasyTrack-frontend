import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { signUpFailure, signUpStart, signUpSuccess } from "../redux/userSlice";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export function SignUpPage() {

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

    const [signupSuccess, setSignupSuccess] = useState(false);

    const dispatch = useDispatch();
    
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleResignUp = () => {
        setForm((prev) => ({
            ...prev,
            username: "",
            email:"",
            password: "",
            branch:"",
            dateofbirth:"",
            verified: false,
            role: "user"
        }));
        setSignupSuccess(prev => !prev);
    };

    return (
        <>
            <>  
                <Transition show={signupSuccess}>
                    <Dialog className="relative z-10" onClose={setSignupSuccess}>

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
                                            <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Sign Up Success
                                            </DialogTitle>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                Your account has been created successfully. Please login to continue.
                                                </p>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                            onClick={() => {
                                                setSignupSuccess(prev => !prev);
                                                navigate("/login");
                                            }}
                                        >
                                            Login
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                handleResignUp()
                                            }}
                                            data-autofocus
                                        >
                                            Sign Up Again
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
                <form onSubmit={async (e)=>{
                    e.preventDefault();
                    try {
                        dispatch(signUpStart());
                        const response = await axios.post("http://localhost:5050/api/signup", form);
                        console.log("User created successfully");
                        dispatch(signUpSuccess());
                        setSignupSuccess(prev => !prev);

                    } catch (error) {
                        if (error.response.data.code === 11000) {
                            setError("Username already exists. Please choose another username.");
                        } else {
                            setError(error.response.data.message);
                        }
                    }
                }}>
                    <div className="space-y-12 my-3 mx-3">
                        <div className="border-b border-gray-900/10 pb-12">
                            
                            <div className="mt-10 sm:grid sm:place-items-center sm:grid-cols-6 gap-x-6 gap-y-8 flex">
                                <div className="sm:col-span-6">
                                    <h1 className="text-xl font-semibold leading-7 text-gray-900">Registration</h1>
                                </div>
                                

                                <div className="sm:col-span-6">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username:</label>
                                    <input 
                                        id="username"  
                                        value={form.username}
                                        required
                                        onChange={e => {
                                                setForm(prev => ({...prev, username: e.target.value}))
                                            }
                                        }
                                        className="block w-80 flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <div className="sm:col-span-6">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email:</label>
                                    <input 
                                        id="email"  
                                        value={form.email}
                                        type="email"
                                        required
                                        onChange={e => {
                                                setForm(prev => ({...prev, email: e.target.value}))
                                            }
                                        }
                                        className="block w-80 flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                    />
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
                                        <input 
                                            id="password"  
                                            value={form.password}
                                            type="password"
                                            required
                                            onChange={e => {
                                                    setForm(prev => ({...prev, password: e.target.value}))
                                                }
                                            }
                                            className="block w-80 flex-1 rounded-md  border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                        />
                                </div>
                                
                                <div className="sm:col-span-6">
                                    <label htmlFor="branch" className="block text-sm font-medium leading-6 text-gray-900">Branch:</label>
                                    <div className="mt-2">
                                        <select 
                                            name="branch" 
                                            value={form.branch}
                                            style={{ width: '300px' }}
                                            required
                                            onChange={e => {setForm(prev => ({...prev, branch: e.target.value}))}}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-full sm:text-sm sm:leading-6"
                                        >
                                            <option></option>
                                            <option value="woodlands">Woodlands</option>
                                            <option value="jurong">Jurong</option>
                                            <option value="tampines">Tampines</option>
                                            <option value="cbd">CBD</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-6">
                                    <label htmlFor="dateofbirth" className="block text-sm font-medium leading-6 text-gray-900">Date of Birth:</label>
                                        <input 
                                            id="dateofbirth"  
                                            value={form.dateofbirth}
                                            type="date"
                                            required
                                            onChange={e => {
                                                    setForm(prev => ({...prev, dateofbirth: e.target.value}))
                                                }
                                            }
                                            className="block w-80 flex-1 rounded-md border-0 bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                        />
                                </div>

                                <div className="sm:col-span-6">
                                    <p className="text-red-700 mt-5 text-center">{ error }</p>
                                </div>

                                <div className="sm:col-span-6">
                                    <button style={{ width: '150px' }} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
                                </div>

                                <div className="sm:col-span-6">
                                    <p className="mt-10 text-center text-sm text-gray-500">
                                        Have an account? 
                                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Login</a>
                                    </p>
                                </div>
 
                            </div>               
                        </div>
                    </div>
                </form>
            </>
        </>
    )

}