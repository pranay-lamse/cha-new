import ListingPopup from '@/components/ListingPopup'; // Make sure this path is correct

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to My Site</h1>

      {/* ✅ Popup shown on page load */}
      <ListingPopup />
    </div>
  );
}
