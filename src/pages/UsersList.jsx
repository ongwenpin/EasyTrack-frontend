import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { LinkIcon } from "@heroicons/react/20/solid";

export function UsersList() {

    const [userList, setUserList] = useState([]);

    const navigate = useNavigate();

    // Use for table in UsersList
    const UserRecord = (props) => (
        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <td className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">   
                {props.user.username}
            </td>
            <td className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                {props.user.name}
            </td>
            <td className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                {props.user.email}
            </td>
            <td className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                {props.user.branch}
            </td>
            <td>
                <button
                type="button"
                onClick={() => navigate(`/user/${props.user.username}`)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
                <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                View
            </button>
            </td>
        </tr>
    );

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get("http://localhost:5050/api/users", {withCredentials: true});
                setUserList(response.data);
            } catch (error) {
                console.log(error.response.status);
                if (error.response.status === 301) {
                    console.log(error.message);
                    
                }
            }
        }
        fetchUsers();

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
            <h3 className="text-lg font-semibold p-4">Users</h3>
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
    );

}

