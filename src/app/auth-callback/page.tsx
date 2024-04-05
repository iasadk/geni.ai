"use client";
import { trpc } from "../_trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
const Page = () => {
  const params = useSearchParams();
  const router = useRouter();
  const origin = params.get("origin");

  // Check For Error handling in TRPC this error handling not working
  const { data } = trpc.authCallBack.useQuery(undefined, {
    retry: true,
    retryDelay: 1000,
  });
  if (data?.success) {
    // means user is synced to our DB
    router.push(origin ? `/${origin}` : "/dashboard");
  } else {
    // redirect to signup page.
    router.push("api/auth/register");
  }
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically</p>
      </div>
    </div>
  );
};

export default Page;
