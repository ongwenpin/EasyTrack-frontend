import Searchbar from "./Searchbar";
import { PlusIcon } from '@heroicons/react/20/solid';
import { useNavigate } from "react-router-dom";

{/* List component for list pages (e.g. RecordList, UserList, etc.) */}
export default function List(props) {

    const {setDisplay, full, listCategories, title, listRecords, createTitle, createLink} = props;

    const navigate = useNavigate();

    return (
        <>
            <div className="flex justify-between">
                    <h3 className="text-xl font-semibold p-4">{title}</h3>
                    <div className="p-4">
                        <Searchbar setDisplay={setDisplay} full={full} categories={listCategories} />
                    </div>
                    {
                        <div className="p-2">
                            <button
                                className="inline-flex items-center rounded-lg bg-white my-2 mr-16 px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                onClick={() => {
                                    navigate(createLink)
                                }}
                            >
                                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                {createTitle}
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
    )
}