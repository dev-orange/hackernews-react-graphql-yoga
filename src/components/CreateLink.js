import React, { useState } from 'react';
import {useMutation} from "urql";
import { useNavigate } from 'react-router-dom';

export const createLinkMutation = `
  mutation PostMutation(
    $description: String!
    $url: String!
  ) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
    const navigate = useNavigate();

    const [createLinkResult, createLink] = useMutation(createLinkMutation);

    const [formState, setFormState] = useState({
        description: '',
        url: ''
    });

    const { data, fetching, error } = createLinkResult;

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createLink(formState).then(() => navigate('/'));
                }}
            >
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={formState.description}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                description: e.target.value
                            })
                        }
                        type="text"
                        placeholder="A description for the link"
                    />
                    <input
                        className="mb2"
                        value={formState.url}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                url: e.target.value
                            })
                        }
                        type="text"
                        placeholder="The URL for the link"
                    />
                </div>
                <button disabled={fetching} type="submit">Submit {fetching && '(sending...)'}</button>
            </form>
        </div>
    );
};

export default CreateLink;