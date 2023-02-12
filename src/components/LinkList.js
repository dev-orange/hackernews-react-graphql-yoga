import React, {useCallback, useMemo, useState} from 'react';
import Link from './Link';
import {useQuery} from "urql";

// ①
const feedQuery = `
    query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
        feed(take: $take, skip: $skip, orderBy: $orderBy) {
            count
            links {
                id
                createdAt
                url
                description
                postedBy {
                    id
                    name
                }
            }
        }
    }
`;

// ②
const PAGE_SIZE = 2;
const LinkList = () => {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('desc');

    // ③
    const skip = useMemo(() => {
        return (page - 1) * PAGE_SIZE
    }, [page]);

    const [result] = useQuery({
        query: feedQuery,
        // ④
        variables: { skip, take: PAGE_SIZE, orderBy: { createdAt: sort } },
    });

    const { data, fetching, error } = result;

    // ⑤
    const nextPage = useCallback(() => {
        if (page <= data?.feed?.count / PAGE_SIZE) {
            setPage(page + 1)
        }
    }, [data?.feed?.count, page]);

    // ⑥
    const previousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1)
        }
    }, [page]);
    return (
        <div>
            {fetching && <p>Loading...</p>}
            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
            {data && (
                <>
                    <button
                        onClick={() => {
                            // ⑦
                            setSort(sort === 'desc' ? 'asc' : 'desc');
                        }}
                    >
                        {/*⑦*/}
                        { sort === 'desc' ? 'change to older' : 'change to latest' }
                    </button>
                    {
                        data.feed.links.map((link) => (
                            <Link key={link.id} link={link} />
                        ))
                    }
                    <div className="flex ml4 mv3 gray">
                        <div className="pointer mr2" onClick={previousPage}>
                            Previous
                        </div>
                        <div className="pointer" onClick={nextPage}>
                            Next
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LinkList;