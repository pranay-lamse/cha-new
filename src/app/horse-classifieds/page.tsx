/* import { Blogs } from "@/components/Blogs"; */
import { marcellus, raleway } from "@/config/fonts";
export default async function BlogPage() {
  return (
    <div className="flex items-center justify-center h-[50vh] my-28">
      <h1
        className={`text-5xl md:text-6xl font-bold text-gray-800 relative ${marcellus.className}`}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Coming Soon!
        </span>
      </h1>
    </div>
  );
}
