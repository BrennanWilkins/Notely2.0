import { useEffect, useState, useMemo } from 'react';
import { formatDate } from '../../utils/formatDate';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const getValue = secs => (
  secs < 10 ? ['just now', ''] :
  secs < 30 ? ['a few seconds ago', ''] :
  secs < MINUTE ? ['less than a minute ago', ''] :
  secs < HOUR ? [Math.round(secs / MINUTE), 'minute'] :
  secs < DAY ? [Math.round(secs / HOUR), 'hour'] :
  secs < WEEK ? [Math.round(secs / DAY), 'day'] :
  ['', '']
);

const getSecs = date => {
  const timestamp = new Date(date).getTime();
  const secs = Math.round(Math.abs(Date.now() - timestamp) / 1000);
  return secs;
};

const LiveDate = ({ date, prefix }) => {
  const [, setTicker] = useState(false);

  const title = useMemo(() => formatDate(date), [date]);

  useEffect(() => {
    let timeout;

    const tick = refresh => {
      const secs = getSecs(date);

      const period = (
        secs < MINUTE ? 1000 :
        secs < HOUR ? 1000 * MINUTE :
        secs < DAY ? 1000 * HOUR :
        null
      );

      if (timeout) {
        clearTimeout(timeout);
      }

      if (!period) { return; }

      timeout = setTimeout(tick, period);

      if (!refresh) {
        setTicker(prev => !prev);
      }
    };

    tick(true);

    return () => {
      clearTimeout(timeout);
    };
  }, [date]);

  const secs = getSecs(date);
  const [value, unit] = getValue(secs);

  return (
    <span title={!value ? '' : title}>
      {
        !value ? `${prefix} ${title}` :
        !unit ? `${prefix} ${value}` :
        `${prefix} ${value} ${unit}${value !== 1 ? 's' : ''} ago`
      }
    </span>
  );
};

export default LiveDate;
