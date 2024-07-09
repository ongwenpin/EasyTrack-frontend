import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
}

export default function GlobalSearchbar(props) {

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    const [displaySearchResults, setDisplaySearchResults] = useState(false);

    const [searchResults, setSearchResults] = useState({
        users: [],
        records: []
    });

    async function getSearchResult(query) {
        try {
            const response = await axios.get(`http://localhost:5050/api/search/?query=${query}`, { withCredentials: true });
            return response;
        } catch (error) {
            console.error("Error fetching search results: ", error);
        }
    }

    const debouncedSearch = debounce((searchQuery) => {
        getSearchResult(searchQuery)
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((error) => {
                console.error("Error fetching search results: ", error);
            });
    }, 500);

    useEffect(() => {
        if (searchQuery != "") {
            debouncedSearch(searchQuery);
            setDisplaySearchResults(true);
        } else {
            setDisplaySearchResults(false);
        }
        
    }, [searchQuery.length]);

    const SearchResultCard = (props) => {

        if (props.type === "user") {

            return (
                <div 
                    className="hover:bg-gray-100"
                    onClick={() => {
                        navigate(`/user/${props.username}`);
                    }}
                >
                    {props.username}
                </div>
            )

        } else if (props.type === "record") {
                
                return (
                    <div 
                    className="hover:bg-gray-100"
                    onClick={() => {
                        navigate(`/record/${props._id}`);
                    }}
                >
                        {props._id}
                    </div>
                )
        }

    }

    function listAllSearchResults() {
        return (
            <div className="flex flex-col p-2">
                <div className="flex flex-col">
                    <h1 className="font-semibold">Users</h1>
                    {
                        searchResults.users.map((user) => {
                            return <SearchResultCard type="user" username={user.username} />
                        })
                    }
                </div>
                <div className="flex flex-col">
                    <h1 className="font-semibold">Records</h1>
                    {
                        searchResults.records.map((record) => {
                            return <SearchResultCard type="record" _id={record._id} />
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="relative sm:w-full max-w-md">
                <input
                    type="text"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Search for users or records..."
                >
                </input>

                {
                    displaySearchResults &&
                    <div className="max-w-md sm:w-full sm:absolute sm:right-auto right-20 z-10 bg-white rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300">
                        {listAllSearchResults()}
                    </div>
                }
            </div>
            
        </>
    )


}