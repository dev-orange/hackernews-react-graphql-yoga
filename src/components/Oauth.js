import {useSearchParams} from "react-router-dom";
import {useMutation} from "urql";
import {useEffect} from "react";

export const signupOrLoginWithGithubMutation = `
  mutation SignupOrLoginWithGithubMutation(
    $code: String!
  ) {
    signupOrLoginWithGithub(code: $code) {
        token
    }
  }
`;

const Oauth = () => {
    const [searchParams] = useSearchParams();

    const [,login] = useMutation(signupOrLoginWithGithubMutation);

    useEffect(() => {
        const code = searchParams.get('code');

        if (code) {
            login({code}).then(({data}) => {
                localStorage.setItem('token', data.signupOrLoginWithGithub.token);
                window.location.href = '/';
            });
        }

    }, [])

  return (
      <div>
          Login form github....please wait for a moment
      </div>
  )
}

export default Oauth;