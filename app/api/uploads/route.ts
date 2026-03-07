import { MAX_FILE_SIZE } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";
import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(request : Request): Promise<NextResponse>{
  const body = (await request.json()) as HandleUploadBody;
  try{
    const jsonResponse = await handleUpload({
      token:process.env.BLOB_READ_WRITE_TOKEN,
      body, 
      request,
      onBeforeGenerateToken: async() => {
      const {userId} = await auth();
      if(!userId){
        throw new Error("Un-Authorized : User not authenticated");
      };
      return{
        allowedContentTypes:['application/pdf', 'image/jpeg', 'image/png' , 'image/webp'],
        addRandomSuffix: true,
        maximumSizeInBytes: MAX_FILE_SIZE,
        tokenPayload: JSON.stringify({userId})
      }
    },
      onUploadCompleted:async({blob , tokenPayload}) => {
        console.log("File uploaded to blob " , blob.url)
        const payLoad = tokenPayload ? JSON.parse(tokenPayload): null
        const userId = payLoad?.userId
      }
  });
  return NextResponse.json(jsonResponse);

  }catch(e){
    const message = e instanceof Error ? e.message : "An unknown error occured";
    const status = message.includes('UnAuthorized') ? 401 : 500;
    return NextResponse.json({error: message} , {status});
  }
}