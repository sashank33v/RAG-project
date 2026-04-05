import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-center px-12 xl:px-20">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Second Brain
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight xl:text-5xl">
            Build your second brain
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400 xl:text-lg">
            Store knowledge, search across files, and chat with your data in one premium workspace.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none bg-transparent",
                },
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
