import { searchBookSegments } from "@/lib/actions/book.actions";
import { connectToDatabase } from "@/database/mongoose";
import Book from "@/database/models/book.model";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-vapi-signature");
    const secret = process.env.VAPI_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Assuming the body has toolCalls array and userId
    const { toolCalls, userId } = body;

    if (!toolCalls || !Array.isArray(toolCalls) || !userId) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const results: string[] = [];

    for (const toolCall of toolCalls) {
      if (toolCall.name === "search book") {
        const parameters = toolCall.parameters;
        if (parameters === null || typeof parameters !== "object") {
          results.push("Invalid parameters for search book");
          continue;
        }

        const { hookId, query } = parameters;

        if (!hookId || !query) {
          results.push("Invalid parameters for search book");
          continue;
        }

        // Authorize: check if the book belongs to the user
        const book = await Book.findOne({
          _id: hookId,
          clerkId: userId,
        }).lean();
        if (!book) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const searchResult = await searchBookSegments(hookId, query, 3);

        if (searchResult.success && searchResult.data.length > 0) {
          // Return summaries instead of full content, limit to 200 chars per segment
          const summaries = searchResult.data
            .map((segment: any) => {
              const content = segment.content;
              return content.length > 200
                ? content.substring(0, 200) + "..."
                : content;
            })
            .join("\n\n");
          results.push(summaries);
        } else {
          results.push("no information found about topic");
        }
      }
    }

    // Assuming we return the first result or combine them
    const finalResult = results.join("\n\n");

    return NextResponse.json({ result: finalResult });
  } catch (e) {
    console.error("Error in search-book API", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
