import React, { Component } from "react";
import { connect } from "react-redux";
import CalendarHeatmap from "react-calendar-heatmap";
import * as actions from "../actions";
import {
  Grid,
  Table,
  Icon,
  Tab,
  Select,
  Input,
  Loader
} from "semantic-ui-react";
import legend from "../images/legend.png";
import axios from "axios";

var querystring = require("querystring");

//import {localStorage} from 'local-storage'
import localStorage from "local-storage";

const ROOT_URL = "https://phnodeapi.herokuapp.com";

class Feature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventData: null
    };
  }

  //     componentWillMount() {
  //     this.props.fetchMessage();
  //   }

  componentDidMount() {
    //   const data = this.props.fetchMessage();
    //   this.setState({data});
    //   console.log('***STATE***', data);
    let data;
    axios
      .get(`${ROOT_URL}/sensor/store-events`, {
        headers: { Authorization: `Bearer ${localStorage.get("token")}` }
      })
      .then(response => {
        data = response.data.data.eventData;
        this.setState({
          eventData: data
        });
        if (this.state.eventData) {
          this.monthlyData();
        }
      })
      .catch(err => {
        console.log("**ERROR**", err);
      });
  }

  appendZero = num => {
    if (num < 10) return `0${num}`;
    else return `${num}`;
  };

  searchArray = (value, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].key === value) return i;
    }
    return -1;
  };

  monthlyData = () => {
    let monthlyEvents = [];
    let { eventData } = this.state;
    console.log("***INSIDE MONTHLY DATA***", eventData);
    this.setState({});
    let values = [];
    let a;
    eventData.sensorEventLogs.forEach(element => {
      values.push({
        key: +element.timestamp.slice(8, 10),
        month: +element.timestamp.slice(5, 7),
        type: element.type,
        date: element.timestamp.slice(0, 10)
      });
    });
    for (let i = 1; i <= 12; i++) {
      monthlyEvents.push(values.filter(element => element.month === i));
    }

    monthlyEvents
      .filter(element => element.length > 0)
      .forEach(element => this.getValues(element));
    // a = monthlyEvents.filter(element => element.length>0);
    console.log("***END OF MONTHLY DATA***", this.state);
  };

  getValues = eventData => {
    let finalValues = [];
    let values = [];
    let arrayOfDates = [];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const month = +eventData[0].date.slice(5, 7);
    const year = +eventData[0].date.slice(0, 4);

    eventData.forEach(element => {
      values.push({
        key: +element.date.slice(8, 10),
        type: element.type,
        date: element.date
      });
    });
    for (let i = 1; i <= daysInMonth[month - 1]; i++) {
      if (this.searchArray(i, values) === -1) {
        finalValues.push({
          type: "Dry",
          date: `${year}-${this.appendZero(month)}-${this.appendZero(i)}`
        });
      } else {
        finalValues.push({
          type: values[this.searchArray(i, values)].type,
          date: `${year}-${this.appendZero(month)}-${this.appendZero(i)}`
        });
      }
    }
    this.setState({
      [this.getMonthName(month)]: {
        values: finalValues,
        year,
        month,
        numDays: daysInMonth[month - 1]
      }
    });
  };

  getMonthName = month => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    return monthNames[month - 1];
  };

  getSum = () => {
    let arr = [];
    let obj = {
      Dry: 0,
      Wet: 0,
      Off: 0,
      Left: 0
    };
    Object.keys(this.state).map(a => {
      if (a !== "eventData") {
        return arr.push(...this.state[a].values);
      }
    });
    arr.forEach(element => {
      obj[element.type]++;
    });
    return obj;
  };

  getDay = num => {
    const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    return days[num];
  };

  overview = () => {
    let { eventData } = this.state;
    let sum = this.getSum();
    return (
      <div>
        <h1>Overview</h1>
        <Table celled padded unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Icon color="red" name="square" />
                {"\t"}
                {sum["Wet"] + " days wet"}
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon color="green" name="square" />
                {"\t"}
                {sum["Dry"] + " days dry"}
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon color="brown" name="square" />
                {"\t"}
                {sum["Off"] + " days off"}
              </Table.HeaderCell>
              
            </Table.Row>
          </Table.Header>
        </Table>

        <Grid columns={3}>
          {Object.keys(this.state).map((a, index) => {
            if (a !== "eventData") {
              console.log(new Date(this.state[a].values[0].date));
              return (
                <Grid.Column key={index}>
                  <h2 style={{ color: "#666" }}>{`${this.getMonthName(
                    this.state[a].month
                  )}, ${this.state[a].year}`}</h2>
                  <CalendarHeatmap
                    // startDate={new Date(this.state[a].values[0].date)}
                    numDays={this.state[a].numDays}
                    endDate={
                      new Date(
                        this.state[a].values[
                          this.state[a].values.length - 1
                        ].date
                      )
                    }
                    values={this.state[a].values}
                    horizontal={false}
                    showMonthLabels={false}
                    classForValue={value => {
                      if (!value) return "color-empty";
                      else return `color-scale-${value.type}`;
                    }}
                  />
                </Grid.Column>
              );
            }
          })}
        </Grid>
      </div>
    );
  };

  events = () => {
    return (
      <div>
        <Table unstackable celled padded>
          <Table.Body>
            {Object.keys(this.state).map((a, index) => {
              if (a !== "eventData") {
                return this.state[a].values.map((b, index) => {
                  return (
                    <Table.Row>
                      <Table.Cell>
                        {this.getDay(new Date(b.date).getDay()) +
                          " " +
                          new Date(b.date).getDate() +
                          "." +
                          new Date(b.date).getMonth() +
                          "." +
                          new Date(b.date).getFullYear()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className={"rect-" + b.type} />
                      </Table.Cell>
                      <Table.Cell>{b.type}</Table.Cell>
                      <Table.Cell>
                        <Input />
                      </Table.Cell>
                    </Table.Row>
                  );
                });
              }
            })}
          </Table.Body>
        </Table>
      </div>
    );
  };

  render() {
    const panes = [
      { menuItem: "Overview", render: () => this.overview() },
      { menuItem: "Sensor Events", render: () => this.events() }
    ];

    if (this.state.eventData) {
      return <Tab panes={panes} />;
    } else {
      return <Loader />;
    }
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Feature);
