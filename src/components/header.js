import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import logo from "../images/logo.png";
import * as actions from "../actions";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header as Head,
  Image,
  List,
  Menu,
  Segment
} from "semantic-ui-react";

class Header extends Component {
  render() {
    this.props.fetchMessage();
    console.log("***INSIDE HEADER***", this.props.message);
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as={Link} to="/" header>
            <Image size="tiny" src={logo} style={{ marginRight: "1.5em" }} />
          </Menu.Item>
          {this.props.authenticated && (
            <Menu.Menu position="right">
            <Menu.Item>
            sensorID: &nbsp; {this.props.message &&
              this.props.message.eventData.sensorBlueToothID}
          </Menu.Item>
            <Menu.Item as={Link} to="/signout">
              Sign Out
            </Menu.Item>
            </Menu.Menu>
          )}
          {!this.props.authenticated && (
            <Menu.Menu position="right">
              <Menu.Item as={Link} to="/signin">
                Sign In
              </Menu.Item>
            </Menu.Menu>
          )}
        </Container>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    message: state.auth.message
  };
}

export default connect(mapStateToProps, actions)(Header);
