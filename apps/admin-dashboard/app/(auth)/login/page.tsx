import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-display font-extrabold text-primary-foreground text-xl">
            T
          </div>
          <span className="font-display font-bold tracking-tight text-foreground text-lg">
            Trifusion Operations
          </span>
        </div>

        <LoginForm />

        <p className="px-8 text-center text-xs text-muted-foreground">
          Need an account?{" "}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary transition-colors">
            Register Organization
          </Link>
        </p>
      </div>
    </div>
  );
}
