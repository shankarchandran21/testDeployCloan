import "./Settings.css";
import React, { Component } from "react";
import { Card, Input, Spin, Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import AuthService from "../../services/api";

const fileToDataUri = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });
};

class CompanySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      // title: "",
      company_short_name: "",
      company_name: "",
      company_logo: "",
      contact_person: "",
      contact_email: "",
      company_address: "",
      phone_number: "",
      fax_number: "",
      post_code: "",
      loading: false,
      fileList: [],
      display_company_logo: "",
      isSubmitBlocked: false,
    };
  }

  componentDidMount() {
    //api call
    this.fetchCompanyDetails();
  }

  fetchCompanyDetails = () => {
    if (document.getElementById("user-profile-spin") !== null)
      document.getElementById("user-profile-spin").style.display = "block";
    AuthService.requestMethod("/companySettingsList")
      .then((response) => {
        if (document.getElementById("user-profile-spin") !== null)
          document.getElementById("user-profile-spin").style.display = "none";
        document.getElementById("submit-button").style.visibility = "visible";

        if (response && response.data) {
          //removing unwanted keys from api
          if (response.data.company_settings.id)
            delete response.data.company_settings.id;
          if (response.data.company_settings.updated_at)
            delete response.data.company_settings.updated_at;
          if (response.data.company_settings.created_at)
            delete response.data.company_settings.created_at;
            //title will be given as null
          if (response.data.company_settings.title === null){
            delete response.data.company_settings.title;
          }

          this.setState({
            data: response.data.company_settings,
            display_company_logo: response.data.company_settings.company_logo,
          });

        }
      })
      .catch((error) => {
        if (document.getElementById("user-profile-spin") !== null)
          document.getElementById("user-profile-spin").style.display = "none";
        console.log(error);
      });
  };

  handleOnChange = (key, event) => {
    this.setState({
      [key]: event.target.value,
    });
  };

  handleButtonClick = () => {
    const {
      // title,
      company_short_name,
      company_name,
      contact_person,
      contact_email,
      company_address,
      phone_number,
      fax_number,
      post_code,
      fileList,
      isSubmitBlocked,
    } = this.state;

    const { storage, isFromLocalStorage } = this.props.dataStore.header;

    if (isSubmitBlocked) return;
    this.setState({
      isSubmitBlocked: true,
    });
    const formData = new FormData();
    // if (title) formData.append("title", title);
    if (company_short_name)
      formData.append("company_short_name", company_short_name);
    if (company_name) formData.append("company_name", company_name);
    if (contact_person) formData.append("contact_person", contact_person);
    if (contact_email) formData.append("contact_email", contact_email);
    if (company_address) formData.append("company_address", company_address);
    if (phone_number) formData.append("phone_number", phone_number);
    if (fax_number) formData.append("fax_number", fax_number);
    if (post_code) formData.append("post_code", post_code);
    if (fileList) {
      fileList.forEach((file) => {
        formData.append("company_logo", file);
      });
    }

    if (document.getElementById("user-profile-spin") !== null)
      document.getElementById("user-profile-spin").style.display = "block";

    message.destroy();
    AuthService.requestWithPost("/companySettings", formData)
      .then((response) => {
        this.setState({
          isSubmitBlocked: false,
        });
        if (document.getElementById("user-profile-spin") !== null)
          document.getElementById("user-profile-spin").style.display = "none";
        if (!response) return;
        if (response && response.data) {
          if (response.data.success === 0 && response.data.message) {
            message.error(response.data.message);
            if (isFromLocalStorage)
              localStorage.setItem("certificate-approved-id");
            else sessionStorage.setItem("certificate-approved-id");
          } else {
            message.success(response.data.message);

            var user = storage || "{}";

            var newLogo = {
              clientLogo: response.data.comapny_logo,
            };
            var merged = { ...user, ...newLogo };
            if (isFromLocalStorage) {
              localStorage.setItem(
                "certificate-automation-authority",
                JSON.stringify(merged)
              );
            } else {
              sessionStorage.setItem(
                "certificate-automation-authority",
                JSON.stringify(merged)
              );
            }
          }
        }
      })
      .catch((error) => {
        this.setState({
          isSubmitBlocked: false,
        });
        if (document.getElementById("user-profile-spin") !== null)
          document.getElementById("user-profile-spin").style.display = "none";
        console.log(error);
      });
  };

  render() {
    //the data that needs to be displayed is stored in an object as key value pair.
    const displayObjects = {
      // title: "Title",
      company_short_name: "Company Short Name",
      company_name: "Company Name",
      company_logo: "Company Logo",
      contact_person: "Contact Person",
      contact_email: "Contact Email",
      company_address: "Company Address",
      phone_number: "Phone Number",
      fax_number: "Fax Number",
      post_code: "Postal Code",
    };

    const {
      data,
      loading,
      imageUrl,
      display_company_logo,
      fileList,
    } = this.state;

    const uploadButton = (
      <div className="upload-container">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    const props = {
      beforeUpload: (file) => {
        const { fileList } = this.state;
        this.setState(
          {
            fileList: [file],
          }
          // () => this.handleImagePreview(fileList)
        );

        return false;
      },
      fileList,
    };

    fileList.forEach((file) => {
      fileToDataUri(file).then((dataUri) => {
        if (!dataUri) return;
        this.setState({
          display_company_logo: dataUri,
        });
      });
    });

    return (
      <div className="company-profile-container">
        <div
          id="user-profile-spin"
          style={{ display: "block", position: "relative" }}
        >
          <Spin className="spin-user" size="large" />
        </div>
        <Card className="user-profile-header">Organization Settings</Card>
        <div className="user-profile-divider" />

        <div className="company-settings-wrapper">
          {Object.keys(data).map((key, index) => {
            return (
              <>
                {" "}
                <div className="display-style">{displayObjects[key]}</div>
                {key === "company_logo" ? (
                  <div className="company-logo-container">
                    <Upload {...props}>{uploadButton}</Upload>
                    <div
                      style={{
                        width: "500px",
                        height: "50px",
                      }}
                    >
                      <img
                        src={display_company_logo}
                        alt="companyLogo"
                        style={{ height: "75px" }}
                      />

                      {/* {display_company_logo ? (
                      <img
                        src={display_company_logo}
                        alt="companyLogo"
                        style={{ height: "75px" }}
                      />
                    ) : null} */}
                    </div>
                  </div>
                ) : (
                  // <div className="company-logo-container">
                  //   <Upload
                  //     name="avatar"
                  //     listType="picture-card"
                  //     className="avatar-uploader"
                  //     showUploadList={false}
                  //     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  //     beforeUpload={beforeUpload}
                  //     onChange={this.handleChange}
                  //     className="display-style"
                  //   >
                  //     {imageUrl ? (
                  //       <img
                  //         src={imageUrl}
                  //         alt="avatar"
                  //         style={{ width: "100%" }}
                  //       />
                  //     ) : (
                  //       uploadButton
                  //     )}
                  //   </Upload>
                  //   {display_company_logo ? (
                  //     <img
                  //       src={display_company_logo}
                  //       alt="companyLogo"
                  //       style={{ height: "75px" }}
                  //     />
                  //   ) : null}
                  // </div>

                  <Input
                    defaultValue={data[key]}
                    onChange={this.handleOnChange.bind(this, key)}
                    className="display-style"
                  />
                )}
              </>
            );
          })}
        </div>

        <div className="user-profile-sub-divider" />

        <Button
          size={"medium"}
          id="submit-button"
          className="submit-button"
          onClick={this.handleButtonClick}
          style={{ backgroundColor: "#01cab8" }}
        >
          Submit
        </Button>
      </div>
    );
  }
}

export default withRouter(inject("dataStore")(observer(CompanySettings)));
