import React from "react";
// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "components/CustomButtons/Button.js";

import modalStyle from "assets/jss/material-kit-react/modalStyle.js";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import NavPills from "components/NavPills/NavPills";
import {
  ListItem,
  List,
  Radio,
  FormControlLabel,
  CircularProgress,
  Divider
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { db } from "utils/firebase";
const useStyles = makeStyles(modalStyle);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

const RadioButton = ({ classes, label, ...rest }) => (
  <FormControlLabel
    control={
      <Radio
        {...rest}
        aria-label="A"
        icon={<FiberManualRecord className={classes.radioUnchecked} />}
        checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
        classes={{
          checked: classes.radio,
          root: classes.radioRoot
        }}
      />
    }
    classes={{
      label: classes.label,
      root: classes.labelRoot
    }}
    label={label}
  />
);

const getDataFromCollection = async collectionName => {
  const collectionRef = db.collection(collectionName);
  const querySnapshot = await collectionRef.get();
  const collection = querySnapshot.docs.map(item => ({
    ...item.data(),
    id: item.id
  }));

  return collection;
};

const TabContent = ({ items, selectedItem, setSelectedItem, classes }) => (
  <GridContainer justify="center">
    <GridItem xs={12} sm={12} md={12}>
      <List
        component="nav"
        className={classes.root}
        aria-label="mailbox folders"
      >
        {items.map(item => (
          <ListItem key={item.id}>
            <RadioButton
              checked={selectedItem === item.id}
              classes={classes}
              value={item.id}
              label={item.name}
              onChange={() => setSelectedItem(item.id)}
            />
            <Divider className={classes.root} />
          </ListItem>
        ))}
      </List>
    </GridItem>
  </GridContainer>
);

export default function Modal({ isOpen, onDataSubmit }) {
  const classes = useStyles();

  const [universities, setUniversities] = React.useState([]);
  const [majors, setMajors] = React.useState([]);
  const [specialties, setSpecialties] = React.useState([]);

  const [selectedUniversity, setSelectedUniversity] = React.useState(undefined);
  const [selectedMajor, setSelectedMajor] = React.useState(undefined);
  const [selectedSpeciality, setSelectedSpeciality] = React.useState(undefined);

  const [currentTab, setCurrentTab] = React.useState(0);
  const [isLoading, setIsloading] = React.useState(true);

  const btnDisabledCase1 = currentTab === 0 && selectedUniversity === undefined;
  const btnDisabledCase2 = currentTab === 1 && selectedMajor === undefined;
  const btnDisabledCase3 = currentTab === 2 && selectedSpeciality === undefined;

  const btnDisabled = btnDisabledCase1 || btnDisabledCase2 || btnDisabledCase3;
  const finishVtnVisible = currentTab === 2;

  const getUniversities = React.useCallback(async () => {
    const _universities = await getDataFromCollection("universities");
    setUniversities(_universities);
  }, []);

  const getMajors = React.useCallback(async () => {
    const _majors = await getDataFromCollection("majors");
    setMajors(_majors);
  }, []);

  const getSpecialties = React.useCallback(async () => {
    const specs = await getDataFromCollection("specialties");
    setSpecialties(specs);
  }, []);

  const handleBtnSubmit = React.useCallback(() => {
    if (!finishVtnVisible) {
      setCurrentTab(currentTab + 1);
      return;
    }

    onDataSubmit({
      university: selectedUniversity,
      major: selectedMajor,
      speciality: selectedSpeciality
    });
  }, [
    currentTab,
    selectedMajor,
    selectedSpeciality,
    selectedUniversity,
    finishVtnVisible
  ]);

  const loadData = async () => {
    try {
      await getUniversities();
      await getMajors();
      await getSpecialties();
    } catch (error) {
    } finally {
      setIsloading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal
        }}
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => { }}
        aria-labelledby="modal-slide-title"
        aria-describedby="modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          {/* <h4 className={classes.modalTitle}>Modal title</h4> */}
        </DialogTitle>
        {isLoading ? (
          <GridContainer justify="center">
            <CircularProgress />
          </GridContainer>
        ) : (
            <DialogContent
              id="modal-slide-description"
              className={classes.modalBody}
            >
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={12} className={classes.navWrapper}>
                  <NavPills
                    active={currentTab}
                    alignCenter
                    color="primary"
                    tabs={[
                      {
                        tabButton: "Select University",
                        disabled: currentTab !== 0,
                        tabContent: (
                          <TabContent
                            classes={classes}
                            selectedItem={selectedUniversity}
                            items={universities}
                            setSelectedItem={setSelectedUniversity}
                          />
                        )
                      },
                      {
                        tabButton: "Select Major",
                        disabled: currentTab !== 1,
                        tabContent: (
                          <TabContent
                            classes={classes}
                            selectedItem={selectedMajor}
                            items={majors}
                            setSelectedItem={setSelectedMajor}
                          />
                        )
                      },
                      {
                        tabButton: "Select Speciality",
                        disabled: currentTab !== 2,
                        tabContent: (
                          <TabContent
                            classes={classes}
                            selectedItem={selectedSpeciality}
                            items={specialties}
                            setSelectedItem={setSelectedSpeciality}
                          />
                        )
                      }
                    ]}
                  />
                </GridItem>
              </GridContainer>
            </DialogContent>
          )}
        <DialogActions
          className={classes.modalFooter + " " + classes.modalFooterCenter}
        >
          <Button
            disabled={btnDisabled}
            onClick={handleBtnSubmit}
            color="success"
          >
            {finishVtnVisible ? "Finish" : "Next"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
