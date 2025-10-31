"use client"
import { Card, CardContent } from "@/components/atoms/card"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { useForm } from 'react-hook-form'
import { Label } from "@/components/atoms/label"
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify';
import Image from "next/image"
import useGeneralStore from "@/lib/store/generalStore"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from 'next/navigation';
import { LoginSchema, loginSchema } from "@/lib/schema/auth.schema"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"
import { loginAction } from "@/lib/actions/auth.action"


export function LoginForm({
  className,
  redirectUrl,
  onSignupClick,
  onSuccess,
  ...props
}: React.ComponentProps<"form"> & { redirectUrl?: string, onSignupClick?: () => void, onSuccess?: () => void }) {

  const router = useRouter()
  const {
    register, handleSubmit, setError, formState: { errors },
  } = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema),
    mode: 'onSubmit',
  });


  const onSubmit = async (data: LoginSchema) => {
    try {
      useGeneralStore.setState({ generalIsLoading: true })
      const res = await loginAction(data);
      console.log({ res })
      if (!res.success) {
        throw new Error(res.error)
      }
      router.push("/private")
    } catch (error: any) {
      console.log({ error })
      setError('root', { message: error.message ? error.message : 'Something went wrong.' });
      toast.error(error.message ? error.message : 'Something went wrong.')
    } finally {
      useGeneralStore.setState({ generalIsLoading: false })
    }
  };

  const [showPassword, setShowPassword] = useState(false)


  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid  md:grid-cols-2 p-5 gap-6 ">

          <form
            onSubmit={handleSubmit((data) => onSubmit(data))}
            className={cn("flex flex-col gap-8 my-2 md:p-16", className)} {...props}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Login Now
              </p>
            </div>



            <div className="flex flex-col gap-2">
              <Label className="text-sm lg:text-medium" htmlFor="identifier">Email , username or phone number</Label>
              <Input placeholder="your identifier..." className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium" {...register("identifier")} />
              {(errors.identifier) ? (
                <p className="text-left text-sm text-red-400">
                  {errors.identifier?.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-start">
                <Label className="text-sm lg:text-medium" htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium pr-10"
                  placeholder="your password..."
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>              {(errors.password) ? (
                <p className="text-left text-sm text-red-400">
                  {errors.password?.message}
                </p>
              ) : null}
            </div>


            <Button type="submit" className="w-full">
              Login
            </Button>
            {(errors.root) ? (
              <p className="text-left text-sm text-red-400 m-auto">
                {errors.root?.message}
              </p>
            ) : null}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              {onSignupClick ? (
                <button
                  type="button"
                  onClick={onSignupClick}
                  className="underline underline-offset-4 hover:text-blue-800 transition-all cursor-pointer"
                >
                  Sign up
                </button>
              ) : (
                <Link
                  href="/signup"
                  className="underline underline-offset-4 hover:text-blue-800 transition-all cursor-pointer"
                >
                  Sign up
                </Link>
              )}
            </div>
          </form>
          <div className="bg-muted relative hidden md:block rounded-2xl">
            <Image src="/images/uuu.jpg" alt="auth" fill className=" object-cover rounded-2xl" />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking login, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
