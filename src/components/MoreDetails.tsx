import { marcellus, raleway } from "@/config/fonts";
import {
  faHeart,
  faHorse,
  faNetworkWired,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface Props {
  title: string;
}

export const MoreDetails = () => {
  return (
    <><div className="description mt-5 w-full">
      <h2>DONNIE</h2>
    </div><div className="w-full rounded-[22px] p-[20px_30px] mb-10 bg-gray-100">
        <h2
          className="text-[26px] font-extrabold text-gray-900 leading-[43px] font-[Marcellus] mb-[10px]"
        >
          15.3HH 13YO TENNESSEE WALKING HORSE GELDING
        </h2>
      </div><div className="rounded-[22px] p-[20px_30px] mb-10 bg-gray-100 mb-10">
        <div className="text-[16px] font-extrabold text-gray-800 leading-[30px] md:leading-[43px] mb-[20px] mt-5 p-[20px_30px]">
          + CANTER + TRAIL DELUXE + CAMPING PRO + STEPS TO MOUNTING BLOCK + EASY TO CATCH +
        </div>

        <div className="mt-4 text-gray-800 text-lg leading-relaxed pr-tx">
          <p className="mb-[20px] text-[14px] leading-[1.8em] font-extrabold italic text-gray-800">
            ****** BUY NOW BUTTON ABOVE *******
          </p>
          <p className="text-[14px] leading-[1.8em] font-extrabold mb-[10px] font-[Raleway,sans-serif]">
            I would like everyone to meet <strong>Donnie!</strong> He is a beautiful black, unregistered Tennessee Walking Horse gelding standing 15.3+ hands on four keg shoes. Donnie is 13 years old, up to date on all vaccines, and just had his teeth done this month.
          </p>
          <p className="text-[14px] leading-[1.8em] font-extrabold mb-[10px] font-[Raleway,sans-serif]">
            I have had Donnie for a few months now. I got him from a friend who has had him since he was four years old and rode him on weekends during the summer months. Donnie is a big, stout horse—strong enough to carry any size rider but gentle enough for a beginner. He has done it all: camping, trails, parades—you name it, this big guy has seen it. He is traffic-safe and has an amazing four-beat gait that is smooth all day long. He will climb any hill and come down slow and steady, taking care of both you and himself.
          </p>
          <p className="text-[14px] leading-[1.8em] font-extrabold mb-[10px] font-[Raleway,sans-serif]">
            Donnie is trained to pick you up from a mounting block or stump. He will canter, ride at the front, middle, or back of the group on a loose rein, and will also ride out alone with no issues. He isn’t spooky and can be used to check cattle or for whatever job you have in mind—he’s one solid trail horse. Nothing seems to upset this big guy.
          </p>
          <p className="text-[14px] leading-[1.8em] font-extrabold mb-[10px] font-[Raleway,sans-serif]">
            He has spent most of his life on pasture, will meet you at the gate, and is at the bottom of the pecking order. He stands for baths, the farrier, loads and unloads easily—he does all the things a good horse should. If you’re looking for your next trail partner or one to learn on, this big guy will make someone a fantastic horse.
          </p>
          <p className="text-[14px] leading-[1.8em] font-extrabold mb-[20px] font-[Raleway,sans-serif]">
            If you have any questions or would like to come out and try Donnie yourself, please feel free to give me a call at{" "}
            <span>606-669-7021</span>. Thanks!
          </p>
        </div>
      </div><div className="w-full rounded-[22px] p-[20px_30px] mb-10 bg-gray-100">
        <h2
          className="mt-4 text-[16px] font-extrabold text-gray-900 leading-[43px] font-[Marcellus]"
        >
          Eric Caudill   606-669-7021
        </h2>
        <p className="text-[14px] leading-[1.8em] font-extrabold mb-[20px] font-[Raleway,sans-serif]">
          Hustonville, KY
        </p>
      </div><div className="description mt-5 w-full">
        <h2>HEALTH DOCS</h2>
        <div className="flex flex-col md:flex-row md:justify-start">
          {/* First Button (COGGINS) */}
          <div className="mha__document mha__darkCard1 d-flex flex-row p-2 mb-2 card" style={{ height: '60px', position: 'sticky', top: '10px', display: 'flex', alignItems: 'center'}}>
            <a href="https://classichorseauction.com/wp-content/uploads/2025/01/5b80e50d-7214-4d91-a04e-cdd248c5efdd.jpg" target="_blank" rel="noreferrer noopener">
              <p></p>
              <div className="flex flex-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    marginRight: '10px',
                    color: '#dac172',
                    transition: '0.3s all ease'
                  }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                COGGINS
              </div>
            </a>
          </div>


          <div className="mha__document mha__darkCard1 d-flex flex-row p-2 mb-2 card" style={{ height: '60px', position: 'sticky', top: '10px', display: 'flex', alignItems: 'center' }}>
            <a href="https://classichorseauction.com/wp-content/uploads/2025/01/ff3bb67c-6525-4dfe-84cf-a08a5497c9c2.jpg" target="_blank" rel="noreferrer noopener">
              <p></p>
              <div className="flex flex-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    marginRight: '10px',
                    color: '#dac172',
                    transition: '0.3s all ease'
                  }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                VET DOC
              </div>
            </a>
          </div>
        </div>
      </div><div className="rounded-[22px] p-[20px_30px] mt-10 bg-gray-100 mb-4">
        <h2 className="mt-4 mb-4 font-normal text-[26px] text-gray-900 leading-[43px] font-[Marcellus]">Proxy Bidding:</h2>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">
          Proxy bidding is an automatic bidding system that is great to use! Entering a proxy amount allows the system to
          automatically bid on your behalf. This keeps you from having to babysit the auction. It also protects your
          maximum bid by not displaying that amount until you are bid against. We advise entering your max bid especially
          if you will be away from your electronic device or in a poor service area at the end of the auction. To place a
          proxy, or automatic, bid simply enter the amount of your maximum bid into the Custom Bid box. This allows the
          system to automatically enter your next bid $100 above contending bidders until your maximum bid is met or the
          auction ends, whichever comes first. You may also increase your maximum bid at any time without it displaying
          until you are bid against. If your maximum bid is reached and you are outbid, you will receive an email letting
          you know that you have been outbid.
        </p>

        <h2 className="mt-4 mb-4 font-normal text-[26px] text-gray-900 leading-[43px] font-[Marcellus]">Buy It Now:</h2>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">
          If the bidding process is NOT for you, we offer a Buy It Now (BIN) option. This option allows you to purchase a
          horse immediately without waiting until the auction closes. The Buy It Now (BIN) option is available at the
          seller’s discretion. If the seller offers a Buy It Now option, a bidder can purchase that horse immediately at a
          price set by the seller. When the “Buy It Now” button is selected, the auction will end immediately. At that
          time, the purchaser is responsible to make payment arrangements with Classic Horse Auction. You may either be
          invoiced or you may pay via credit card (a 4% processing fee will be added for all credit card transactions). The
          “Buy It Now” option will be removed prior to the close of the auction.
        </p>

        <h2 className="mt-4 mb-4 font-normal text-[26px] text-gray-900 leading-[43px] font-[Marcellus]">Final Minutes:</h2>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]mb-4">
          Please be aware that if a bid is placed within 5 minutes of the close of the auction, an additional 5 minutes will
          be added to the clock. Time will extend for each new bid placed until 5 minutes has gone by with no new bids.
        </p>

        <h2 className="mt-4 mb-4 font-normal text-[26px] text-gray-900 leading-[43px] font-[Marcellus]">Technical Issues:</h2>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">
          In the event of technical issues (site crash, server glitch, etc.) within the last 10 minutes of the auction that
          prevent you from placing your bid, please contact Hope Jenne (615-545-6488) within TEN MINUTES of the close of the
          auction.
        </p>

        <h2 className="mt-4 mb-4 font-normal text-[26px] text-gray-900 leading-[43px] font-[Marcellus]">Non Payment Fee:</h2>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">
          Buyers are required to make payment by the close of business the following day. Purchasers who do not will be
          charged a $1,000 fee to the card on file. This also applies to purchasers using the Buy It Now option.
        </p>

        <h2 className="mt-4 mb-4 font-normal text-[26px] text-gray-900 leading-[43px] font-[Marcellus]">Still Need Help?:</h2>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">
          Serving customers, both buyers and sellers, is our top priority. We want this to be a seamless process for everyone
          involved. Please reach out to us via text or call with any additional questions you might have.
        </p>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">Hope Jenne<br />(615) 545-6488</p>
        <p className="mb-4 font-normal font-raleway text-[14px] leading-[1.8]">Justin Jenne<br />(931) 224-2968</p>
      </div></>
  );
};
