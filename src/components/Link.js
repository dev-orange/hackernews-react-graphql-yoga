import React from 'react';
import {timeDifferenceForDate} from '../utils';

const Link = (props) => {
    const {link} = props;

    return (
        <div className="ml1">
            <div>
                {link.description} ({link.url})
            </div>
            {(
                <div className="f6 lh-copy gray">
                    {timeDifferenceForDate(link.createdAt)}
                </div>
            )}
        </div>
    );
};

export default Link;
