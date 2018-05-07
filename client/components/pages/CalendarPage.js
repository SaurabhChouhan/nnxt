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
        let bg = "";
        if (event.status == "Planned in Future")
            bg = "#9fa725"
        if (event.status == "Started")
            bg = "#1A4ECD"
        if (event.status == "Pending")
            bg = "#FF0000"
        if (event.status == "Completed")
            bg = "#4AD938"
        var style = {
            backgroundColor: bg,
            /*borderRadius: '0px',
            opacity: 0.8,
            color:"#fff",
            border: '0px',
            display: 'block'*/
        };
        return {
            style: style
        };
    }

    Event({event}) {
        return (
            <span>
                {(event.role && event.role != 'undefined' && event.role != "" ) ?
                    <em style={{color: 'white'}}>{'(' + event.role + ')'}</em> : null}
                <p>{event.title}</p>
        </span>
        )
    }

    render() {
        let formats = {
            // formats the day and week view tp '03/12'
            dayFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd DD-MMM', culture),
            // formats the top of day view to '03/12'
            dayHeaderFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd DD-MMM', culture),
            weekdayFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd', culture),
            selectRangeFormat: (date, culture, localizer) =>
                localizer.format(date, 'ddd', culture)
        }
        return (
            <div>
                {(this.props.visibility.calendarView) ?
                    <BigCalendar
                        views={{month: true, week: true, day: true}}
                        view={this.props.selectedView}
                        date={this.props.selectedDate}
                        timeslots={4}
                        formats={formats}
                        components={{event: this.Event}}
                        selectable
                        popup
                        onSelectEvent={event => this.props.showSelectedTaskDetail(event)}
                        events={this.props.events}
                        startAccessor='startDateTime'
                        endAccessor='reportingEndDate'
                        eventPropGetter={(this.eventStyleGetter)}
                        onNavigate={(date, view) => {
                            this.props.changeViewAndDate(view,date);
                        }}
                        onView={(view)=>{
                            this.props.changeViewAndDate(view,this.props.selectedDate);
                        }}
                    />
                    : <CalendarTaskDetailPage {...this.props}/>
                }
            </div>
        );
    }
}

export default CalendarPage;