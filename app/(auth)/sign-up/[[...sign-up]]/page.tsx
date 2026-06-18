import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 p-6">
        <div className="text-center">
          <div className="mb-2 text-2xl font-semibold text-ring">SkillHub</div>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              cardBox: { width: '100%', boxShadow: 'none' },
            },
          }}
        />

        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-ring no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
