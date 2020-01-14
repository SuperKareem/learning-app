import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Chat from "@material-ui/icons/Chat";
import Build from "@material-ui/icons/Build";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";

import styles from "assets/jss/material-kit-react/views/componentsSections/tabsStyle.js";
import basicsStyles from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";

import {
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Button
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import styled from "styled-components";

const useStyles = makeStyles(styles);
const useBasicsStyle = makeStyles(basicsStyles);
const StyledFormControlLabel = styled(FormControlLabel)`
  color: black;
`;

export default function SectionTabs({
  courses,
  completedMaterials,
  handleCheck
}) {
  const classes = useStyles();
  const basicClasses = useBasicsStyle();
  console.log("[m] completed materials => ", completedMaterials);

  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <div id="nav-tabs">
          <h3>Courses and materials</h3>
          <GridContainer>
            <GridItem justify="center" align="center" xs={12} sm={12} md={12}>
              <CustomTabs
                headerColor="primary"
                tabs={
                  (courses &&
                    courses.length > 0 &&
                    courses.map((course, courseIndex) => ({
                      tabName: course.name,
                      tabIcon: Chat,
                      tabContent: (
                        <List className={classes.root}>
                          {course.materials &&
                            course.materials.map((material, materialIndex) => (
                              <ListItem key={materialIndex}>
                                <StyledFormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        completedMaterials &&
                                        completedMaterials.includes(
                                          material.name
                                        )
                                      }
                                      tabIndex={-1}
                                      onClick={() =>
                                        handleCheck(courseIndex, materialIndex)
                                      }
                                      checkedIcon={
                                        <Check
                                          className={basicClasses.checkedIcon}
                                        />
                                      }
                                      icon={
                                        <Check
                                          className={basicClasses.uncheckedIcon}
                                        />
                                      }
                                      classes={{
                                        checked: basicClasses.checked,
                                        root: basicClasses.checkRoot
                                      }}
                                    />
                                  }
                                  classes={{
                                    root: basicClasses.labelRoot
                                  }}
                                  label={material.name}
                                />
                                <Button
                                  onClick={() =>
                                    material.link && window.open(material.link)
                                  }
                                  color="primary"
                                  round
                                  disabled={!material.link}
                                >
                                  Downlaod
                                </Button>
                              </ListItem>
                            ))}
                        </List>
                      )
                    }))) ||
                  []
                }
              />
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
