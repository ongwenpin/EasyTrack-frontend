import { useEffect, useState } from "react";
import { getBranches, createBranch, removeBranch } from "../api/branchApi";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
    
    const [isEditing, setIsEditing] = useState(false);

    const [branches, setBranches] = useState([]);

    const [displayBranchDeleteDialog, setDisplayBranchDeleteDialog] = useState(false);

    const [displayCreateBranchDialog, setDisplayCreateBranchDialog] = useState(false);

    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        getBranches()
            .then(response => {
                setBranches(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    },[]);

    const Branch = (props) => {
        return (
            <tr className="font-semibold text-center border border-gray-900/25">
                <td className="p-2">{props.branch.branchName}</td>
                <td className="p-2">
                    <button
                        className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400 disabled:bg-red-400"
                        onClick={() => {
                            setSelectedBranch(props.branch);
                            setDisplayBranchDeleteDialog(true);
                        }}
                    >
                        Remove
                    </button>
                </td>
            </tr>
        );
    }

    function listAllBranches() {
        return branches.map((branch) => {
            return <Branch key={branch._id} branch={branch} />;
        });
    }

    return (
        <>
            <>
                <Transition show={displayBranchDeleteDialog}>
                    <Dialog className="relative z-10" onClose={setDisplayBranchDeleteDialog}>
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
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Remove "{selectedBranch && selectedBranch.branchName}" Branch from the list?
                                                    </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                    Are you sure you want to remove "{selectedBranch && selectedBranch.branchName}" ? All of the data in the record will be permanently removed. This action cannot be undone.
                                                    </p>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => {
                                                removeBranch(selectedBranch._id)
                                                    .then(() => {
                                                        setBranches(branches.filter(branch => branch._id !== selectedBranch._id));
                                                        setSelectedBranch(null);
                                                    })
                                                    .catch(error => {
                                                        console.error(error);
                                                    }).finally(() => {
                                                        setDisplayBranchDeleteDialog(false);
                                                    });
                                            }}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                setDisplayBranchDeleteDialog(false);
                                            }}
                                            data-autofocus
                                        >
                                            Cancel
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
                <Transition show={displayCreateBranchDialog}>
                    <Dialog className="relative z-10" onClose={setDisplayCreateBranchDialog}>
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
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <PlusCircleIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                                                </div>
                                                <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Add Branch
                                                    </DialogTitle>
                                                    <div className="mt-2">
                                                        <form
                                                            className="border rounded-md p-4"
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                const branchName = e.target.branchName.value;
                                                                createBranch({ branchName: branchName })
                                                                    .then(response => {
                                                                        setBranches([...branches, response.data]);
                                                                    })
                                                                    .catch(error => {
                                                                        console.error(error);
                                                                    }).finally(() => {
                                                                        setDisplayCreateBranchDialog(false);
                                                                    });
                                                            }}
                                                        >
                                                            <div>
                                                                <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 pb-2">Branch Name</label>
                                                                <input
                                                                    type="text"
                                                                    name="branchName"
                                                                    id="branchName"
                                                                    className="w-full border border-gray-900/25 rounded-md p-2"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="mt-4">
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                >
                                                                    Add Branch
                                                                </button>
                                                            </div>
                                                        </form>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => {
                                                    setDisplayCreateBranchDialog(false);
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
                <div className="border-2 border-gray-900/10 p-10 pt-10 m-5 rounded-lg flex flex-col space-y-4">
                    <div className="">
                        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                    </div>
                    <form className="flex flex-col space-y-4">
                        <div className="flex flex-row space-x-2 items-center">
                            {
                                isEditing &&
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Save
                                </button>
                            }
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </button>
                            
                        </div>
                        <div className="">
                            <fieldset
                                className="border-2 border-gray-900/10 p-5 rounded-lg flex flex-col space-y-4"
                                disabled={!isEditing}
                            >
                                <div className="flex flex-col space-y-2">
                                    <div className="w-1/2 flex flex-row justify-between space-x-2">
                                        <label htmlFor="branches" className="block text-md font-medium text-gray-700 pb-2">Branches</label>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:bg-gray-50"
                                            onClick={() => setDisplayCreateBranchDialog(true)}
                                        >
                                            Add Branch
                                        </button>
                                    </div>
                                    
                                    <table className="w-1/2 text-sm border border-gray-900/25">
                                        <thead className="border border-gray-900/25">
                                            <tr>
                                                <th className="p-2">Branch</th>
                                                <th className="p-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listAllBranches()}
                                        </tbody>
                                    </table>
                                </div>


                            </fieldset>
                        </div>
                        
                    </form>
                </div>
            </>
            
        </>
    )
}