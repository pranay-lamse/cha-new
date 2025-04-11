export interface searchProps {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}
