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
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import profile from "assets/img/faces/christian.jpg";

import { db } from "utils/firebase";

import styles from "assets/jss/material-kit-react/views/profilePage.js";
import { CircularProgress } from "@material-ui/core";
import Modal from "components/Modal";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress";
import SectionTabs from "views/Components/Sections/SectionTabs";
import Button from "components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

export default function ProfilePage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );

  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingMaterials, setIsLoadingMaterials] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [signedUser, setSignedUser] = React.useState(undefined);
  const [barValue, setBarValue] = React.useState(0);
  const [barLength, setBarLength] = React.useState(0);
  const [courses, setCourses] = React.useState(undefined);
  const [checkedMaterials] = React.useState(0);
  const [completedMaterials, setCompletedMaterials] = React.useState([]);

  const updateBar = React.useCallback((v, total) => {
    setBarValue((v * 100) / total);
  }, []);

  const user = React.useMemo(() => {
    return JSON.parse(localStorage.getItem("user"));
  }, []);

  const handleReset = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setSignedUser(undefined);
      await db
        .collection("users")
        .doc(user.uid)
        .delete();
      await isSigned();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isSigned = React.useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const userRef = db.collection("users").doc(user.uid);
      const _user = await userRef.get();
      if (!_user.exists) {
        setModalOpen(true);
      } else {
        const userData = _user.data();
        const university = await userData.university.get();
        const major = await userData.major.get();
        const speciality = await userData.speciality.get();

        setSignedUser({
          ...userData,
          university: {
            ...university.data(),
            ref: university,
            id: university.id
          },
          major: { ...major.data(), ref: major, id: major.id },
          speciality: {
            ...speciality.data(),
            ref: speciality,
            id: speciality.id
          }
        });
        setCompletedMaterials(userData.completedMaterials || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [user, signedUser]);

  const handleDataSubmit = React.useCallback(
    async ({ university, major, speciality }) => {
      try {
        setModalOpen(false);
        setIsLoading(true);
        await db
          .collection("users")
          .doc(user.uid)
          .set({
            major: db.doc(`/majors/${major}`),
            university: db.doc(`/universities/${university}`),
            speciality: db.doc(`/specialties/${speciality}`)
          });
      } catch (error) {
      } finally {
        await isSigned();
      }
    },
    [isSigned]
  );

  const extractData = React.useCallback(
    (...args) => {
      let arr = [];
      let _barLength = 0;
      args.forEach(arg =>
        arg.docs.forEach(doc => {
          const element = { id: doc.id, ...doc.data() };

          arr.push(element);
          _barLength = _barLength + element.materials.length;
        })
      );
      return [arr, _barLength];
    },
    [completedMaterials]
  );

  const loadMaterials = React.useCallback(async () => {
    try {
      setIsLoadingMaterials(true);

      const specialityCourses = await db
        .collection("courses")
        .where("speciality", "==", signedUser.speciality.ref.ref)
        .get();

      const commonCourses = await db
        .collection("courses")
        .where("speciality", "==", null)
        .get();

      const universityCourses = await db
        .collection("courses")
        .where("speciality", "==", signedUser.speciality.ref.ref)
        .where("university", "==", signedUser.university.ref.ref)
        .get();

      let [_courses, _barLength] = extractData(
        specialityCourses,
        commonCourses,
        universityCourses
      );

      setCourses(_courses);
      setBarLength(_barLength);
    } catch (error) {
    } finally {
      setIsLoadingMaterials(false);
    }
  }, [signedUser, courses, updateBar]);

  const handleMaterialCheck = React.useCallback(
    async (courseIndex, materialIndex) => {
      // https://coderwall.com/p/h4xm0w/why-never-use-new-array-in-javascript
      const currentCourses = [...courses];

      const name = currentCourses[courseIndex].materials[materialIndex].name;

      let materialsCompleted;
      const result = completedMaterials.indexOf(name);

      if (result < 0) {
        materialsCompleted = [...completedMaterials];
        materialsCompleted.push(name);
      } else {
        // https://www.w3schools.com/jsref/jsref_splice.asp
        materialsCompleted = [...completedMaterials];
        materialsCompleted.splice(result, 1);
      }

      setCompletedMaterials(materialsCompleted);

      await db
        .collection("users")
        .doc(user.uid)
        .update({ completedMaterials: materialsCompleted });

      updateBar(materialsCompleted.length, barLength);
    },
    [courses, checkedMaterials, barValue, updateBar]
  );

  React.useEffect(() => {
    if (!signedUser) {
      isSigned();
    }

    updateBar(completedMaterials.length, barLength);

    if (
      signedUser &&
      signedUser.speciality &&
      !courses &&
      !isLoading &&
      !isLoadingMaterials
    ) {
      loadMaterials();
    }
  }, [
    signedUser,
    courses,
    loadMaterials,
    isSigned,
    isLoading,
    checkedMaterials,
    barLength,
    updateBar
  ]);

  return (
    <div>
      <Header
        color="transparent"
        brand="PlanX"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white"
        }}
        {...rest}
        onClick={() => window.location.assign("/")}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      {isLoading ? (
        <GridContainer justify="center">
          <CircularProgress />
        </GridContainer>
      ) : (
          <div className={classNames(classes.main, classes.mainRaised)}>
            {!signedUser ? (
              <Modal isOpen={modalOpen} onDataSubmit={handleDataSubmit} />
            ) : (
                <div>
                  <div className={classes.container}>
                    <GridContainer justify="center">
                      <GridItem xs={12} sm={12} md={6}>
                        <div className={classes.profile}>
                          <div>
                            <img
                              src={user.photoURL || profile}
                              alt="..."
                              className={imageClasses}
                            />
                          </div>
                        </div>
                      </GridItem>
                    </GridContainer>
                    <div className={classes.container}>
                      <GridContainer>
                        <GridItem xs={10} sm={10} md={10}>
                          <h2>{signedUser && signedUser.university.name}</h2>
                          <h3>
                            {signedUser &&
                              `${signedUser.major.name} / ${signedUser.speciality.name}`}
                          </h3>
                        </GridItem>
                        <GridItem justify="end" aling="end" xs={2} sm={2} md={2}>
                          <Button
                            classes={classes.root}
                            onClick={handleReset}
                            color="primary"
                          >
                            reset
                      </Button>
                        </GridItem>
                      </GridContainer>
                    </div>
                    <GridContainer justify="center">
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        className={classes.navWrapper}
                      >
                        {isLoadingMaterials ? (
                          <CircularProgress />
                        ) : (
                            <>
                              <CustomLinearProgress
                                variant="determinate"
                                color="primary"
                                value={isNaN(barValue) ? 0 : barValue}
                              />

                              <SectionTabs
                                courses={courses}
                                completedMaterials={completedMaterials}
                                handleCheck={handleMaterialCheck}
                              />
                            </>
                          )}
                      </GridItem>
                    </GridContainer>
                  </div>
                </div>
              )}
          </div>
        )}
      <Footer />
    </div>
  );
}
