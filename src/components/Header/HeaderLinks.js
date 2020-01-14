/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();

  const handleChangeRouteToLogin = React.useCallback(() => {
    window.location.assign('login-page')
  }, [])

  const handleChangeRouteToSignup = React.useCallback(() => {
    window.location.assign('/#signup')
  }, [])

  const handleChangeRouteToProfile = React.useCallback(() => {
    window.location.assign('/profile-page')
  }, [])

  const handleSignout = React.useCallback(() => {
    localStorage.removeItem('user')
    window.location.assign('/')
  }, [])

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <List className={classes.list}>{
      user ? <> <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          target="_blank"
          className={classes.navLink}
          onClick={handleChangeRouteToProfile}
        >
           {user.displayName}
        </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          target="_blank"
          className={classes.navLink}
          onClick={handleSignout}
        >
           Sign out
        </Button>
        </ListItem> </> : <> <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          target="_blank"
          className={classes.navLink}
          onClick={handleChangeRouteToLogin}
        >
           Login
        </Button>
        </ListItem>
        <ListItem className={classes.listItem}>
        <Button
          round
          color="rose"
          target="_blank"
          className={classes.registerNavLink}
          onClick={handleChangeRouteToSignup}
        >
           Signup
        </Button>
      </ListItem> </>

    }
      </List>
  );
}
