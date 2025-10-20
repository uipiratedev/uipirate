import BlogsDetails from "@/screens/blogsDetails";

const BlogsDetailsPage = ({ params }: any) => {
  console.log("BlogsDetailsPage");
  console.log(params);

  return (
    <div>
      <BlogsDetails />
    </div>
  );
};

export default BlogsDetailsPage;
