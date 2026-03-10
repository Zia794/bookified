import { searchBookSegments } from "@/lib/actions/book.actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Assuming the body has toolCalls array
    const { toolCalls } = body;

    if (!toolCalls || !Array.isArray(toolCalls)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const results: string[] = [];

    for (const toolCall of toolCalls) {
      if (toolCall.name === "search book") {
        const { hookId, query } = toolCall.parameters;

        if (!hookId || !query) {
          results.push("Invalid parameters for search book");
          continue;
        }

        const searchResult = await searchBookSegments(hookId, query, 3);

        if (searchResult.success && searchResult.data.length > 0) {
          const combinedContent = searchResult.data
            .map((segment: any) => segment.content)
            .join("\n\n");
          results.push(combinedContent);
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
