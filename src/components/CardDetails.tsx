import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CardDetailsProps {
  sourceId: string | null;
}

const CardDetails = ({ sourceId }: CardDetailsProps) => {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCardDetails = async () => {
      if (!sourceId) return; // Avoid unnecessary API calls

      setLoading(true);
      try {
        const response = await fetch(
          `/api/stripe/fetchSource?sourceId=${sourceId}`
        );
        const data = await response.json();

        setCard(data?.card || null);
      } catch (error) {
        console.error("Failed to fetch card details:", error);
        setCard(null); // Ensure card state is reset on error
      } finally {
        setLoading(false);
      }
    };

    loadCardDetails();
  }, [sourceId]);
  const router = useRouter();
  const handleClick = () => {
    router.push("/my-account/payment-methods/add-payment-method/");
  };

  if (loading) return <p>Loading card details...</p>;

  return (
    <div className="table-wrapper overflow-x-auto">
      {card ? (
        <table className="order-table w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="p-2 border-b">Method</th>
              <th className="p-2 border-b">Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="p-2 border-b">
                {card.brand.toUpperCase()} ending in {card.last4}
              </td>
              <td className="p-2 border-b">
                {card.exp_month}/{card.exp_year}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-red-500">No card details found.</p>
      )}

      <button
        onClick={handleClick}
        className="payment-button border-2 border-[#5bc0de] px-2 py-1 text-[#dcc373] text-[14px] rounded font-bold hover:bg-[#dcc373] hover:text-[#0f335f] hover:no-underline mt-4 w-full md:w-auto inline-block"
      >
        Add payment method
      </button>
    </div>
  );
};

export default CardDetails;
