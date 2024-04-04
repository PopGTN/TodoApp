export function getCurrentDate(): string {
  // Get current date and time
  const currentDate = new Date();

// Format date components
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

// Construct formatted date string
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  return formattedDate;
}

export function formatDate(dateString:string) {
  // Parse the date string
  var date = new Date(dateString);

  // Format the date
  let formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substr(-2);
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var formattedTime = hours + ':' + minutes + ' ' + ampm;

  // Combine date and time
  var formattedDateTime = formattedDate + ' ' + formattedTime;

  return formattedDateTime;
}


