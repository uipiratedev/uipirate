import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://uipiratedev_db_user:wpojyQolgccemF00@cluster0.79wwmtu.mongodb.net/?appName=Cluster0";

// Define dynamic Schema just in case or import the existing Blog model
const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Blog = (mongoose.models.Blog as any) || mongoose.model("Blog", BlogSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");
    
    const blogs = await Blog.find({}, { title: 1, slug: 1, published: 1, createdAt: 1 }).lean();
    console.log(`\nFound ${blogs.length} blog posts in database:\n`);
    
    if (blogs.length === 0) {
      console.log("No blog posts found.");
    } else {
      blogs.forEach((b, index) => {
        console.log(`${index + 1}. [${b.published ? "PUBLISHED" : "DRAFT"}] - Title: "${b.title}" (Slug: "${b.slug}") - Created: ${b.createdAt}`);
      });
    }
  } catch (error) {
    console.error("Error checking blogs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
  }
}

run();
