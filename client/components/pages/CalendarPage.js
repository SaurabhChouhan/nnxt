import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';


BigCalendar.momentLocalizer(moment);


class CalendarPage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const dummyEvents = [
            {
                allDay: false,
                endDate: new Date('December 10, 2017 11:13:00'),
                startDate: new Date('December 09, 2017 11:13:00'),
                title: 'hi',
            },
            {
                allDay: true,
                endDate: new Date('December 09, 2017 11:13:00'),
                startDate: new Date('December 09, 2017 11:13:00'),
                title: 'All Day Event',
            },
        ];
        const formats = {
            // formats the day and week view tp '03/12'
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd DD-MMM', culture),
            // formats the top of day view to '03/12'
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd DD-MMM', culture),
            weekdayFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture),
            selectRangeFormat: (date, culture, localizer) =>
                localizer.format(date, 'dddd', culture)
        }

        return (
            <div>

                <BigCalendar
                    views={{month: true, week: true, day: true}}
                    view={"week"}
                    date={moment().toDate()}
                    timeslots={4}
                    formats={formats}
                    components={{event: this.Event}}
                    selectable
                    popup
                    onSelectEvent={event => this.props.showSelectedTaskDetail(event)}
                    eventPropGetter={(this.eventStyleGetter)}
                    onNavigate={(date, view) => {
                        this.props.changeViewAndDate(view, date);
                    }}
                    onView={(view) => {
                        this.props.changeViewAndDate(view, this.props.selectedDate);
                    }}
                    events={dummyEvents}
                    startAccessor="startDate"
                    endAccessor="endDate"
                />


            </div>
        );
    }
}

export default CalendarPage;