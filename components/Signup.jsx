import React, { useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import Link from 'next/link';

function Signup() {

    const emailRef = useRef();
    const passwordRef = useRef();
    const usernameRef = useRef();
    // const passwordConfirmRef = useRef();
    const { signup } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value);
        // history.push("/");
    }

    return (
        <>
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" ref={emailRef}></input>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" ref={usernameRef}></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="********" ref={passwordRef}></input>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Sign In
                        </button>
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Signup;
