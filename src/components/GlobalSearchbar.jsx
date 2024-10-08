import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/dateFormatter";
import { getAccessToken } from "../api/authApi";
import { getQuery } from "../api/searchApi";

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

    const [displaySearchResults, setDisplaySearchResults] = useState(false);

    const [searchResults, setSearchResults] = useState({
        users: [],
        records: []
    });

    const searchBarRef = useRef(null);

    useEffect(() => {

        function handleSearchBarClick(event) {
            if (!searchBarRef.current.contains(event.target)) {
                setDisplaySearchResults(false);
            } else if (searchBarRef.current.contains(event.target)) {
                setDisplaySearchResults(true);
            }
        }

        document.addEventListener("click", handleSearchBarClick);

        return () => {
            document.removeEventListener("click", handleSearchBarClick);
        }

    }, []);

    async function getSearchResult(query) {
        try {
            const response = await getQuery(query);
            return response;
        } catch (error) {
            if (error.response.status == 401 && error.response.data === "Access token expired") {
                throw new Error("Access token expired");
                
            }
            navigate('/');
            return;
        }
    }

    const debouncedSearch = debounce((searchQuery) => {
        getSearchResult(searchQuery)
            .then((response) => {
                if (response) {
                    setSearchResults(response.data);
                    setDisplaySearchResults(true);
                }
            })
            .catch((error) => {
                if (error.message === "Access token expired") {
                    getAccessToken().then(() => {
                        return getSearchResult(searchQuery)
                    }).then((response) => {
                        if (response) {
                            setSearchResults(response.data);
                            setDisplaySearchResults(true);
                        }
                    });
                    return;
                }
                console.error("Error fetching search results: ", error);
            });
    }, 500);

    const SearchResultCard = (props) => {

        if (props.type === "user") {

            return (
                <div 
                    className="hover:bg-gray-100 p-1"
                    onClick={() => {
                        navigate(`/user/${props.user.username}`);
                    }}
                >
                    {props.user.username}
                </div>
            )

        } else if (props.type === "record") {
                
                return (
                    <div 
                    className="hover:bg-gray-100 p-1 text-sm"
                    onClick={() => {
                        navigate(`/record/${props.record._id}`);
                    }}
                >
                        <div className="flex flex-col">
                            <div>
                                {props.record._id}
                            </div>

                            <div className="flex flex-row space-x-2">
                                <div>
                                    {props.record.username}
                                </div>
                                <div>
                                    {props.record.branch}
                                </div>
                                <div>
                                    {formatDate(props.record.date)}
                                </div>
                            </div>
                        </div>

                    </div>
                )
        }

    }

    function listAllSearchResults() {
        return (
            <div className="flex flex-col p-2">
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-semibold">Users</h1>
                    </div>
                    {
                        searchResults.users.map((user) => {
                            return <SearchResultCard key={user.username} type="user" user={user} />
                        })
                    }
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-semibold">Records</h1>
                    </div>
                    
                    {
                        searchResults.records.map((record) => {
                            return <SearchResultCard key={record._id} type="record" record={record} />
                        })
                    }
                </div>
            </div>
        )
    }

    return (
        <>
            <div 
                className="relative sm:w-full max-w-md"
                ref={searchBarRef}
            >
                <input
                    type="text"
                    onChange={(e) => {
                        if (e.target.value !== "") {
                            debouncedSearch(e.target.value);
                        } else {
                            setDisplaySearchResults(false);
                        }
                    }}
                    className="max-w-md w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Search for users or records..."
                >
                </input>

                {
                    displaySearchResults &&
                    <div className="h-96 overflow-y-scroll max-w-md sm:w-full sm:absolute sm:right-auto right-20 z-10 bg-white rounded-md border-0 shadow-sm ring-1 ring-inset ring-gray-300">
                        {listAllSearchResults()}
                    </div>
                }
            </div>
            
        </>
    )


}