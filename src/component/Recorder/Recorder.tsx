import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDateStart, start, stop } from '../../redux/recorder';
import './Recorder.css';
import cx from 'classnames';
import { addZero } from '../../lib/util';
import { createUserEvents } from '../../redux/user-event';

const Recorder = () => {
  const dispatch = useDispatch();
  const dateStart = useSelector(selectDateStart);
  const started = dateStart !== '';
  let interval = useRef<number>(0);
  const [, setCount] = useState<number>(0);

  const handleClick = () => {
    if (started) {
      dispatch(createUserEvents());

      dispatch(stop());
      window.clearInterval(interval.current);
    } else {
      dispatch(start());
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0;

  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;

  seconds -= hours * 60 * 60;

  const minutes = seconds ? Math.floor(seconds / 60) : 0;

  seconds -= minutes * 60;

  return (
    <div>
      <div className={cx('recorder', { 'recorder-started': started })}>
        <button className="recorder-record" onClick={handleClick}>
          <span></span>
        </button>
        <div className="recorder-counter">
          {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
        </div>
      </div>
    </div>
  );
};

export default Recorder;
