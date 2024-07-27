import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { logInStart, logInSuccess} from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { getAccessToken } from "../api/authApi";
import { loginUser } from "../api/authApi";

export function LoginPage() {

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">EasyTrack Login Page</h2>
            </div>
            <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            dispatch(logInStart());
                            const response = await loginUser(form);
                            dispatch(logInSuccess(response.data));
                            const access_token_response = await getAccessToken();
                            // Redirect to previous page or dashboard
                            const redirect = searchParams.get("redirect");
                            if (redirect !== null) {
                                navigate(redirect);
                            } else {
                                navigate("/");
                            }

                        } catch (error) {
                            setError(error.response.data.message);
                        }
                        
                    }
                
                }
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-md space-y-2 mx-2"
            >
                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username:</label>
                    <div className="mt-2">
                        <input 
                            id="username"  
                            value={form.username} 
                            onChange={e => {
                                    setForm(prev => ({...prev, username: e.target.value}))
                                }
                            }
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password:</label>
                    <input 
                        id="password"  
                        type="password" 
                        value={form.password} 
                        onChange={e=>{ 
                                setForm(prev => ({...prev, password: e.target.value}))
                            }
                            
                        }
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
                
            </form>
            <div>
                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account? 
                    <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign Up</a>
                </p>
            </div>
            <div>
                {error && <p className="text-red-700 mt-5 text-center">{ error }</p> }
            </div>
            
            
        </>
    )

}