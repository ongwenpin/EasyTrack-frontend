import { useEffect, useState } from 'react';
import { LinkIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateFormatter';
import { XCircleIcon} from "@heroicons/react/24/outline";
import { useSelector } from 'react-redux';
import { getAccessToken } from '../api/authApi';
import { getRecords, deleteRecord } from '../api/recordApi';
import DeleteDialog from '../components/DeleteDialog';
import List from '../components/List';

export default function RecordsList() {

    const { isAdmin } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const [records, setRecords] = useState([]);

    const [displayedRecords, setDisplayedRecords] = useState([]);

    const listCategories = [
        {name: 'Record ID', value: '_id', searchable: true}, 
        {name: 'Date', value: 'date', searchable: false}, 
        {name: 'By', value: 'username', searchable: true}, 
        {name: 'Branch', value: 'branch', searchable: true}, 
        {name: 'Total Earnings', value: 'totalEarnings', searchable: false},
        {name: 'Actions', value: 'actions', searchable: false}
    ];

    async function fetchRecords() {
        try {
           const response = await getRecords();
           return response;
        } catch (error) {
            if (error.response.status == 401 && error.response.data === "Access token expired") {
                throw new Error("Access token expired");
                
            }
            navigate('/login');
            return;
        }
    }

    useEffect(() => {
        // Fetch records from the server
        fetchRecords().then((response) => {
            if (response) {
                setRecords(response.data);
                setDisplayedRecords(response.data);
            }
        }).catch((error) => {   
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return fetchRecords()
                }).then((response) => {
                    if (response) {
                        setRecords(response.data);
                        setDisplayedRecords(response.data);
                    }
                });
            }
        });
        
    }, [records.length]);

    function listRecords() {
        if (displayedRecords.length === 0) {
            return (
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td colSpan={listCategories.length} className="h-16 px-4 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        No records found
                    </td>
                </tr>
            );
        } else {
            return displayedRecords.map((record) => {
                return (
                    <Record key={record._id} record={record}></Record>
                );
            });
        }
    }

    const [selectedRecord, setSelectedRecord] = useState(null);

    const Record = (props) => {
        return (
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {
                    listCategories.map((category) => {
                        if (category.value === "date") {
                            return (
                                <td key={category.value} className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    {formatDate(props.record.date)}
                                </td>
                            );
                        } else if (category.name === "Actions") {
                            return (
                                <td key={category.value} className="h-16 space-x-2 items-center align-middle [&amp;:has([role=checkbox])]:pr-0">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/record/${props.record._id}`)}
                                        className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        <LinkIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        View
                                    </button>
                                    {
                                        isAdmin &&
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedRecord(props.record);
                                                setDisplayRecordDeleteDialog(true);
                                            }}
                                            className="inline-flex items-center rounded-lg bg-red-500 px-2 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-red-400 hover:bg-red-400"
                                        >
                                            <XCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
                                            Delete
                                        </button>
                                    }
                                </td>
                            );
                            
                        } else {
                            return (
                                <td key={category.value} className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    {props.record[category.value]}
                                </td>
                            );
                        }
                        
                    })
                } 
                
            </tr>
        );
    }

    const [displayRecordDeleteDialog, setDisplayRecordDeleteDialog] = useState(false);

    const handleDeleteRecord = async (id) => {
        try {
            const response = await deleteRecord(id).then(() => {
                return fetchRecords();
            }).then((response) => {
                if (response) {
                    setRecords(response.data);
                    setDisplayedRecords(response.data);
                }
            }).catch((error) => {
                if (error.response.status == 401 && error.response.data === "Access token expired") {
                    getAccessToken().then(() => {
                        return handleDeleteRecord(id);
                    }).then((response) => {
                        if (response) {
                            setRecords(response.data);
                            setDisplayedRecords(response.data);
                        }
                    });
                }
                throw error;
            });
        } catch (error) {
            throw error;
        }

    }

    return (
        <>
            <>
                <DeleteDialog
                    displayDialog={displayRecordDeleteDialog}
                    setDisplayDialog={setDisplayRecordDeleteDialog}
                    title={`Remove ${selectedRecord && selectedRecord._id} from records`}
                    message={`Are you sure you want to remove ${selectedRecord && selectedRecord._id}? All of the data in the record will be permanently removed. This action cannot be undone.`}
                    setSelected={setSelectedRecord}
                    handleDelete={handleDeleteRecord}
                    deleteTarget={selectedRecord && selectedRecord._id}
                />
            </>
            <>
                <List
                    setDisplay={setDisplayedRecords}
                    full={records}
                    listCategories={listCategories}
                    title="Records"
                    listRecords={listRecords}
                    createTitle="Add Record"
                    createLink="/record"
                />
            </>
        </>
    )


}