import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { formatDate } from '../utils/dateFormatter';


export default function Record() {

    const { currentUser } = useSelector(state => state.user);

    const [isNewRecord, setIsNewRecord] = useState(true);

    const [isEditing, setIsEditing] = useState(false);

    const param = useParams();

    const [recordId, setRecordId] = useState("");

    const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

    const [supportingImageRefs, setSupportingImageRefs] = useState([]);

    const [recordForm, setRecordForm] = useState({
        username: currentUser.username,
        date: new Date().toISOString().split('T')[0],
        branch: currentUser.branch,
        totalEarnings: 0,
        earningBreakdown: [{name: "Retail", amount: 0, supportingImage: "", supportingImageName: "", supportingImageURL: "", supportingImageKey: ""}],
        remarks: ""
    });

    useEffect(() => {
        setSupportingImageRefs(recordForm.earningBreakdown.map((_, i) => supportingImageRefs[i] || React.createRef()));
    }, [recordForm.earningBreakdown]);

    async function fetchRecord(id) {
        try {
            const response = await axios.get(`http://localhost:5050/api/records/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    function handleSetRecord(record) {
        setRecordForm(prev => ({
            username: record.username,
            date: formatDate(record.date),
            branch: record.branch,
            totalEarnings: record.totalEarnings,
            earningBreakdown: record.earningBreakdown,
            remarks: record.remarks
        }));
    } 

    useEffect(() => {
        const id  = param.id?.toString() || undefined;
        if (!id) {
            setIsEditing(true);
            return;
        }
        setRecordId(id);
        setIsNewRecord(false);
        fetchRecord(id).then((record) => {
            if (record) {
                handleSetRecord(record);
            }
        });

    }, []);


    const handleFileUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setRecordForm(prev => ({
                ...prev,
                earningBreakdown: prev.earningBreakdown.map((earning, i) => {
                    if (i === index) {
                        return {...earning, supportingImage: file, supportingImageName: file.name, supportingImageURL: "", supportingImageKey: ""}
                    }
                    return earning;
                })
            }))
        }
        
    }

    const listAllEarningsBreakdown = () => {

        return recordForm.earningBreakdown.map((earning, index) => {
            return (
                <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted space-x-4">
                    <td className="h-12 p-4 text-center align-middle [&amp;:has([role=checkbox])]:pr-0"> 
                        <input
                            value={earning.name}
                            type="text"
                            className="flex w-36 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                            required
                            onChange={e => {
                                setRecordForm(prev => ({
                                    ...prev,
                                    earningBreakdown: prev.earningBreakdown.map((earning, i) => {
                                        if (i === index) {
                                            return {...earning, name: e.target.value}
                                        }
                                        return earning;
                                    })
                                }))
                            }}
                        >
                        </input>
                    </td>
                    <td className="h-12 p-4 text-center align-middle [&amp;:has([role=checkbox])]:pr-0"> 
                        <input
                            value={earning.amount}
                            type="number"
                            className="flex w-36 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                            required
                            onChange={e => {
                                setRecordForm(prev => ({
                                    ...prev,
                                    earningBreakdown: prev.earningBreakdown.map((earning, i) => {
                                        if (i === index) {
                                            return {...earning, amount: e.target.value}
                                        }
                                        return earning;
                                    })
                                }))
                            }}
                        >
                        </input>
                    </td>
                    <td className="h-12 p-4 items-center align-middle [&amp;:has([role=checkbox])]:pr-0">
                        <input
                            type="file"
                            className="hidden"
                            ref={supportingImageRefs[index]}
                            accept="image/*"
                            onChange={e => {
                                handleFileUpload(e, index);
                            }}
                        >
                        </input>
                        <div className="flex flex-row space-x-2 text-semibold text-nowrap text-center align-middle">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-lg bg-white my-2 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                    supportingImageRefs[index].current.click();
                                }}
                            >
                                Upload
                            </button>
                            <div className="mt-4 text-md">
                                {
                                    earning.supportingImage === "" && earning.supportingImageName === ""
                                    ? "No file chosen"
                                    : earning.supportingImageName
                                }
                            </div>
                            
                        </div>
                        
                    </td>
                    <td className="h-12 items-center align-middle [&amp;:has([role=checkbox])]:pr-0">
                        <div className="flex items-center align-middle h-full w-36">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-lg bg-red-500 my-2 mr-16 px-2 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400"
                                onClick={() => {
                                    setRecordForm(prev => ({
                                        ...prev,
                                        earningBreakdown: prev.earningBreakdown.filter((_, i) => i !== index)
                                    }))
                                }}
                            >
                                Delete
                            </button>
                        </div>
                        
                    </td>
                </tr>
            );
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (isNewRecord) {
                const formData = new FormData();
                formData.append("username", recordForm.username);
                formData.append("date", recordForm.date);
                formData.append("branch", recordForm.branch);
                formData.append("totalEarnings", recordForm.totalEarnings);
                recordForm.earningBreakdown.forEach((earning, index) => {
                    formData.append(`earningBreakdown-name-${index}`, earning.name);
                    formData.append(`earningBreakdown-amount-${index}`, earning.amount);
                    formData.append(`earningBreakdown-supportingImage-${index}`, earning.supportingImage);
                });
                formData.append("earningBreakdownLength", recordForm.earningBreakdown.length);
                const response = await axios.post("http://localhost:5050/api/records", formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                });
                
            } else {
                const formData = new FormData();
                formData.append("username", recordForm.username);
                formData.append("date", recordForm.date);
                formData.append("branch", recordForm.branch);
                formData.append("totalEarnings", recordForm.totalEarnings);
                recordForm.earningBreakdown.forEach((earning, index) => {
                    formData.append(`earningBreakdown-name-${index}`, earning.name);
                    formData.append(`earningBreakdown-amount-${index}`, earning.amount);
                    formData.append(`earningBreakdown-supportingImage-${index}`, earning.supportingImage);
                    formData.append(`earningBreakdown-supportingImageName-${index}`, earning.supportingImageName);
                    //formData.append(`earningBreakdown-supportingImageURL-${index}`, earning.supportingImageURL);
                    formData.append(`earningBreakdown-supportingImageKey-${index}`, earning.supportingImageKey);
                });
                formData.append("earningBreakdownLength", recordForm.earningBreakdown.length);
                formData.append("remarks", recordForm.remarks);
                const response = await axios.patch(`http://localhost:5050/api/records/${recordId}`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                });
                
            }
            

        } catch (error) {
            e.stopPropagation();
            console.log(error);
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
                                        Record Successfully {isNewRecord ? "Created" : "Updated"}
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Your record has been successfully {isNewRecord ? "created" : "updated"}.
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
                                        fetchRecord(recordId).then((record) => {
                                            
                                        }).catch((error) => {
                                            console.log(error);
                                        });
                                        if (!isNewRecord) {
                                            setIsEditing(false);
                                        }
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
                    handleSubmit(e).then(() => {
                        setShowSubmitSuccess(true);
                    }).catch((error) => {   
                        console.log(error);
                    });
                    
                }}>
                    
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                        
                                <div className="flex justify-around my-5 text-bold text-center items-center p-2">
                                    <h2 className="text-lg font-semibold leading-7 text-gray-900">{isNewRecord ? "New Record" : `Record: ${recordId}`}</h2>
                                </div>

                                <div className="flex justify-center space-x-5 my-5 text-bold text-center items-center p-2">
                                    {
                                        !isNewRecord && !isEditing &&
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
                                        (isNewRecord || (!isNewRecord && isEditing) ) &&
                                        <button
                                            type="submit"
                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Submit
                                        </button>
                                    }
                                    {   
                                        !isNewRecord && isEditing &&
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            onClick={() => {
                                                fetchRecord(param.id).then((record) => {
                                                    setRecordForm(record);
                                                    setIsEditing(false);
                                                }).catch((error) => {
                                                    console.log(error);
                                                });
                                                setIsEditing(false);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    }
                                </div>

                                <fieldset disabled={!isEditing}>
                                
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
                                                        autoComplete="username"
                                                        value={recordForm.username}
                                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                        required
                                                        onChange={e => {
                                                            setRecordForm(prev => ({...prev, username: e.target.value}))
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="sm:col-span-2">
                                            <label htmlFor="branch" className="block text-sm font-medium leading-6 text-gray-900">Branch:</label>
                                            <select 
                                                    name="branch" 
                                                    value={recordForm.branch}
                                                    required
                                                    onChange={e => {
                                                        setRecordForm(prev => ({...prev, branch: e.target.value}))
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
                                            <label htmlFor="recorddate" className="block text-sm font-medium leading-6 text-gray-900">Record Date:</label>
                                            <input 
                                                id="recorddate"  
                                                value={recordForm.date}
                                                required
                                                type="date"
                                                onChange={e => {
                                                        setRecordForm(prev => ({...prev, date: e.target.value}))
                                                    }
                                                }
                                                className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="totalEarnings" className="block text-sm font-medium leading-6 text-gray-900">Total Earnings:</label>
                                            <input 
                                                id="totalEarnings"  
                                                value={recordForm.totalEarnings}
                                                required
                                                type="number"
                                                onChange={e => {
                                                        setRecordForm(prev => ({...prev, totalEarnings: e.target.value}))
                                                    }
                                                }
                                                className="block flex-1 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                            />
                                        </div>

                                        <div className="sm:col-span-8">
                                            <div className="mt-2 flex flex-col rounded-lg border border-dashed border-gray-900/25 px-6 py-8">
                                                <div className="flex justify-between items-center">

                                                    <div className="flex items-center align-center">
                                                        <label htmlFor="earningBreakdown" className="block text-base font-medium leading-6 text-gray-900 text-center">Earning Breakdown:</label>
                                                    </div>
                                                    
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-lg bg-white my-2 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        onClick={() => {
                                                            setRecordForm(prev => ({
                                                                ...prev,
                                                                earningBreakdown: prev.earningBreakdown.concat([{name: "", amount: 0, supportingImage: ""}])
                                                            }));
                                                            
                                                        }}
                                                    >
                                                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        Add
                                                    </button>
                                                </div>
                                                
                                                <table className="w-full caption-bottom text-sm border border-gray-900/25">
                                                    <thead className="[&amp;_tr]:border-b">
                                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                            <th className="h-12 w-36 px-6 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                                Name
                                                            </th>
                                                            <th className="h-12 w-36 px-6 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                                Amount
                                                            </th>
                                                            <th className="h-12 w-36 px-6 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                                Supporting Image
                                                            </th>
                                                            <th className="h-12 w-36 px-6 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                                
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="[&amp;_tr:last-child]:border-0">
                                                        {listAllEarningsBreakdown()}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-8">
                                            <div>
                                                <label htmlFor="remarks" className="block text-sm font-medium leading-6 text-gray-900">Remarks:</label>
                                                <textarea 
                                                    id="remarks"  
                                                    value={recordForm.remarks}
                                                    onChange={e => {
                                                            setRecordForm(prev => ({...prev, remarks: e.target.value}))
                                                        }
                                                    }
                                                    rows={3}
                                                    className="block w-96 border-0 rounded-md bg-transparent py-1.5 pl-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            
                                        </div>
                                    
                                    </div>

                                </fieldset>
                                
                            </div>
                        </div>
                    

                </form>
            </>
        </>
    )


}