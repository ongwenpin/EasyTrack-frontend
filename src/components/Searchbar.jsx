import { useState, useEffect } from "react";

export default function Searchbar(props) {

    const {setDisplay, full, categories} = props;

    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCategory, setSelectedCategory] = useState(categories[0].value);

    useEffect(() => {
        setIsLoading(true);
        if (searchQuery === "") {
            setDisplay(full);
            setIsLoading(false);
            return;
        } else {
            const filtered = full.filter((item) => {
                return item[selectedCategory].toLowerCase().includes(searchQuery.toLowerCase());
            });
            setDisplay(filtered);
        
        }

        setIsLoading(false);
    }, [searchQuery, selectedCategory]);

    return (
        <>
            <div className="flex flex-row space-x-2">

                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                    className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                    {
                        categories.map((category) => {
                            if (category.searchable) {
                                return (
                                    <option key={category.value} value={category.value}>{category.name}</option>
                                )
                            }
                        
                        })
                    }
                </select>
                <input
                    type="text"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-full sm:text-sm sm:leading-6"
                    placeholder="Search"
                >

                </input>
            </div>
        </>
    )


}