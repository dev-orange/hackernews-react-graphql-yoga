import React, { useState } from 'react';
import Link from './Link';
import {useQuery} from "urql";

export const feedSearchQuery = `
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
      }
    }
  }
`;
const Search = () => {
    const [userInput, setUserInput] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [result] = useQuery({
        query: feedSearchQuery,
        variables: { filter: searchFilter },
    })

    const { data } = result;

    return (
        <>
            <div>
                Search
                <input
                    type="text"
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button onClick={() => { setSearchFilter(userInput) }}>OK</button>
            </div>
            {data &&
                data.feed.links.map((link, index) => (
                    <Link key={link.id} link={link} index={index} />
                ))}
        </>
    );
};

export default Search;