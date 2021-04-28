import { format, isThisYear } from 'date-fns';

export const formatDate = (str, options) => {
  let date = new Date(str);
  // show year if date not curr year or if requested
  if (options?.year || !isThisYear(date)) {
    return format(date, `MMM d, yyyy 'at' h:mm aa`);
  }
  return format(date, `MMM d 'at' h:mm aa`);
};
