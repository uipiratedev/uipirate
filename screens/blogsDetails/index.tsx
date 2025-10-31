import BlogsDetailsHero from "./hero";
import BlogContents from "./blogContents";
import SuggestedReads from "./suggestedReads";
const BlogsDetails = () => {
  return (
    <div>
      <BlogsDetailsHero
        imageUrl=""
        tag="🔎 Research & Community Insights"
        title="Designers vs. Developers: Why the Handoff Still Breaks (and How
          to Fix It)"
      />
      <BlogContents />
      <SuggestedReads />
    </div>
  );
};

export default BlogsDetails;
