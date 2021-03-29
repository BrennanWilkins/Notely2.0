import { format, isThisYear } from 'date-fns';

export const formatDate = str => {
  let date = new Date(str);
  // if date not curr year show year
  const formatted = isThisYear(date) ?
  format(date, `MMM d 'at' h:mm aa`) :
  format(date, `MMM d, yyyy 'at' h:mm aa`);

  return formatted;
};
