import ChatWrapper from "@/components/Chat/ChatWrapper";
import { PdfRender } from "@/components/PdfRender";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileid: String;
  };
}
const Page = async ({ params }: PageProps) => {
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileid}`);
  }

  // get file from DB:
  const file = await db.file.findFirst({
    where: {
      id: fileid as string,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <>
      <div className="flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)]">
        <div className="mx-auto w-full  max-w-8xl grow lg:flex xl:px-2">
          {/* Left Side PDF VIEWER */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PdfRender fileUrl={file.url}/>
            </div>
          </div>
          <div className="relative shrink-0 flex-[0.75] border-2 h-screen  lg:w-96 lg:border-l lg:border-t-0 ">
            <ChatWrapper fileId={file.id}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
