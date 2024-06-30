
export function formatDate(date) {
    
    const newDate = new Date(date);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(newDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;

}