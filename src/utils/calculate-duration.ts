const calculateDuration = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Ensure end date is strictly after start date
    if (endDate <= startDate) {
        throw new Error("Rent end date must be after start date.");
    }
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    // Convert to days (24 * 60 * 60 * 1000 ms)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};
export default calculateDuration;