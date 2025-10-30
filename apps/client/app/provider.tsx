'use client';

import React, { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Loader from '@/components/organs/loader';
import { ModeToggle } from '@/components/molecules/theme-switcher';
import Link from 'next/link';
import { NavUser } from '@/components/molecules/nav-user';

type ProviderProps = {
    children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
    return (
        <div>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >

                {children}
            </NextThemesProvider>

            <ToastContainer theme="dark" />
            <Loader />
        </div>
    );
}