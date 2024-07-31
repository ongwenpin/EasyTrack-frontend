import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { LinkIcon } from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { getAccessToken } from "../api/authApi";
import { getUsers, deleteUser } from "../api/userApi";
import DeleteDialog from '../components/DeleteDialog';
import List from "../components/List";

export function UsersList() {

    const {isAdmin, currentUser} = useSelector((state) => state.user);

    const [userList, setUserList] = useState([]);

    const [displayUserList, setDisplayUserList] = useState([]);

    const listCategories = [
        {value: "username", name: "Username", searchable: true}, 
        {value: "email", name: "Email", searchable: true}, 
        {value: "branch", name: "Branch", searchable: true},
        {value: "action", name: "Action", searchable: false}
    ];

    const navigate = useNavigate();

    const [displayUserDeleteDialog, setDisplayUserDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDeleteUser = async (username) => {
        try {
            await deleteUser(username).then(() => {
                setUserList(userList.filter(user => user.username !== username));
            });
            return;
        } catch (error) {
            throw error;
        }

    };

    // Use for table in UsersList
    const UserRecord = (props) => (
        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {
                listCategories.map((category) => {
                    if (category.value === "action") {
                        return (
                            <td key={category.value} className="h-16 space-x-2 items-center align-middle [&amp;:has([role=checkbox])]:pr-0">
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

                        )

                    } else {
                        return (
                            <td key={category.value} className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                {props.user[category.value]}
                            </td>
                        )
                    }
                })
            }
            
        </tr>
    );

    async function fetchUsers() {
        try {
            const response = await getUsers();
            return response;
        } catch (error) {
            if (error.response.status == 401 && error.response.data === "Access token expired") {
                throw new Error("Access token expired");
                
            }
            navigate('/');
            return;
        }
    }

    useEffect(() => {
        
        fetchUsers().then((response) => {
            if (response) {
                setUserList(response.data);
                setDisplayUserList(response.data);
            }
        }).catch((error) => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return fetchUsers()
                }).then((response) => {
                    if (response) {
                        setUserList(response.data);
                        setDisplayUserList(response.data);
                    }
                });
            }
        });

    }, [userList.length]);

    function listUsers() {
        if (displayUserList.length === 0) {
            return (
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td colSpan={listCategories.length} className="h-16 px-4 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        No users found
                    </td>
                </tr>
            );
        } else {
            return displayUserList.map((user) => {
                return (
                    <UserRecord key={user._id} user={user}></UserRecord>
                );
            });
        }
    }

    return (
        <>
            <>
                <DeleteDialog
                    displayDialog={displayUserDeleteDialog}
                    setDisplayDialog={setDisplayUserDeleteDialog}
                    title={`Remove ${selectedUser && selectedUser.username} from users`}
                    message={`Are you sure you want to remove ${selectedUser && selectedUser.username}? All of the user's data will be permanently removed. This action cannot be undone.`}
                    setSelected={setSelectedUser}
                    handleDelete={handleDeleteUser}
                    deleteTarget={selectedUser && selectedUser.username}
                />
            </>
            <>
                <List
                    setDisplay={setDisplayUserList}
                    full={userList}
                    listCategories={listCategories}
                    title="Users"
                    listRecords={listUsers}
                    createTitle="Add User"
                    createLink="/user"
                />
            </>
        </>
    );

}

