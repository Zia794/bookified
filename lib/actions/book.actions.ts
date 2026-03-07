"use server";

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";





export const getAllBooks = async (search?: string) => {
  try {
    await connectToDatabase();

    // let query = {};

    // if (search) {
    //   const escapedSearch = escapeRegex(search);
    //   const regex = new RegExp(escapedSearch, "i");
    //   query = {
    //     $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }],
    //   };
    // }

    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (e) {
    console.error("Error connecting to database", e);
    return {
      success: false,
      error: e
    };
  }
};







export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(title);
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }
    return {
      exists: false,
    };
  } catch (e) {
    console.error("ERROR checking book exist");
    return {
      exist: false,
      error: e,
    };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();
    const slug = generateSlug(data.title);
    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const book = await Book.create({ ...data, slug, totalSegments: 0 });
    return {
      success: true,
      data: serializeData(book),
    };
  } catch (e) {
    console.error("ERROR creating a book ", e);
    return {
      success: false,
      error: e,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
): Promise<{
  success: boolean;
  data?: { segmentCreated: number };
  error?: string;
}> => {
  try {
    await connectToDatabase();
    console.log("Saving Book Segments.....");
    const segmentToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );
    await BookSegment.insertMany(segmentToInsert);
    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
    console.log("Book segments saved successfuly ");

    return {
      success: true,
      data: {
        segmentCreated: segments.length,
      },
    };
  } catch (e) {
    console.error("ERROR saving book segments ", e);

    await BookSegment.deleteMany({ bookId });
    await BookSegment.findByIdAndDelete({ bookId });
    console.log("Deleted book segment and book due to failure to save segment");

    return {
      success: false,
      error: "Failed to save book segments",
    };
  }
};

// "use server";
// import { CreateBook, TextSegment } from "@/types";
// import { connectToDatabase } from "@/database/mongoose";
// import { escapeRegex, generateSlug, serializeData } from "@/lib/utils";
// import Book from "@/database/models/book.model";
// import BookSegment from "@/database/models/book-segment.model";
// import mongoose from "mongoose";
// import { getUserPlan } from "@/lib/subscription.server";

// export const getAllBooks = async (search?: string) => {
//   try {
//     await connectToDatabase();

//     let query = {};

//     if (search) {
//       const escapedSearch = escapeRegex(search);
//       const regex = new RegExp(escapedSearch, "i");
//       query = {
//         $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }],
//       };
//     }

//     const books = await Book.find(query).sort({ createdAt: -1 }).lean();

//     return {
//       success: true,
//       data: serializeData(books),
//     };
//   } catch (e) {
//     console.error("Error connecting to database", e);
//     return {
//       success: false,
//       error: (e as Error).message || "Internal server error",
//     };
//   }
// };

// export const checkBookExists = async (title: string) => {
//   try {
//     await connectToDatabase();

//     const slug = generateSlug(title);

//     const existingBook = await Book.findOne({ slug }).lean();

//     if (existingBook) {
//       return {
//         exists: true,
//         book: serializeData(existingBook),
//       };
//     }

//     return {
//       exists: false,
//     };
//   } catch (e) {
//     console.error("Error checking book exists", e);
//     return {
//       exists: false,
//       error: (e as Error).message || "Internal server error",
//     };
//   }
// };

// export const createBook = async (data: CreateBook) => {
//   try {
//     await connectToDatabase();

//     const slug = generateSlug(data.title);

//     const existingBook = await Book.findOne({ slug }).lean();

//     if (existingBook) {
//       return {
//         success: true,
//         data: serializeData(existingBook),
//         alreadyExists: true,
//       };
//     }

//     // Todo: Check subscription limits before creating a book
//     const { getUserPlan } = await import("@/lib/subscription.server");
//     const { PLAN_LIMITS } = await import("@/lib/subscription-constants");

//     const { auth } = await import("@clerk/nextjs/server");
//     const { userId } = await auth();

//     if (!userId || userId !== data.clerkId) {
//       return { success: false, error: "Unauthorized" };
//     }

//     const plan = await getUserPlan();
//     const limits = PLAN_LIMITS[plan];

//     const bookCount = await Book.countDocuments({ clerkId: userId });

//     if (bookCount >= limits.maxBooks) {
//       const { revalidatePath } = await import("next/cache");
//       revalidatePath("/");

//       return {
//         success: false,
//         error: `You have reached the maximum number of books allowed for your ${plan} plan (${limits.maxBooks}). Please upgrade to add more books.`,
//         isBillingError: true,
//       };
//     }

//     const book = await Book.create({
//       ...data,
//       clerkId: userId,
//       slug,
//       totalSegments: 0,
//     });

//     return {
//       success: true,
//       data: serializeData(book),
//     };
//   } catch (e) {
//     console.error("Error creating a book", e);

//     return {
//       success: false,
//       error: (e as Error).message || "Internal server error",
//     };
//   }
// };

// export const getBookBySlug = async (slug: string) => {
//   try {
//     await connectToDatabase();

//     const book = await Book.findOne({ slug }).lean();

//     if (!book) {
//       return { success: false, error: "Book not found" };
//     }

