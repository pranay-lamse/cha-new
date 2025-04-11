import DOMPurify from "dompurify";

export const filterHTMLContent = (
  html: string,
  desiredClasses: string[] = [],
  eventCallback?: (auctionId: string) => void
) => {
  const OLD_URL = process.env.NEXT_PUBLIC_OLD_URL || "";
  const NEW_URL = process.env.NEXT_PUBLIC_NEW_URL || "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const filteredElements = doc.querySelectorAll(
    desiredClasses.map((cls) => `.${cls}`).join(", ")
  );

  // Add event listener to `.remove-uwa` elements
  filteredElements.forEach((element) => {
    element.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const auctionId = btn.getAttribute("data-auction-id");
        if (auctionId && eventCallback) {
          eventCallback(auctionId); // Pass auctionId to the callback
        }
      });
    });

    // Replace URLs as needed
    element.querySelectorAll("a").forEach((link) => {
      if (link.href.startsWith(OLD_URL)) {
        link.href = link.href.replace(new RegExp(`^${OLD_URL}`), NEW_URL);
      }
    });
  });

  const filteredHTML = Array.from(filteredElements)
    .map((el) => el.outerHTML)
    .join("");

  return DOMPurify.sanitize(filteredHTML);
};
