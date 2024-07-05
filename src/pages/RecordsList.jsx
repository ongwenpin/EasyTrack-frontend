import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusIcon, LinkIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateFormatter';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import { useSelector } from 'react-redux';
import Searchbar from '../components/Searchbar';

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
           const response = await axios.get('http://localhost:5050/api/records', {withCredentials: true});
           return response;
        } catch (error) {
            if (error.response.status == 301) {
                navigate('/login');
                return;
            }
            console.error(error);
        }
    }

    useEffect(() => {
        // Fetch records from the server
        fetchRecords().then((response) => {
            if (response) {
                setRecords(response.data);
                setDisplayedRecords(response.data);
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
            const response = await axios.delete(`http://localhost:5050/api/records/${id}`, {withCredentials: true}).then(() => {
                return fetchRecords();
            }).then((response) => {
                setRecords(response.data);
                setDisplayedRecords(response.data);
            });
        } catch (error) {
            console.error(error);
        }

    }

    return (
        <>
            <>
                <Transition show={displayRecordDeleteDialog}>
                    <Dialog className="relative z-10" onClose={setDisplayRecordDeleteDialog}>
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
                                                        Remove {selectedRecord && selectedRecord._id} from records
                                                    </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                    Are you sure you want to remove {selectedRecord && selectedRecord._id}? All of the data in the record will be permanently removed. This action cannot be undone.
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
                                                handleDeleteRecord(selectedRecord._id).then(() => {
                                                    setSelectedRecord(null);
                                                    setDisplayRecordDeleteDialog(false);
                                                });
                                            }}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                setSelectedRecord(null);
                                                setDisplayRecordDeleteDialog(false);
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
                    <h3 className="text-lg font-semibold p-4">Records</h3>
                    <div className="p-4">
                        <Searchbar setDisplay={setDisplayedRecords} full={records} categories={listCategories} />
                    </div>
                    {
                        <div className="p-2">
                            <button
                                className="inline-flex items-center rounded-lg bg-white my-2 mr-16 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                    navigate('/record')
                                }}
                            >
                                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Add Record
                            </button>
                        </div>

                    }
                    
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&amp;_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    {
                                        listCategories.map((category) => {
                                            return (
                                                <th key={category.value} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                    {category.name}
                                                </th>
                                            );
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody className="[&amp;_tr:last-child]:border-0">
                                {listRecords()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        </>
    )


}