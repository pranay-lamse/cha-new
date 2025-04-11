
export const generatePaginationNumbers = (currentPage:number, totalPages: number) => {
    
    if(totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    const startRange = [1];
    const endRange = [totalPages - 1, totalPages];

    if (currentPage <= 3) {
        return [...startRange, 3, 4, '...', ...endRange];
    }

    if (currentPage >= totalPages - 2) {
        return [...startRange, '...', totalPages - 3, ...endRange];
    }

    return [
        ...startRange,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        ...endRange,
    ];
}