import React from "react";
import Link from "next/link";
import { FaFileAlt } from "react-icons/fa";

interface DocumentCardProps {
  name: string;
  src: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ name, src }) => {
  return (
    <div
      className="mha__document mha__darkCard1 d-flex flex-row p-2 mb-2 card"
      style={{ height: "60px" }}
    >
      <Link href={src} target="_blank" rel="noreferrer noopener">
        <div className="d-flex flex-row align-items-center">
          <FaFileAlt size={38} className="me-2" />
          {name}
        </div>
      </Link>
    </div>
  );
};

export default DocumentCard;
