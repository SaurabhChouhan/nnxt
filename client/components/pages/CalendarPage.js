import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {CalendarTaskDetailPage} from '../../components';


BigCalendar.momentLocalizer(moment);

class CalendarPage extends React.Component {
    constructor(props) {
        super(props);
    }


    eventStyleGetter(event, start, end, isSelected) {
        console.log("event.status", event.report.status)
        let bg = "";
        if (event.report.status == "un-reported")
            bg = "#9fa725"
        if (event.report.status == "Started")
            bg = "#1A4ECD"
        if (event.report.status == "pending")
            bg = "#FF0000"
        if (event.report.status == "completed")
            bg = "#4AD938"
        let style = {
            backgroundColor: bg,
            borderRadius: '0px',
            opacity: 0.8,
            color: "#fff",
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    }

    Event({event}) {
        return (
            <span>
               <p>{event.title}</p>
        </span>
        )
    }

    render() {
        /* let formats = {
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
         }*/
        console.log("this.props.events", this.props.events)
        return (
            <div>
                {(this.props.visibility.calendarView) ?
                    <BigCalendar
                        views={{month: true, week: true, day: true}}
                        view={this.props.selectedView}
                        date={this.props.selectedDate}
                        timeslots={4}
                        components={{event: this.Event}}
                        selectable
                        popup
                        onSelectEvent={event => this.props.showSelectedTaskDetail(event)}
                        events={this.props.events}
                        startAccessor='start'
                        endAccessor='end'
                        eventPropGetter={(this.eventStyleGetter)}
                        onNavigate={(date, view) => {
                            this.props.changeViewAndDate(view, date);
                        }}
                        onView={(view) => {
                            this.props.changeViewAndDate(view, this.props.selectedDate);
                        }}
                    />
                    : <CalendarTaskDetailPage {...this.props}/>
                }
            </div>
        );
    }
}

export default CalendarPage;
