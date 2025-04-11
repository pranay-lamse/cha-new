"use client";

import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

export const ProductGalleryPage = (imageUrls: any[]) => {
  const images = Object.values(imageUrls).map((url) => ({
    original: url.src,
    thumbnail: url.thumbnail,
  }));

  return (
    <div className="woocommerce-product-gallery w-full max-w-lg">
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={true}
        showThumbnails={true}
      />
    </div>
  );
};
