const secret = process.env.REVALIDATE_SECRET;
const tag = process.argv[2]; // Command line argument for the tag

if (!tag) {
  console.error("Please provide a tag as an argument.");
  process.exit(1);
}

const url = `https://www.dragoncityhelper.com/api/revalidate?secret=${secret}&tag=${tag}`;

async function revalidate() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.revalidated) {
      console.log(`Successfully revalidated tag: ${tag}`);
    } else {
      console.error(`Failed to revalidate tag: ${tag}`);
      console.error(data);
    }
  } catch (error) {
    console.error("Error revalidating:", error);
  }
}

revalidate();
