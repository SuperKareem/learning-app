import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";
import TeamSection from "./Sections/TeamSection.js";
import SectionLogin from "views/Components/Sections/SectionLogin.js";
import firebase from "utils/firebase";

const useStyles = makeStyles(styles);

export default function LandingPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const [form, setForm] = React.useState({
    email: "",
    password: "",
    displayName: "",
    error: undefined,
    imageUrl: undefined
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(false);
  const { email, displayName, password, error } = form;

  const isUserSignedIn = React.useMemo(() => {
    return JSON.parse(localStorage.getItem("user"));
  }, []);

  // function that handles `TextInput` change that update component
  // state with the current input value
  const handleInputChange = React.useCallback(
    event => {
      const {
        nativeEvent: {
          target: { value, name }
        }
      } = event;

      setForm({ ...form, [name]: value });
    },
    [form]
  );

  const onImageUploaded = React.useCallback(
    value => {
      setImageUrl(value);
    },
    [imageUrl]
  );

  const setUser = React.useCallback(({ user }) => {
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const handleSignup = React.useCallback(async () => {
    if (!displayName) {
      setForm({ ...form, error: "First name is required" });

      return;
    }

    // Try to Signup the current user with `firebase` server.
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      await user.updateProfile({ displayName, photoURL: imageUrl });

      setUser({ user });
      window.location.assign("/profile-page");
    } catch (err) {
      const isEmailInvalid = /email/.test(err.message) && "Check your email";
      setForm({ ...form, error: isEmailInvalid || err.message });
    } finally {
      setIsLoading(false);
    }
  }, [form, email, password, displayName, error, imageUrl]);

  return (
    <div>
      <Header
        color="transparent"
        brand="PlanX"
        rightLinks={<HeaderLinks />}
        changeColorOnScroll={{
          height: 100,
          color: "white"
        }}
        onClick={() => window.location.assign("/")}
        fixed
        {...rest}
      />
      <Parallax filter image={require("assets/img/landing-bg.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>PlanX</h1>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
          <TeamSection />
        </div>
        <div id="signup">
          {isUserSignedIn ? (
            undefined
          ) : (
              <SectionLogin
                isLoginPage={false}
                onMainCLick={handleSignup}
                handleInputChange={handleInputChange}
                error={error}
                isLoading={isLoading}
                onImageUploaded={onImageUploaded}
              />
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
