import { getAuthUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {

    const user = await getAuthUser();
    if (user) {
        return redirect('/')
    }

    return (
        <>
            {children}
        </>
    );
};

export default AuthLayout;