import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import People from "@material-ui/icons/People";
import Email from "@material-ui/icons/Email";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import ImageUploader from "react-images-upload";

import styles from "assets/jss/material-kit-react/views/componentsSections/loginStyle.js";
import { CircularProgress } from "@material-ui/core";
import classNames from "classnames";
import { firebaseStorage } from "utils/firebase";
import profileStyles from "assets/jss/material-kit-react/views/profilePage.js";

const useStyles = makeStyles(styles);
const useProfileStyles = makeStyles(profileStyles);
export default function SectionLogin({
  isLoginPage,
  handleInputChange,
  onMainCLick,
  error,
  isLoading,
  onImageUploaded
}) {
  const [selectedImage, setSelectedImage] = React.useState(selectedImage);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const classes = useStyles();
  const _classes = useProfileStyles();

  const mainText = isLoginPage ? "Login" : "Sign Up";
  const imageClasses = classNames(
    _classes.imgRaised,
    _classes.imgRoundedCircle,
    _classes.imgFluid
  );

  const onImageChange = React.useCallback(async file => {
    setUploadingImage(true);

    const fileName = file[0].name + "_" + Date.now();

    await firebaseStorage
      .child("images")
      .child(fileName)
      .put(file[0]);

    const url = await firebaseStorage
      .child("images/" + fileName)
      .getDownloadURL();
    setSelectedImage(url);
    onImageUploaded(url);
    setUploadingImage(false);
  }, []);

  return (
    <div className={classes.section} style={{ backgroundImage: "none" }}>
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <form className={classes.form}>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>{mainText}</h4>
                </CardHeader>
                <CardBody>
                  {!isLoginPage ? (
                    <>
                      {selectedImage ? (
                        <GridContainer justify="center">
                          <GridItem xs={12} sm={12} md={6}>
                            <div className={classes.profile}>
                              <div>
                                <img
                                  src={selectedImage}
                                  alt="..."
                                  className={imageClasses}
                                />
                              </div>
                            </div>
                          </GridItem>
                        </GridContainer>
                      ) : uploadingImage ? (
                        <CircularProgress />
                      ) : (
                            <ImageUploader
                              withIcon={true}
                              buttonText="Choose images"
                              onChange={onImageChange}
                              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                              maxFileSize={5242880}
                            />
                          )}
                      <CustomInput
                        labelText="First Name..."
                        id="first"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                          onChange: handleInputChange,
                          name: "displayName",
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </>
                  ) : null}
                  <CustomInput
                    labelText="Email..."
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "email",
                      name: "email",
                      onChange: handleInputChange,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputIconsColor} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    id="pass"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "password",
                      name: "password",
                      onChange: handleInputChange,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputIconsColor}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      ),
                      autoComplete: "off"
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                      <Button
                        onClick={onMainCLick}
                        simple
                        color="primary"
                        size="lg"
                        disabled={uploadingImage}
                      >
                        {mainText}
                      </Button>
                    )}
                </CardFooter>
                {error && (
                  <h4 style={{ color: "red", textAlign: "center" }}>{error}</h4>
                )}
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
