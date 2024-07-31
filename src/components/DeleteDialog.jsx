import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon  } from "@heroicons/react/24/outline";
import ButtonLoading from './ButtonLoading';

{/* Delete Dialog for list pages (e.g. RecordList, UserList, etc.) */}
export default function DeleteDialog(props) {

    const {displayDialog, setDisplayDialog, title, message, setSelected, handleDelete, deleteTarget} = props;

    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sentRequest, setSentRequest] = useState(false);

    return (
        <>
            <Transition show={displayDialog}>
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
                                            <div className="sm:flex sm:items-start">
                                                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${success ? "bg-green-100" : "bg-red-100"} sm:mx-0 sm:h-10 sm:w-10`}>
                                                    {
                                                        sentRequest
                                                        ? success
                                                            ? <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                            : <XCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                        : <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                    }
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        {
                                                            sentRequest
                                                            ? success
                                                                ? "Request Success"
                                                                : "Request Failed"
                                                            : title
                                                        }
                                                    </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            sentRequest
                                                            ? success
                                                                ? "The request to delete the record was successful."
                                                                : `The request to delete the record failed. Please try again.`
                                                            : message
                                                        }
                                                    </p>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 h-16">
                                            {
                                                sentRequest
                                                ? <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    className="mt-3 inline-flex w-full h-10 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => {
                                                        setSelected(null);
                                                        setSuccess(false);
                                                        setSentRequest(false);
                                                        setDisplayDialog(false);
                                                    }}
                                                    data-autofocus
                                                >
                                                    Close
                                                </button>
                                                : <>
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        className="inline-flex w-full max-w-20 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                        onClick={() => {
                                                            setIsLoading(true);
                                                            handleDelete(deleteTarget).then(() => {
                                                                setSuccess(true);
                                                            }).catch((error) => {
                                                                setSuccess(false);
                                                                console.error(error);
                                                            }).finally(() => {
                                                                setIsLoading(false);
                                                                setSentRequest(true);
                                                            });
                                                        }}
                                                    >
                                                        {
                                                            isLoading 
                                                            ? <ButtonLoading />
                                                            : <span className={`${isLoading ? "ml-3" : ""}`}>Remove</span>
                                                        }
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        className="mt-3 inline-flex w-full h-10 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                        onClick={() => {
                                                            setSelected(null);
                                                            setDisplayDialog(false);
                                                        }}
                                                        data-autofocus
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            }
                                            
                                        </div>

                                    </DialogPanel>
                                
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}