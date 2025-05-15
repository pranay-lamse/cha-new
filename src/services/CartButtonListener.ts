import { useEffect } from 'react';

const CartButtonListener = () => {
  useEffect(() => {
    const handleAddToCartClick = (e: Event) => {
      e.preventDefault();

      const target = e.currentTarget as HTMLAnchorElement;
      const relativeHref = target.getAttribute('href');

      // Define your base URL here (adjust if needed)
      const baseURL = 'https://classichorseauction.com/stage/product-category/horse-classifieds';

      if (relativeHref) {
        const fullURL = `${baseURL}${relativeHref}`;

        fetch(fullURL, {
          method: 'GET',
          credentials: 'include', // if session/cookie based cart
        })
          .then((res) => res.text())
          .then((data) => {
            console.log('Cart updated:', data);
            // handle success (optional)
          })
          .catch((err) => {
            console.error('Failed to add to cart:', err);
          });
      }
    };

    // Find all buttons like this (optional: filter by data-product_id if needed)
    const buttons = document.querySelectorAll(
      'a.ajax_add_to_cart'
    );

    buttons.forEach((btn) => {
      btn.addEventListener('click', handleAddToCartClick);
    });

    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener('click', handleAddToCartClick);
      });
    };
  }, []);

  return null;
};

export default CartButtonListener;
