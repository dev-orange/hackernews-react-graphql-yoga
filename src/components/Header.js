import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AUTH_TOKEN } from '../constants';

const Header = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem(AUTH_TOKEN);

    return (
        <div className="flex pa1 justify-between nowrap orange">
            <div className="flex flex-fixed black">
                <Link to="/" className="no-underline black">
                    <div className="fw7 mr1">Hacker News</div>
                </Link>
                <Link to="/" className="ml1 no-underline black">
                    new
                </Link>
                <div className="ml1">|</div>
                <Link
                    to="/search"
                    className="ml1 no-underline black"
                >
                    search
                </Link>
                {authToken && (
                    <div className="flex">
                        <div className="ml1">|</div>
                        <Link
                            to="/create"
                            className="ml1 no-underline black"
                        >
                            submit
                        </Link>
                    </div>
                )}
            </div>
            <div className="flex flex-fixed black">
                {authToken ? (
                    <div
                        className="ml1 pointer black"
                        onClick={() => {
                            localStorage.removeItem(AUTH_TOKEN);
                            navigate(`/`);
                        }}
                    >
                        logout
                    </div>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="ml1 no-underline black"
                        >
                            login
                        </Link>
                        <div className="ml1 black">|</div>
                        <Link
                            // TODO: 这里需要添加你的 github client id
                            to="https://github.com/login/oauth/authorize?client_id={在这里替换，包括花括号也要替换掉}&redirect_uri=http://localhost:3000/oauth/redirect"
                            className="ml1 no-underline black"
                        >
                            login with github
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;