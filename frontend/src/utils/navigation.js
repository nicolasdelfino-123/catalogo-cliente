export const withWholesale = (path) => {
    const isWholesale = window.location.pathname.startsWith("/mayorista");
    return isWholesale ? `/mayorista${path}` : path;
};
