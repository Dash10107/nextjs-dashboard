'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { SyntheticEvent, FormEvent, useState } from 'react';
import Link from 'next/link';

export default function SignupForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append('action', 'signup'); // Add action as signin to the form data
    try {
      await dispatch(formData);
    } catch (error) {
      console.error('Error during Signup:', error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please signup to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Enter your Name"
                 required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className='mt-4'>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                 required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="my-4  ">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                 required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-6 w-6 text-gray-500" />
        ) : (
          <EyeIcon className="h-6 w-6 text-gray-500" />
        )}
      </button>
            </div>
          </div>
        </div>
        <LoginButton />
        <div className="flex justify-center items-center mt-4">
        <p className="text-md text-gray-600">
          Already A User?{' '}
          <Link href="/login" className='text-blue-600  hover:underline'>Login here</Link>
        </p>
      </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
 
function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button className="mt-8 w-full" aria-disabled={pending}>
      Signup <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}