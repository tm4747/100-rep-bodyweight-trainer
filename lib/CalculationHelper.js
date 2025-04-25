export const readable_timestamp = (timestamp) => {
    const date = new Date(timestamp); // Multiply by 1000 if timestamp is in seconds
    const formattedDate = date.toLocaleDateString(); // Format the date
    return formattedDate;
}