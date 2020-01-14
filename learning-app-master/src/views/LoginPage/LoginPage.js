import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import SectionLogin from "views/Components/Sections/SectionLogin.js";

import firebase from "utils/firebase";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  const [form, setForm] = React.useState({});

  // function that handles `TextInput` change that update component
  // state with the current input value
  const handleInputChange = React.useCallback(
    event => {
      const {
        nativeEvent: {
          target: { value, name }
        }
      } = event;

      form[name] = value;

      setForm(form);

    },
    [form]
  );

  const setUser = React.useCallback(({ user }) => {
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const handleSignup = React.useCallback(() => {
    const { email, password } = form;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        setUser({ user });
        window.location.assign("/profile-page");
      })
      .catch(error => {
        form.error = error.message;
        setForm(form);
        console.error(form.error);
      });
  }, [form]);

  return (
    <div>
      <Header
        color="transparent"
        brand="PlandX"
        rightLinks={<HeaderLinks />}
        changeColorOnScroll={{
          height: 100,
          color: "white"
        }}
        fixed
        onClick={() => window.location.assign("/")}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={10}>
              <Card className={classes[cardAnimaton]}>
                <SectionLogin
                  isLoginPage={true}
                  onMainCLick={handleSignup}
                  handleInputChange={handleInputChange}
                  error={form.error}
                />
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
