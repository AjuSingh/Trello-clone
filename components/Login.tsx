"use client";
import { useAuthModalStore } from "@/store/AuthModal";
import { useAuthStore } from "@/store/AuthStore";
import { Dialog, Transition } from "@headlessui/react";
import React, { FormEvent, Fragment, useState } from "react";

const Login = () => {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [signUp, setSignUp] = useState<boolean>(false)

    const [isOpen, closeModal] = useAuthModalStore((state) => [state.isOpen, state.closeModal]);
    const [user, creatUser] = useAuthStore((state) => [state.user, state.createUseOrLogin])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return;

        creatUser(email, password, signUp, name);

        setName('')
        setEmail('');
        setPassword('');
        closeModal();
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='form' onSubmit={e => handleSubmit(e)} onClose={closeModal} className={`relative z-10`}>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title
                                    as="h3"
                                    className='text-lg font-medium leading-6 text-gray-900 pb-2'
                                >
                                    {signUp ? "Sign Up" : "Login"}
                                </Dialog.Title>

                                {signUp && <div className='mt-2'>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder='Enter your Name'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'
                                    />
                                </div>
                                }

                                <div className='mt-2'>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Enter your email'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'
                                    />
                                </div>

                                <div className='mt-2'>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your password'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'
                                    />
                                </div>

                                <div className='mt-2'>
                                    <button
                                        type="submit"
                                        disabled={!email || !password}
                                        className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'
                                    >
                                        {signUp ? "Sign Up" : "Login"}
                                    </button>

                                    {!user && <span className='text-gray-500 text-sm ml-2 hover:underline cursor-pointer' onClick={() => setSignUp(!signUp)}>
                                        {!signUp ? "Sign Up" : "Login"}
                                    </span>}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    );
};



export default Login;