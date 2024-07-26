import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { formatDate } from '../utils/dateFormatter';
import { getAccessToken } from '../api/authApi';
import { getExpense, createExpense, updateExpense } from "../api/expenseApi";

export default function Expense() {

    const { currentUser } = useSelector(state => state.user);

    const [isNewExpense, setIsNewExpense] = useState(true);

    const [isEditing, setIsEditing] = useState(false);

    const param = useParams();

    const navigate = useNavigate();

    const [expenseId, setExpenseId] = useState("");

    const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

    const supportingImageRef = useRef(null);

    const [showSupportingImagePreviewDialog, setShowSupportingImagePreviewDialog] = useState(false);

    const [expenseForm, setExpenseForm] = useState({
        username: currentUser.username,
        date: new Date().toISOString().split('T')[0],
        branch: currentUser.branch,
        expenseName: "",
        expenseAmount: 0,
        remarks: "",
        supportingImage: "",
        supportingImageName: "",
        supportingImageKey: "" ,
        supportingImageUrl: ""
    });

    async function fetchExistingExpense(id) {
        try {
            const response = await getExpense(id);
            return response.data;
        } catch (error) {
            if (error.response.status == 401 && error.response.data === "Access token expired") {
                throw new Error("Access token expired");
                
            }
            navigate('/login');
            return;
        } 
    }

    function handleSetExpense(expense) {
        setExpenseForm(prev => ({
            username: expense.username,
            date: formatDate(expense.date),
            branch: expense.branch,
            expenseName: expense.expenseName,
            expenseAmount: expense.expenseAmount,
            remarks: expense.remarks,
            supportingImage: "",
            supportingImageName: expense.supportingImageName,
            supportingImageKey: expense.supportingImageKey,
            supportingImageUrl: expense.supportingImageUrl
        }))
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setExpenseForm(prev => ({
                    ...prev,
                    supportingImage: file, 
                    supportingImageName: file.name, 
                    supportingImageUrl: reader.result, 
                    supportingImageKey: ""
                }))
            };
        }
        
    }

    useEffect(() => {
        const id = param.id?.toString() || undefined;
        if (!id) {
            setIsEditing(true);
            return;
        }
        setExpenseId(id);
        setIsNewExpense(false);
        fetchExistingExpense(id).then((expense) => {
            if (expense) {
                handleSetExpense(expense);
            }
        }).catch((error) => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return fetchExistingExpense(id)
                }).then((expense) => {
                    if (expense) {
                        handleSetExpense(expense);
                    }
                });
            }
        });

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("username", expenseForm.username);
            formData.append("date", expenseForm.date);
            formData.append("branch", expenseForm.branch);
            formData.append("expenseName", expenseForm.expenseName);
            formData.append("expenseAmount", expenseForm.expenseAmount);
            formData.append("remarks", expenseForm.remarks);
            formData.append("supportingImage", expenseForm.supportingImage);
            formData.append("supportingImageName", expenseForm.supportingImageName);
            formData.append("supportingImageKey", expenseForm.supportingImageKey);
            formData.append("supportingImageUrl", expenseForm.supportingImageUrl);

            if (isNewExpense) {
                const response = await createExpense(formData);
                setExpenseId(response.data._id);
                return response;
            } else {
                const response = await updateExpense(expenseId, formData);
            }

        } catch (error) {
            console.log(error);
        }

    }
    

    return (
        <>
            <>
                <Transition show={showSupportingImagePreviewDialog}>
                    <Dialog className="relative z-10" onClose={() => {}}>
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
                                <div className="sm:flex sm:items-center justify-center">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <img src={expenseForm.supportingImageUrl} alt="Supporting Image" className="w-96 h-96"/>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            setShowSupportingImagePreviewDialog(false);
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
                                        Expense record Successfully {isNewExpense ? "Created" : "Updated"}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Your expense record has been successfully {isNewExpense ? "created" : "updated"}.
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
                                        fetchExistingExpense(expenseId).then((expense) => {
                                            navigate(`/expense/${expenseId}`);
                                            if (isNewExpense) {
                                                setIsNewExpense(false);
                                            }
                                        }).catch((error) => {
                                            console.log(error);
                                        });
                                        setIsEditing(false);
                                        setShowSubmitSuccess(false);
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
                <form onSubmit={ (e) => {
                    handleSubmit(e).then((res) => {
                        setShowSubmitSuccess(true);
                    }).catch((error) => {   
                        console.log(error);
                    });
                    
                }}>
                    
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                        
                                <div className="flex justify-around my-5 text-bold text-center items-center p-2">
                                    <h2 className="text-xl font-semibold leading-7 text-gray-900">{isNewExpense ? "New Expense" : `Expense: ${expenseId}`}</h2>
                                </div>

                                <div className="flex justify-center space-x-5 my-5 text-bold text-center items-center p-2">
                                    {
                                        !isNewExpense && !isEditing &&
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={() => {
                                                setIsEditing(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    }
                                    {
                                        (isNewExpense || (!isNewExpense && isEditing) ) &&
                                        <button
                                            type="submit"
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Submit
                                        </button>
                                    }
                                    {   
                                        !isNewExpense && isEditing &&
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => {
                                                fetchExistingExpense(param.id).then((expense) => {
                                                    setExpenseForm(expense);
                                                }).catch((error) => {
                                                    console.log(error);
                                                }).finally(() => {
                                                    setIsEditing(false);
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    }
                                </div>
                 
                                <div className="mt-10 grid justify-items-center grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8">
                                    
                                    <div className="sm:col-span-2">
                                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                            Username
                                        </label>
                                        <div className="mt-2">
                                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    disabled={!isEditing}
                                                    value={expenseForm.username}
                                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                    required
                                                    onChange={e => {
                                                        setExpenseForm(prev => ({...prev, username: e.target.value}))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="branch" className="block text-sm font-medium leading-6 text-gray-900">Branch:</label>
                                        <select 
                                                name="branch" 
                                                value={expenseForm.branch}
                                                disabled={!isEditing}
                                                required
                                                onChange={e => {
                                                    setExpenseForm(prev => ({...prev, branch: e.target.value}))
                                                }}
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
                                        <label htmlFor="expensedate" className="block text-sm font-medium leading-6 text-gray-900">Record Date:</label>
                                        <input 
                                            id="expensedate"  
                                            value={expenseForm.date}
                                            disabled={!isEditing}
                                            required
                                            type="date"
                                            onChange={e => {
                                                    setExpenseForm(prev => ({...prev, date: e.target.value}))
                                                }
                                            }
                                            className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="expenseAmount" className="block text-sm font-medium leading-6 text-gray-900">Expense Amount:</label>
                                        <input 
                                            id="expenseAmount"  
                                            value={expenseForm.expenseAmount}
                                            disabled={!isEditing}
                                            required
                                            type="number"
                                            onChange={e => {
                                                    setExpenseForm(prev => ({...prev, expenseAmount: e.target.value}))
                                                }
                                            }
                                            className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="expenseName" className="block text-sm font-medium leading-6 text-gray-900">Expense Name:</label>
                                        <input 
                                            id="expenseName"  
                                            value={expenseForm.expenseName}
                                            disabled={!isEditing}
                                            required
                                            type="text"
                                            onChange={e => {
                                                    setExpenseForm(prev => ({...prev, expenseName: e.target.value}))
                                                }
                                            }
                                            className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label htmlFor="supportingImage" className="block text-sm font-medium leading-6 text-gray-900">Supporting Image:</label>
                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={supportingImageRef}
                                            accept="image/*"
                                            onChange={e => {
                                                handleFileUpload(e);
                                            }}
                                        >
                                        </input>
                                        <div className="flex flex-row space-x-2 text-semibold text-nowrap text-center align-middle">
                                            <button
                                                type="button"
                                                disabled={!isEditing}
                                                className="inline-flex items-center rounded-lg bg-white my-2 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                onClick={() => {
                                                    supportingImageRef.current.click();
                                                }}
                                            >
                                                Upload
                                            </button>
                                            {
                                                expenseForm.supportingImageName !== "" &&
                                                <>
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-lg bg-white my-2 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        onClick={() => {
                                                            setShowSupportingImagePreviewDialog(true);
                                                        }}
                                                    >
                                                        Preview
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={!isEditing}
                                                        className="inline-flex items-center rounded-lg bg-red-500 my-2 mr-16 px-2 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400"
                                                        onClick={() => {
                                                            setExpenseForm(prev => ({
                                                                ...prev,
                                                                supportingImage: "", 
                                                                supportingImageName: "", 
                                                                supportingImageUrl: "", 
                                                                supportingImageKey: ""
                                                            }))
                                                        }}
                                                    >
                                                        Delete Image
                                                    </button>

                                                </>
                                            }
                                            <div className="mt-4 text-md">
                                                {
                                                    expenseForm.supportingImage === "" && expenseForm.supportingImageName === ""
                                                    ? "No file chosen"
                                                    : expenseForm.supportingImageName
                                                }
                                            </div>
                                            
                                            
                                        </div>

                                    </div>

                                    <div className="sm:col-span-3">
                                        <div>
                                            <label htmlFor="remarks" className="block text-sm font-medium leading-6 text-gray-900">Remarks:</label>
                                            <textarea 
                                                id="remarks"  
                                                value={expenseForm.remarks}
                                                onChange={e => {
                                                        setExpenseForm(prev => ({...prev, remarks: e.target.value}))
                                                    }
                                                }
                                                rows={3}
                                                className="block w-96 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                </div>
                                
                            </div>
                        </div>
                    

                </form>
            </>
        </>
    )


}