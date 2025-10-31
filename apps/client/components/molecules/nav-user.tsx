"use client"

import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/atoms/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu"
import useGeneralStore from "@/lib/store/generalStore"
import { logout } from "@/lib/actions/auth.action"
import { IUser } from "@/lib/types/user.interface"
import { Button } from "../atoms/button"

export function NavUser({
    user,
}: {
    user?: IUser
}) {
    if (!user) return null
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-muted-foreground hover:text-white"
                    role="button"
                >
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                        {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                        <AvatarFallback className="rounded-lg">{user.firstName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user.firstName}</span>
                        <span className="text-zinc-50 truncate text-xs">
                            {user.email}
                        </span>
                    </div>
                    <IconDotsVertical className="ml-auto size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                            <AvatarFallback className="rounded-lg">{user.firstName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.firstName}</span>
                            <span className="text-muted-foreground truncate text-xs">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <IconUserCircle />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconCreditCard />
                        Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconNotification />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={
                    async () => {
                        try {
                            useGeneralStore.setState({ generalIsLoading: true })
                            const response = await logout()
                            if (!response.success) {
                                throw new Error(response.error)
                            }
                        } catch (error) {
                            console.error({ error })
                        } finally {
                            useGeneralStore.setState({ generalIsLoading: false })
                        }

                    }}>
                    <IconLogout />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
