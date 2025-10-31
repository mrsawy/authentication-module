"use client"
import Link from 'next/link';
import React from 'react';
import { NavUser } from '../molecules/nav-user';
import { ModeToggle } from '../molecules/theme-switcher';
import { IUser } from '@/lib/types/user.interface';
import { toast } from 'react-toastify';
import { Button } from '../atoms/button';
import { LogInIcon } from 'lucide-react';


const NavBar: React.FC<{ user?: IUser }> = ({ user }) => {
    const handlePrivateClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            toast.error('You need to log in first!');
            return;
        }
    };
    return (
        <div className="w-full  border-b-2">
            <div className='flex flex-row justify-between px-24 py-5 container mx-auto'>
                <Link
                    onClick={handlePrivateClick}
                    href='/private' className='text-xl underline underline-offset-1'>Private Page</Link>
                <NavUser user={user} />

                <div className='flex gap-2 justify-center items-center'>
                    {!user && <Link href="/login">
                        <Button
                            effect="expandIcon"
                            iconPlacement="right"
                            variant="outline"
                            icon={LogInIcon}
                        >
                            Login
                        </Button>
                    </Link>
                    }
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
};

export default NavBar;