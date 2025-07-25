import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

const useAppSideBar = () => {
  const session = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          {
            router.push("/login");
          }
        },
      },
    });
  };

  return { session, pathname, signOut };
};

export default useAppSideBar;
