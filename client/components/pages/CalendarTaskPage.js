import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {withRouter} from 'react-router-dom'


BigCalendar.momentLocalizer(moment);

class CalendarTaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectEvent = this.onSelectEvent.bind(this)
    }

    onSelectEvent(event) {

        return this.props.taskSelected(event).then(json => {
            if (json.success) {
                this.props.history.push("/app-home/calendar-task-detail")
                this.props.showTaskDetailPage()
            }
            return json
        })
    }

    eventStyleGetter(event, start, end, isSelected) {

        let bg = "";
        if (event.report.status == "un-reported") {
            bg = "#9fa725"
        }

        else if (event.report.status == "Started") {
            bg = "#1A4ECD"
        }

        else if (event.report.status == "pending") {
            bg = "#FF0000"
        }

        else if (event.report.status == "completed") {

            bg = "#4AD938"
        }
        else {
            bg = "#000000"
        }

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

        return (<div>
            <BigCalendar
                views={{month: true, week: true, day: true}}
                view={this.props.selectedView}
                date={this.props.selectedDate}
                timeslots={4}
                components={{event: this.Event}}
                selectable
                popup
                onSelectEvent={event => {

                    this.onSelectEvent(event)
                }}
                events={this.props.events && this.props.events.length ? this.props.events : []}
                startAccessor='start'
                endAccessor='end'
                titleAccessor='title'
                eventPropGetter={(this.eventStyleGetter)}
                onNavigate={(date, view) => {
                    console.log("onNaviagate called with date ", date)
                    this.props.changeViewAndDate(view, date);
                }}
                onView={(view) => {
                    console.log("onView called with date ")
                    this.props.changeViewAndDate(view, this.props.selectedDate);
                }}
            />
        </div>)
    }
}

export default withRouter(CalendarTaskPage);
