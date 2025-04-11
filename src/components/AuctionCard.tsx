interface AuctionProduct {
  databaseId: number;
  title: string;
  shortDescription: string;
  link: string;
  regularPrice: string;
  currentBid: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
}

export default function AuctionCard({ product }: { product: AuctionProduct }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img
        src={product.featuredImage.node.sourceUrl}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md"
        width={400}
        height={200}
      />
      <h2 className="text-lg font-bold mt-2">{product.title}</h2>
      <p
        className="text-gray-700 mt-1"
        dangerouslySetInnerHTML={{ __html: product.shortDescription }}
      ></p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-blue-600 font-semibold">
          Current Bid: ${product.currentBid}
        </span>
        <a
          href={product.link}
          className="bg-blue-600 text-white px-3 py-1 rounded-md"
        >
          View Auction
        </a>
      </div>
    </div>
  );
}
