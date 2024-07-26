import { useEffect, useState } from 'react';
import { PlusIcon, LinkIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/dateFormatter';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { ExclamationTriangleIcon, XCircleIcon} from "@heroicons/react/24/outline";
import { useSelector } from 'react-redux';
import Searchbar from '../components/Searchbar';
import { getAccessToken } from '../api/authApi';
import { getExpenses, deleteExpense } from '../api/expenseApi';

export default function ExpenseList() {

    const { isAdmin } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);

    const [displayedExpenses, setDisplayedExpenses] = useState([]);

    const [selectedExpense, setSelectedExpense] = useState(null);

    const [displayExpenseDeleteDialog, setDisplayExpenseDeleteDialog] = useState(false);

    const listCategories = [
        { name: 'Expense ID', value: '_id', searchable: true},
        { name: 'Date', value: 'date', searchable: false},
        { name: 'By', value: 'username', searchable: true},
        { name: 'Branch', value: 'branch', searchable: true}, 
        { name: 'Amount', value: 'expenseAmount', searchable: false},
        { name: 'Actions', value: 'actions', searchable: false}
    ]

    async function getAllExpenses() {
        try {
            const response = await getExpenses();
            return response
        } catch (error) {
            if (error.response.status == 401 && error.response.data === "Access token expired") {
                throw new Error("Access token expired");
                
            }
            navigate('/login');
            return;
        }
    }

    useEffect(() => {
        getAllExpenses().then((response) => {
            if (response) {
                setExpenses(response.data);
                setDisplayedExpenses(response.data);
            }
        }).catch((error) => {
            if (error.message === "Access token expired") {
                getAccessToken().then(() => {
                    return getAllExpenses()
                }).then((response) => {
                    if (response) {
                        setExpenses(response.data);
                        setDisplayedExpenses(response.data);
                    }
                });
            }
        });
    }, [expenses.length]);

    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(expenseId).then(() => {
                return getAllExpenses();
            }).then((data) => {
                if (data) {
                    setExpenses(data.data);
                    setDisplayedExpenses(data.data);
                }
            }).catch((error) => {
                if (error.response.status == 401 && error.response.data === "Access token expired") {
                    getAccessToken().then(() => {
                        return handleDeleteExpense(expenseId);
                    }).then((data) => {
                        if (data) {
                            setExpenses(data.data);
                            setDisplayedExpenses(data.data);
                        }
                    });
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const Expense = (props) => {
        return (
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {
                    listCategories.map((category) => {
                        if (category.value === "date") {
                            return (
                                <td key={category.value} className="h-16 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                    {formatDate(props.expense.date)}
                                </td>
                            );
                        } else if (category.name === "Actions") {
                            return (
                                <td key={category.value} className="h-16 space-x-2 items-center align-middle [&amp;:has([role=checkbox])]:pr-0">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/expense/${props.expense._id}`)}
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
                                                setSelectedExpense(props.expense);
                                                setDisplayExpenseDeleteDialog(true);
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
                                    {props.expense[category.value]}
                                </td>
                            );
                        }
                        
                    })
                } 
                
            </tr>
        );
    }

    function listExpenses() {
        if (displayedExpenses.length === 0) {
            return (
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td colSpan={listCategories.length} className="h-16 px-4 text-center align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        No expenses found
                    </td>
                </tr>
            );
        } else {
            return displayedExpenses.map((expense) => {
                return (
                    <Expense key={expense._id} expense={expense}></Expense>
                );
            });
        }
    }

    return (
        <>
            <>
                <Transition show={displayExpenseDeleteDialog}>
                    <Dialog className="relative z-10" onClose={setDisplayExpenseDeleteDialog}>
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
                                                        Remove {selectedExpense && selectedExpense._id} from records
                                                    </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                    Are you sure you want to remove {selectedExpense && selectedExpense._id}? All of the data in the record will be permanently removed. This action cannot be undone.
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
                                                handleDeleteExpense(selectedExpense._id).then(() => {
                                                    setSelectedExpense(null);
                                                    setDisplayExpenseDeleteDialog(false);
                                                });
                                            }}
                                        >
                                            Remove
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                setSelectedExpense(null);
                                                setDisplayExpenseDeleteDialog(false);
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
                    <h3 className="text-xl font-semibold p-4">Expenses</h3>
                    <div className="p-4">
                        <Searchbar setDisplay={setDisplayedExpenses} full={expenses} categories={listCategories} />
                    </div>
                    {
                        <div className="p-2">
                            <button
                                className="inline-flex items-center rounded-lg bg-white my-2 mr-16 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                    navigate('/expense')
                                }}
                            >
                                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Add Expense
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
                                {listExpenses()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        </>
    )

}