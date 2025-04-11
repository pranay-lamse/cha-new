"use client";
import { useState, useEffect } from "react";
import { getBlog } from "@/actions/get-blogs";
import { marcellus, raleway, merriweather } from "@/config/fonts";
import { Status, Variables } from "@/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

interface Props {
  status: Status;
  title: string;
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export const BlogDetails = ({ status, title, searchParams }: Props) => {
  const currentPage = Number(searchParams?.page) || 1;
  const params: Variables = { status, after: currentPage };

  const originalUrl = process.env.NEXT_PUBLIC_ORIGINAL;
  const imagePlaceholder = "/assets/img/placeholder.png";

  // State to store blog data
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await getBlog(params);
        setData(blogs);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, [status, currentPage]);

  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Email Submitted:", email);
    // Handle form submission logic here (e.g., send data to API)
  };

  return (
    <>
      <div className="blogd-section1">
        <div className="container mx-auto w-full sm:w-11/12 lg:w-[1140px]">
          <div className="category-section mb-6">
            <ul className="flex space-x-4">
              <li className="category-item">
                <a
                  href="https://classichorseauction.com/stage/category/uncategorized/"
                  className="text-[15px] text-white text-center md:text-left"
                >
                  Uncategorized
                </a>
              </li>
            </ul>
          </div>

          {/* Title Section */}
          <div className="title-section mb-6 w-full md:w-[630px]">
            <h1
              className={`text-[26px] md:text-[67px] font-medium text-white leading-[1.3] text-center md:text-left ${merriweather.className}`}
            >
              Embracing the Enchantment of Fall Trail Riding: A Rider’s Delight
            </h1>

            <div className="share-buttons flex justify-center space-x-4 mt-6 mb-10">
              <button className="share-btn-facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </button>
              <button className="share-btn-twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button className="share-btn-linkedin">
                <FontAwesomeIcon icon={faLinkedin} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-full sm:w-11/12 lg:w-[1170px] px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 myaccount-info">
          <div className="md:col-span-2">
            <div className="max-w-4xl mx-auto p-4 md:p-10 bg-white shadow-lg rounded-lg mt-[-120px] flex flex-wrap relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.09)] transition-all duration-300">
              <Image
                src="/assets/img/bd1.jpg"
                alt={title}
                width={1000}
                height={1000}
                className="object-cover"
              />
              <p className="text-[16px] text-[#333] leading-[1.4] italic font-[500] py-2">
                Justin and Hope Jenne’, East Fork Stables, Tennessee
              </p>

              <h2
                className={`${marcellus.className} text-2xl leading-[1.2em] text-[26px] md:text-[40px] mb-4`}
              >
                The Most Wonderful Time of the Year
              </h2>
              <p
                className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
              >
                As the much-anticipated Trail Riding Season approaches, a sense
                of excitement fills the air. While I haven’t always been a
                fair-weather trail rider, there’s an undeniable magic that
                accompanies the transition from summer to fall—a time when horse
                lovers and nature lovers alike can revel in the crisp air and
                the gentle rustle of leaves.
              </p>
              <p
                className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
              >
                The allure of fall trail riding is truly unique. Here in the
                southern US, the humidity drops along with the falling leaves,
                creating an ideal and enjoyable trail riding experience..
              </p>

              <div>
                <h2
                  className={`${marcellus.className} text-2xl leading-[1.2em] text-[26px] md:text-[40px] mb-4`}
                >
                  The Bliss of Cooler Temperatures
                </h2>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  Beyond the comfort it offers riders, the cooler temperatures
                  of autumn provide a welcome respite for our equine companions.
                  These precious weeks bridge the gap between the sweltering
                  summer heat and the biting chill of winter, offering us the
                  ideal window to embark on invigorating rides.
                </p>
                <Image
                  src="/assets/img/bd2.jpg"
                  alt={title}
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
                <p className="text-[16px] text-[#333] leading-[1.4] italic font-[500] py-2">
                  Boys enjoying a snack at Bolo Club, Tennessee
                </p>
              </div>
              <div>
                <h2
                  className={`${marcellus.className} text-2xl leading-[1.2em] text-[26px] md:text-[40px] mb-4`}
                >
                  Capturing Moments: Photography and Memories
                </h2>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  Fall sets the stage for remarkable photographic opportunities,
                  whether it’s with your trusted trail partner or your
                  adventurous riding companions. It’s a season that beckons us
                  to explore new trails and even venture into the realm of
                  camping. Picture this: returning from an exhilarating trail
                  ride to a warm pot of soup by the campfire, sharing stories
                  and laughter with friends. Personally, I like to prepare our
                  meals ahead of time. My personal favorites are easy to heat
                  options like Brunswick stew and spaghetti. What are some of
                  your favorite premade camping meal ideas?
                </p>
                <h2
                  className={`${marcellus.className} text-2xl leading-[1.2em] text-[26px] md:text-[40px] mb-4`}
                >
                  Navigating New Trails and Pathways
                </h2>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  With the departure of mosquitoes and ticks comes a fresh set
                  of challenges for fall riding. When riding in a group, I’ve
                  discovered the value of keeping a few horse lengths’ distance
                  to spare myself from being the designated spiderweb clearer.
                  As my best friends will tell you, the real reason I am not
                  allowed to be Trail Boss is more due to my inclination for
                  taking “adventurous” paths. Whether I take us on the road less
                  traveled or on the road to nowhere, it ensures a comical and
                  memorable experience every time.
                </p>
                <Image
                  src="/assets/img/bd3.jpg"
                  alt={title}
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
                <p className="text-[16px] text-[#333] leading-[1.4] italic font-[500] py-2">
                  Jagger & Magico, Bolo Club, Tennessee
                </p>
              </div>
              <div>
                <h2
                  className={`${marcellus.className} text-2xl leading-[1.2em] text-[26px] md:text-[40px] mb-4`}
                >
                  Autumn Riding Attire and Gear
                </h2>
                <p
                  className={`${raleway.className} text-base mb-6 leading-[1.8em] text-[#222]`}
                >
                  Ensuring a comfortable ride is pretty important to me having
                  an enjoyable trail ride. Fall provides the perfect opportunity
                  to don your favorite hoodies, cozy beanies, and, if you’re in
                  the mood for extra warmth, insulated overalls. Few things
                  rival the comfort of a quilt-lined interior!
                </p>
                <Image
                  src="/assets/img/bd4.jpg"
                  alt={title}
                  width={1000}
                  height={1000}
                  className="object-cover"
                />
                <p className="text-[16px] text-[#333] leading-[1.4] italic font-[500] py-2">
                  Jagger & Magico, Bolo Club, Tennessee
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 md:px-[45px] my-10">
            <form
              className="elementor-search-form"
              action="https://classichorseauction.com/stage"
              method="get"
            >
              <div className="flex items-center border border-gray-300 bg-white rounded-none min-h-[50px] overflow-hidden">
                <label className="sr-only" htmlFor="search-input">
                  Search
                </label>
                <input
                  id="search-input"
                  placeholder="Search..."
                  className="w-full px-4 text-gray-700 outline-none"
                  type="search"
                  name="s"
                />
                <button
                  className="min-h-[50px] min-w-[50px] text-white p-2 border border-black flex items-center bg-[#000] justify-center"
                  type="submit"
                  aria-label="Search"
                >
                  <FaSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="py-8">
              <div className="py-4">
                <h1
                  className={`text-[16px] md:text-[26px] font-medium text-[#000] leading-[1.3] ${merriweather.className}`}
                >
                  CHA Staging
                </h1>
              </div>
              <div className="flex space-x-2">
                {/* Facebook */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white transition hover:bg-blue-300"
                >
                  <FaFacebookF />
                </a>

                {/* Twitter */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-blue-400 text-white transition hover:bg-blue-200"
                >
                  <FaTwitter />
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-red-600 text-white transition hover:bg-red-300"
                >
                  <FaYoutube />
                </a>

                {/* Medium */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 text-white transition hover:bg-gray-300"
                >
                  <FaMedium />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blogd-section-news">
        <div className="container mx-auto w-full sm:w-11/12 lg:w-[1140px]">
          <div className="title-section mb-6 w-full md:w-[630px]">
            <h1
              className={`text-[22px] md:text-[42px] py-4 font-medium text-white leading-[1.3] ${merriweather.className}`}
            >
              Sign up for our Newsletter
            </h1>
            <form
              className="elementor-form w-full max-w-lg mx-auto flex items-center"
              method="post"
              name="New Form"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                name="form_fields[email]"
                id="email"
                className="w-4/5 py-3 px-4 text-white bg-[#FFF]  min-h-[57px]"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="w-1/5 px-3 py-4 text-white bg-[#425562] border border-[#425562] min-h-[57px]"
              >
                Send
              </button>
            </form>
            {/* <p
              className={`${raleway.className} pt-4 text-base mb-6 leading-[1.8em] text-[#fff]`}
            >
              Click edit button to change this text. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};
