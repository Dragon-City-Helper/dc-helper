import { head } from "@vercel/blob";
// Example: Save the buffer to a file (Node.js environment)
import fs from "fs/promises";

async function fetchBlobFile(blobUrl) {
  try {
    // Retrieve metadata for the specified blob URL
    const blobMetadata = await head(blobUrl);

    // Access the URL of the blob
    const { url } = blobMetadata;

    // Fetch the blob data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    // Read the response as a buffer
    const buffer = await response.arrayBuffer();

    // Process the buffer as needed
    console.log(`Blob fetched successfully. Size: ${buffer.byteLength} bytes`);

    await fs.writeFile("temp/dragons.formatted.json", Buffer.from(buffer));
    console.log("File saved as dragons.formatted.json");
  } catch (error) {
    console.error("Error fetching blob file:", error.message);
  }
}

// Example usage
const blobUrl =
  "https://nypf912ycbaftdaz.public.blob.vercel-storage.com/zCJAK3Me5r/dragons.json";
fetchBlobFile(blobUrl);
