"use client"
import { Card, CardContent } from "@/components/atoms/card"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { useForm } from 'react-hook-form'
import { Label } from "@/components/atoms/label"
import { yupResolver } from '@hookform/resolvers/yup'
import Image from "next/image"
import useGeneralStore from "@/lib/store/generalStore"
import { Combobox } from "@/components/molecules/combobox"
import { PhoneInput } from "@/components/organs/phone-input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { SignupSchema, signupSchema } from "@/lib/schema/auth.schema"
import { Country } from "@/lib/types/enum/country.enum"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils/cn"
import Link from "next/link"
import { signUpAction } from "@/lib/actions/auth.action"

export function SignupForm({
  redirectUrl,
  onSuccess,
  className, onLoginClick,
  ...props
}: React.ComponentProps<"form"> & { redirectUrl?: string, onLoginClick?: () => void, onSuccess?: () => void }) {

  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }, getValues
  } = useForm<SignupSchema>({
    resolver: yupResolver(signupSchema),
    mode: 'onSubmit',
    defaultValues: {
      country: Country.Egypt,
    },
  });


  const onSubmit = async (data: SignupSchema) => {
    try {
      useGeneralStore.setState({ generalIsLoading: true })
      const response = await signUpAction(data);
      if (!response.success) {
        const message = response.error;
        if (message.includes('username')) {
          return setError("username", { message: 'This username is already taken.' });
        }
        if (message.includes('email')) {
          return setError("email", { message: 'This email is already taken.' });
        }
        if (message.includes('phone')) {
          return setError("phone", { message: 'This phone number is already taken.' });
        }
        return toast.error(message)
      }
      router.push("/")
    } catch (error: any) {
      setError('root', { message: 'Something went wrong.' });
      toast.error(error.message ? error.message : 'Something went wrong.')
    } finally {
      useGeneralStore.setState({ generalIsLoading: false })
    }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid  md:grid-cols-2 p-5 gap-6 ">

          <form
            onSubmit={handleSubmit(onSubmit, (errors) => { console.log(getValues(), { errors }) })}
            className={cn("flex flex-col gap-6 lg:p-8", className)} {...props}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Create a new account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Register Now
              </p>
            </div>
            <div className="flex flex-col gap-4">

              <div className="flex gap-2 justify-between">
                <div className="flex flex-col gap-2 w-full">
                  <Label className="text-sm lg:text-medium" htmlFor="firstName">First Name</Label>
                  <Input placeholder="your first name..." className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium" {...register("firstName")} />
                  {(errors.firstName) ? (
                    <p className="text-left text-sm text-red-400">
                      {errors.firstName?.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label className="text-sm lg:text-medium" htmlFor="lastName">Last Name</Label>
                  <Input placeholder="your last name..." className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium" {...register("lastName")} />
                  {(errors.lastName) ? (
                    <p className="text-left text-sm text-red-400">
                      {errors.lastName?.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm lg:text-medium" htmlFor="email">Email</Label>
                <Input placeholder="your email..." className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium" {...register("email")} />
                {(errors.email ?? errors.root) ? (
                  <p className="text-left text-sm text-red-400">
                    {errors.email?.message}
                  </p>
                ) : null}
              </div>

              <div className="flex gap-2 justify-between flex-col lg:flex-row">
                <div className="flex flex-col gap-1 w-full">
                  <Label className="text-sm lg:text-medium" htmlFor="username">Username</Label>
                  <Input placeholder="Choose your username..." className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium" {...register("username")} />
                  {(errors.username) ? (
                    <p className="text-left text-sm text-red-400">
                      {errors.username?.message}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  {/* <Label className="text-sm lg:text-medium" htmlFor="phoneNumber">Phone Number</Label> */}
                  <PhoneInput
                    className="w-full"
                    // {...register("phoneNumber")}
                    onValueChange={(value) => setValue('phone', value)}
                  />
                  {(errors.phone) ? (
                    <p className="text-left text-sm text-red-400">
                      {errors.phone?.message}
                    </p>
                  ) : null}
                </div>
              </div>


              <div className="flex gap-2 justify-between ">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="country" className="text-sm lg:text-medium">Country</Label>
                  <Combobox
                    defaultValue={{ value: Country.Egypt, label: Country.Egypt }}
                    data={Object.values(Country).map(c => ({ value: c, label: c }))}
                    title="Select Country"
                    placeholder="Country ..."
                    onValueChange={(value) => setValue('country', value as Country)}
                  />
                  {(errors.country) ? (
                    <p className="text-left text-sm text-red-400">
                      {errors.country?.message}
                    </p>
                  ) : null}
                </div>


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
                </div>
                {(errors.password) ? (
                  <p className="text-left text-sm text-red-400">
                    {errors.password?.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-start">
                  <Label className="text-sm lg:text-medium" htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="placeholder:text-sm lg:placeholder:text-medium text-sm lg:text-medium pr-10"
                    placeholder="Confirm Your Password..."
                    {...register("confirmPassword")}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {(errors.confirmPassword) ? (
                  <p className="text-left text-sm text-red-400">
                    {errors.confirmPassword?.message}
                  </p>
                ) : null}
              </div>

              <Button type="submit" className="w-full mt-5">
                Sign Up
              </Button>
              {(errors.root) ? (
                <p className="text-left text-sm text-red-400 m-auto">
                  {errors.root?.message}
                </p>
              ) : null}
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}


              {onLoginClick ? (
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="underline underline-offset-4 hover:text-blue-800 transition-all cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <Link href="/login" className="underline underline-offset-4  hover:text-blue-800 transition-all cursor-pointer">
                  Login
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
        By clicking signup, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
