import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome Customers" description="Create an account and enjoy your favorite food">
            <Head title="Log in" />

            <form className="flex flex-col gap-4" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email"
                            className="rounded-full h-12 px-4"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2 relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="rounded-full h-12 px-4 pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOffIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="h-4 w-4 rounded-sm"
                        />
                        <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</Label>
                    </div>

                                        <Button
                        type="submit"
                        className="w-full h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing ? 'Please wait...' : 'Sign in'}
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-500 my-2">
                    Sign in with
                </div>

                <div className="flex gap-2 justify-center">
                    <button
                        type="button"
                        className="flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
                        <span>Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                        </svg>
                        <span>Facebook</span>
                    </button>
                </div>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Have Already Account? {" "}
                    <TextLink href={route('register')} className="text-blue-600 font-medium" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mt-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
