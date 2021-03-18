import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { addZero } from '../../lib/util';
import { RootState } from '../../redux/store';
import {
  selectUserEventsArray,
  loadUserEvents,
  UserEvent,
  deleteUserEvent,
} from '../../redux/user-event';
import './Calendar.css';
import EventItem from './EventItem';

const mapState = (state: RootState) => ({
  events: selectUserEventsArray(state),
});

const mapDispatch = {
  loadUserEvents,
  deleteUserEvent,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};

  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateEnd));
    if (groups[dateStartKey] === undefined) {
      groups[dateStartKey] = [];
    }

    groups[dateStartKey].push(event);

    if (dateStartKey !== dateEndKey) {
      groups[dateEndKey] = [];
      groups[dateEndKey].push(event);
    }
  });

  return groups;
};

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, [loadUserEvents]);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKey: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKey = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date1) - +new Date(date2)
    );
  }

  return groupedEvents && sortedGroupKey ? (
    <div>
      <div className="calendar">
        {sortedGroupKey.map((dayKey) => {
          let events = groupedEvents ? groupedEvents[dayKey] : [];
          const groupDate = new Date(dayKey);
          const day = groupDate.getDate();
          const month = groupDate.toLocaleString(undefined, { month: 'long' });
          return (
            <div className="calendar-day">
              <div className="calendar-day-label">
                <span>
                  {day} {month}
                </span>
              </div>
              <div className="calendar-events">
                {events.map((event) => {
                  return <EventItem event={event} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default connector(Calendar);