//     return {
//       success: true,
//       data: serializeData(book),
//     };
//   } catch (e) {
//     console.error("Error fetching book by slug", e);
//     return {
//       success: false,
//       error: (e as Error).message || "Internal server error",
//     };
//   }
// };

// export const saveBookSegments = async (
//   bookId: string,
//   clerkId: string,
//   segments: TextSegment[],
// ) => {
//   try {
//     await connectToDatabase();

//     console.log("Saving book segments...");

//     const segmentsToInsert = segments.map(
//       ({ text, segmentIndex, pageNumber, wordCount }) => ({
//         clerkId,
//         bookId,
//         content: text,
//         segmentIndex,
//         pageNumber,
//         wordCount,
//       }),
//     );

//     await BookSegment.insertMany(segmentsToInsert);

//     // Query the authoritative count of segments for this book
//     const segmentCount = await BookSegment.countDocuments({ bookId });
//     await Book.findByIdAndUpdate(bookId, { totalSegments: segmentCount });

//     console.log("Book segments saved successfully.");

//     return {
//       success: true,
//       data: { segmentsCreated: segments.length },
//     };
//   } catch (e) {
//     console.error("Error saving book segments", e);

//     return {
//       success: false,
//       error: (e as Error).message || "Internal server error",
//     };
//   }
// };

// // Searches book segments using MongoDB text search with regex fallback
// export const searchBookSegments = async (
//   bookId: string,
//   query: string,
//   limit: number = 5,
// ) => {
//   try {
//     await connectToDatabase();

//     console.log(`Searching for: "${query}" in book ${bookId}`);

//     const bookObjectId = new mongoose.Types.ObjectId(bookId);

//     // Try MongoDB text search first (requires text index)
//     let segments: Record<string, unknown>[] = [];
//     try {
//       segments = await BookSegment.find({
//         bookId: bookObjectId,
//         $text: { $search: query },
//       })
//         .select("_id bookId content segmentIndex pageNumber wordCount")
//         .sort({ score: { $meta: "textScore" } })
//         .limit(limit)
//         .lean();
//     } catch {
//       // Text index may not exist — fall through to regex fallback
//       segments = [];
//     }

//     // Fallback: regex search matching ANY keyword
//     if (segments.length === 0) {
//       const keywords = query.split(/\s+/).filter((k) => k.length > 2);
//       const pattern = keywords.map(escapeRegex).join("|");

//       segments = await BookSegment.find({
//         bookId: bookObjectId,
//         content: { $regex: pattern, $options: "i" },
//       })
//         .select("_id bookId content segmentIndex pageNumber wordCount")
//         .sort({ segmentIndex: 1 })
//         .limit(limit)
//         .lean();
//     }

//     console.log(`Search complete. Found ${segments.length} results`);

//     return {
//       success: true,
//       data: serializeData(segments),
//     };
//   } catch (error) {
//     console.error("Error searching segments:", error);
//     return {
//       success: false,
//       error: (error as Error).message,
//       data: [],
//     };
//   }
// };

// export const deleteBook = async (bookId: string) => {
//   try {
//     await connectToDatabase();

//     const book = await Book.findByIdAndDelete(bookId);

//     if (!book) {
//       return {
//         success: false,
//         error: "Book not found",
//       };
//     }

//     // Also delete all segments associated with this book
//     await BookSegment.deleteMany({ bookId });

//     return {
//       success: true,
//       data: { deletedBookId: bookId },
//     };
//   } catch (error) {
//     console.error("Error deleting book:", error);
//     return {
//       success: false,
//       error: (error as Error).message,
//     };
//   }
// };

// export const deleteBlobs = async (pathnames: string[]) => {
//   try {
//     const { del } = await import("@vercel/blob");

//     const deletePromises = pathnames
//       .filter((pathname) => pathname && pathname.length > 0)
//       .map((pathname) => del(pathname));

//     await Promise.all(deletePromises);

//     return {
//       success: true,
//       deletedCount: pathnames.length,
//     };
//   } catch (error) {
//     console.error("Error deleting blobs:", error);
//     return {
//       success: false,
//       error: (error as Error).message,
//     };
//   }
// };

// export const cleanupFailedBook = async (
//   bookId: string,
//   blobPathnames: string[],
// ) => {
//   try {
//     // Delete the book record and its segments from database
//     const deleteBookResult = await deleteBook(bookId);

//     if (!deleteBookResult.success) {
//       console.error("Failed to delete book record:", deleteBookResult.error);
//     }

//     // Delete the blobs from storage
//     const deleteBlobsResult = await deleteBlobs(blobPathnames);

//     if (!deleteBlobsResult.success) {
//       console.error("Failed to delete blobs:", deleteBlobsResult.error);
//     }

//     return {
//       success: deleteBookResult.success && deleteBlobsResult.success,
//       bookDeleted: deleteBookResult.success,
//       blobsDeleted: deleteBlobsResult.success,
//       errors: {
//         bookError: deleteBookResult.success ? null : deleteBookResult.error,
//         blobError: deleteBlobsResult.success ? null : deleteBlobsResult.error,
//       },
//     };
//   } catch (error) {
//     console.error("Error in cleanupFailedBook:", error);
//     return {
//       success: false,
//       error: (error as Error).message,
//     };
//   }
// };
