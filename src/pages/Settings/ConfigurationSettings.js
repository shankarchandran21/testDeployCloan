import "./Settings.css";
import React, { Component } from "react";
import { Card, Input, message, Spin, Select, Switch } from "antd";
import AuthService from "../../services/api";
import { dateFormatArray } from "../../utils/constants";
import { inject, observer } from "mobx-react";

const { Option } = Select;

class ConfigurationSettings extends Component {
  constructor() {
    super();
    //state initialization
    this.state = {
      data: [],
      dateFormat: null,
      fee_paid : false,
    };
  }
  componentDidMount() {
    //api call
    this.fetchSettingsData();
  }

  fetchSettingsData = () => {
    if (document.getElementById("settings-spin") !== null)
      document.getElementById("settings-spin").style.display = "block";
    AuthService.requestMethod("/configurationIndex")
      .then((response) => {
        if (document.getElementById("settings-spin") !== null)
          document.getElementById("settings-spin").style.display = "none";
        if (response && response.data) {
          this.setState({
            data: response.data,
          });

          Object.entries(response.data).forEach(([key, value]) => {
            if (value.key && value.key === "display_date_format") {
              this.setState({
                dateFormat: value.value,
              });
            }
            if (value.key && value.key === "fee_paid_or_not_confirmation") {
              this.setState({
                fee_paid: value.value == 'Yes' ? true:false,
              });
            }
          });
        }
      })
      .catch((error) => {
        if (document.getElementById("settings-spin") !== null)
          document.getElementById("settings-spin").style.display = "none";
        console.log(error);
      });
  };

  handleBlur = (key, value, e) => {
    const formData = new FormData();
    if(value==='fee'){
      this.setState({
        fee_paid: !key
      });
      formData.append('fee_paid_or_not_confirmation', key?'NO':'Yes');
    }else{
      if (value === e.target.value) return;
      formData.append(key, e.target.value);
    }
    this.updateConfigurationData(formData);
  };

  updateConfigurationData = (body) => {
    message.destroy();
    if (document.getElementById("settings-spin") !== null)
      document.getElementById("settings-spin").style.display = "block";
    AuthService.requestWithPost("/configurationUpdate", body)
      .then((response) => {
        if (document.getElementById("settings-spin") !== null)
          document.getElementById("settings-spin").style.display = "none";
        if (response && response.data && response.data.status === "success") {
          message.success(response.data.message);
        } else if (response.data.status === "error") {
          message.success(response.data.message);
        }
      })
      .catch((error) => {
        if (document.getElementById("settings-spin") !== null)
          document.getElementById("settings-spin").style.display = "none";
        console.log(error);
      });
  };

  handleChange = (value) => {
    const formData = new FormData();
    formData.append("display_date_format", value);
    this.setState({ dateFormat: value });

    this.updateConfigurationData(formData);
    this.props.dataStore.settings.dateFormat = value;
  };

  render() {
    const { data, dateFormat,fee_paid } = this.state;
    return (
      <div className="configuration-settings-container">
        <div
          id="settings-spin"
          style={{ display: "none", position: "relative" }}
        >
          <Spin className="spin-user" size="large" />
        </div>
        <Card className="certificate-profile-header">
          Configuration Settings{" "}
        </Card>
        <div className="configuration-settings-divider" />
        <div className="configuration-settings-wrapper">
          {data.map((item, index) => (
            <>
              {item.key === "display_date_format" ? (
                <>
                  <div className="configuration-settings-header" key={index}>
                    {item.text}
                  </div>
                  <div className="configuration-settings-input">
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select a date format"
                      onChange={this.handleChange}
                      value={dateFormat}
                    >
                      {dateFormatArray.length > 0
                        ? dateFormatArray.map((date, index) => {
                            return (
                              <Option value={date.value}>{date.label}</Option>
                            );
                          })
                        : null}
                    </Select>
                  </div>
                </>
              ) : (
                item.key === "fee_paid_or_not_confirmation" ?(<>
                  <div className="configuration-settings-header" key={index}>
                    {item.text}
                  </div>
                  <div className="configuration-settings-input">
                    {/* <Input
                      defaultValue={item.value}
                      onBlur={this.handleBlur.bind(this, item.key, item.value)}
                    /> */}
                    <Switch
                      checked={fee_paid}
                      onChange={this.handleBlur.bind(this, fee_paid, 'fee')}
                    />
                  </div>
                </>):(
                <>
                  <div className="configuration-settings-header" key={index}>
                    {item.text}
                  </div>
                  <div className="configuration-settings-input">
                    <Input
                      defaultValue={item.value}
                      onBlur={this.handleBlur.bind(this, item.key, item.value)}
                    />
                  </div>
                </>
              )
              )}
            </>
          ))}
        </div>
      </div>
    );
  }
}

export default inject("dataStore")(observer(ConfigurationSettings));
