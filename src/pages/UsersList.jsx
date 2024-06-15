import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { LinkIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon, XCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

export function UsersList() {

    const {isAdmin, currentUser} = useSelector((state) => state.user);

    const [userList, setUserList] = useState([]);

    const navigate = useNavigate();

    const [displayUserDeleteDialog, setDisplayUserDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDeleteUser = async (username) => {
        try {
            await axios.delete(`http://localhost:5050/api/users/${username}`, {withCredentials: true}).then(() => {
                setUserList(userList.filter(user => user.username !== username));
            });
            return;
        } catch (error) {
            console.log(error);
        }

    };

    // Use for table in UsersList
    const UserRecord = (props) => (
        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <td className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">   
                {props.user.username}
            </td>
            <td className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                {props.user.name}
            </td>
            <td className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                {props.user.email}
            </td>
            <td className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                {props.user.branch}
            </td>
            <td className="h-16 space-x-2 items-center align-middle [&amp;:has([role=checkbox])]:pr-0">
                <button
                    type="button"
                    onClick={() => navigate(`/user/${props.user.username}`)}
                    className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    View
                </button>
                
                {isAdmin && props.user.username !== currentUser.username &&
                
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedUser(props.user);
                            setDisplayUserDeleteDialog(true);
                        }}
                        className="inline-flex items-center rounded-lg bg-red-500 px-2 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-red-400 hover:bg-red-400"
                    >
                        <XCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
                        Delete
                    </button>
                }

            </td>
        </tr>
    );

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get("http://localhost:5050/api/users", {withCredentials: true});
                return response;
            } catch (error) {
                console.log(error.response.status);
                if (error.response.status === 301) {
                    console.log(error.message);
                    
                }
            }
        }
        fetchUsers().then((response) => {
            setUserList(response.data);
        }).catch((error) => {
            console.log(error);
        });

    }, []);

    function listUsers() {
        return userList.map((user) => {
            return (
                <UserRecord key={user._id} user={user}></UserRecord>
            );
        });
    }

    return (
        <>
            <>
                <Transition show={displayUserDeleteDialog}>
                    <Dialog className="relative z-10" onClose={setDisplayUserDeleteDialog}>
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
                                                        Remove {selectedUser && selectedUser.username} from users
                                                    </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                    Are you sure you want to remove {selectedUser && selectedUser.username}? All of the user's data will be permanently removed. This action cannot be undone.
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
                                                handleDeleteUser(selectedUser.username).then(() => {
                                                    setDisplayUserDeleteDialog(false);
                                                    setSelectedUser(null);
                                                })
                                            }}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                setDisplayUserDeleteDialog(false);
                                                setSelectedUser(null);
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
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold p-4">Users</h3>
                    {
                        isAdmin &&
                        <button
                            className="inline-flex items-center rounded-lg bg-white my-2 mr-16 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => {
                                navigate("/user");
                            }}
                        >
                            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                            Add user
                        </button>

                    }
                    
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&amp;_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    Username
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    Name
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    Email
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    Branch
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&amp;_tr:last-child]:border-0">
                                {listUsers()}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </>
        </>
    );

}

