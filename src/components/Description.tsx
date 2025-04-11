"use client";
import { raleway } from "@/config/fonts";
import DOMPurify from "dompurify";

interface Props {
  shortDescription: string;
}

export const Description = ({ shortDescription }: Props) => {
  const sanitizedContent = DOMPurify.sanitize(shortDescription);

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedContent, "text/html");
  const listItems = doc.querySelectorAll("li");
  const count = listItems.length - 1;

  listItems.forEach((li, index) => {
    li.classList.add("my-2", "text-sm", raleway.className, "font-light");
    if (count !== index) {
      li.classList.add(
        "before:content-['']",
        "before:w-4",
        "before:h-4",
        "before:relative",
        "before:bg-horse-icon",
        "before:inline-block",
        "before:mr-3",
        "before:bg-no-repeat",
        "before:bg-4",
        "before:top-1"
      );
    }
  });

  const updatedContent = doc.body.innerHTML;

  return (
    <div
      className="mb-1 md:mb-10 description-list"
      dangerouslySetInnerHTML={{ __html: updatedContent }}
    />
  );
};
