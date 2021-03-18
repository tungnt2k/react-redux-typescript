import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  UserEvent,
  deleteUserEvent,
  updateUserEvent,
} from '../../../redux/user-event';

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  event: UserEvent;
}

const mapState = () => ({});

const mapDispatch = {
  deleteUserEvent,
  updateUserEvent,
};

const connector = connect(mapState, mapDispatch);
const EventItem: React.FC<Props> = ({
  event,
  deleteUserEvent,
  updateUserEvent,
}) => {
  const [enableEdit, setEnableEdit] = useState(false);
  const [eventTitle, setEventTitle] = useState(event.title);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (enableEdit) {
      inputRef.current?.focus();
    }
  }, [enableEdit]);

  const handleDeleteUserEvent = () => {
    deleteUserEvent(event.id);
  };

  const handleClickTitle = () => {
    setEnableEdit(true);
  };

  const handleChangeTitle = (e: React.FormEvent<HTMLInputElement>) => {
    setEventTitle(e.currentTarget.value);
  };

  const handleBlur = () => {
    setEnableEdit(false);
    updateUserEvent(event, eventTitle);
  };

  return (
    <div>
      <div key={event.id} className="calendar-event">
        <div className="calendar-event-info">
          <div className="calendar-event-time">10:00 - 12:00</div>
          <div className="calendar-event-title">
            {enableEdit ? (
              <input
                ref={inputRef}
                type="text"
                value={eventTitle}
                onBlur={handleBlur}
                onChange={handleChangeTitle}
              ></input>
            ) : (
              <span onClick={handleClickTitle}>{event.title}</span>
            )}
          </div>
        </div>
        <button
          className="calendar-event-delete-button"
          onClick={handleDeleteUserEvent}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default connector(EventItem);
