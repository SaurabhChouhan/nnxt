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

    /*Event({event}) {
        return (
            <span>
                {(event.role && event.role != 'undefined' && event.role != "" ) ?
                    <em style={{color: 'white'}}>{'(' + event.role + ')'}</em> : null}
                <p>{event.title}</p>
        </span>
        )
    }*/

    render() {
        let tmpDate=moment("05-08-2018", "MM-DD-YYYY").toDate();
        console.log("inside calendar render ",tmpDate);
        console.log("type of tmp date ",typeof tmpDate);
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
                      //  components={{event: this.Event}}
                       // selectable
                        //popup
                        onSelectEvent={event => this.props.showSelectedTaskDetail(event)}
                        events={[
                            {
                                end: moment ("05-08-2018 12:30:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                                start:moment("05-06-2018 11:00:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                                title: 'Task2',
                                description:'Task2 is pending task'

                            },
                            {
                            end: moment("05-08-2018 10:30:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                            start: moment("05-08-2018 10:00:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                            title: 'Task1',
                                description:'Task1 is pending task'

                        },
                            {
                                end: moment ("05-09-2018 12:30:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                                start:moment("05-09-2018 11:00:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                                title: 'Task3',
                                description:'Task3 is pending task'

                            },
                            {
                                end: moment ("05-12-2018 12:30:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                                start:moment("05-09-2018 11:00:00", "MM-DD-YYYY HH:mm:ss").toDate(),
                                title: 'Task4',
                                description:'Task4 is pending task'

                            }

                        ]}
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