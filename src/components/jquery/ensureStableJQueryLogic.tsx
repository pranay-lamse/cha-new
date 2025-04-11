import $ from "jquery";

export const ensureStableJQueryLogic = () => {
  window.onload = () => {
    $(".woocommerce-pagination a").each(function () {
      const href = $(this).attr("href");
      if (href && href.includes("/stage/")) {
        const updatedHref = href.replace("/stage", "");
        $(this).attr("href", updatedHref);
      }
    });
  };

  setTimeout(() => {
    $(".woocommerce-pagination a").each(function () {
      const href = $(this).attr("href");
      if (href && href.includes("/stage/")) {
        const updatedHref = href.replace("/stage", "");
        $(this).attr("href", updatedHref);
      }
    });
  }, 500);
};
