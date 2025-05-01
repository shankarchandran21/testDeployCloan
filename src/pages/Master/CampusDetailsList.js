import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Card, Table, message, Spin } from "antd";
import AuthService from "../../services/api";
import {
    capitalizingFirstLetter,
  } from "../../utils/general";
class CampusDetailsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pagesize: 5,
            },
        };
        this.child = React.createRef();
    }
    componentDidMount() {
        //api call
        this.fetchData();
      }
      fetchData = () => {
        if (document.getElementById("requested-list-spin") !== null){
          document.getElementById("requested-list-spin").style.display = "block";
        }
        const formData = new FormData();

        AuthService.requestMethod("/campuses", formData)
        .then((response) => {
        this.props.dataStore.reports.certificateCsvData = [];
        if (document.getElementById("requested-list-spin") !== null)
            document.getElementById("requested-list-spin").style.display = "none";
        if (response) {
            this.setState({
                data: response.data.campuses,
            });
        }
        })
        .catch((error) => {
        if (document.getElementById("requested-list-spin") !== null)
            document.getElementById("requested-list-spin").style.display = "none";
        console.log(error);
        });

      }
      handleStandardTableChanges = (paginationProps) => {
        let { pagination } = this.state;
        pagination.pagesize = paginationProps.pagesize;
        pagination.current = paginationProps.current;
        // this.state.pagination = pagination;
        //api call
      };
      importCampus =() =>{
        this.props.history.push({
          pathname: "/settings/campus-import",
        });
      }
    render() {
        const { pagination } = this.state;
        let permission;
        if(localStorage.getItem("certificate-automation-authority")){
          permission = JSON.parse(localStorage.getItem("certificate-automation-authority"))['permissions']['campus_management'];
         }
        //columns
        const columns = [
          {
            title: "Sl.No",
            dataIndex: "",
            key: "",
            width: 75,
            render: (index, text, record) => {
              return (
                <>
                  {index.id ? (
                    <span
                      style={{
                        color: "#515974",
                      }}
                    >
                      {(pagination.current - 1) * 10 + record + 1}
                    </span>
                  ) : null}
                </>
              );
            },
          },
          {
            title: "Campus Name",
            dataIndex: "campus_name",
            key: "campus_name",
            width: 200,
            sorter: (a, b) => {
              a = a.campus_name || "";
              b = b.campus_name || "";
              return a.localeCompare(b);
            },
            render: (campus_name) => {
              return (
                <span
                  style={{
                    color: "#515974",
                  }}
                >
                  {campus_name}
                </span>
              );
            },
          },
          {
            title: "Campus ID",
            dataIndex: "campus_id",
            key: "campus_id",
            width: 200,
            sorter: (a, b) => {
              a = a.campus_id || "";
              b = b.campus_id || "";
              return a.localeCompare(b);
            },
            render: (campus_id) => {
              return (
                <span
                  style={{
                    color: "#515974",
                  }}
                >
                  {campus_id? capitalizingFirstLetter(campus_id):''}
                </span>
              );
            },
          },
          {
            title: "Campus Code",
            dataIndex: "campus_code",
            key: "campus_code",
            width: 200,
            sorter: (a, b) => {
              a = a.campus_code || "";
              b = b.campus_code || "";
              return a.localeCompare(b);
            },
            render: (campus_code) => {
              return (
                <span
                  style={{
                    color: "#515974",
                  }}
                >
                  {campus_code? capitalizingFirstLetter(campus_code):''}
                </span>
              );
            },
          },{
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 200,
            sorter: (a, b) => {
              a = a.address || "";
              b = b.address || "";
              return a.localeCompare(b);
            },
            render: (address) => {
              return (
                <span
                  style={{
                    color: "#515974",
                  }}
                >
                  {address? capitalizingFirstLetter(address):''}
                </span>
              );
            },
          },{
            title: "Short Name",
            dataIndex: "short_name",
            key: "short_name",
            width: 200,
            sorter: (a, b) => {
              a = a.short_name || "";
              b = b.short_name || "";
              return a.localeCompare(b);
            },
            render: (short_name) => {
              return (
                <span
                  style={{
                    color: "#515974",
                  }}
                >
                  {short_name? capitalizingFirstLetter(short_name):''}
                </span>
              );
            },
          },
        ];
        return (<>
            <div className="requested-list-container">
            <div
            id="requested-list-spin"
            style={{ display: "none", position: "relative" }}
            >
            <Spin className="spin-user" size="large" />
            </div>
            <Card className="requested-list-header">CAMPUS MANAGEMENT</Card>
            <div className="requested-list-vertical" />
            {permission['add'] ==1 ?(
                <div class="campus-list-container">
                    <div class="dashboard-search button" style={{ justifyContent: 'flex-end', alignSelf: 'center' }}>
                    {permission['add'] ==1 ?
                        (<button type="button" class="ant-btn search import" style={{ alignItems: 'center' }} onClick={this.importCampus}>
                            <span>Import Campus</span></button>
                        /* <button type="button" class="ant-btn search add" style={{ alignItems: 'center' }}>
                            <span>Add Campus</span></button> */):null}
                    </div>
                </div>):null}
            <Table
                rowClassName={(record, index) =>
                    index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
                columns={columns}
                dataSource={this.state.data}
                className="requested-list-table"
                pagination={pagination}
                pagesize={pagination.pagesize}
                onChange={this.handleStandardTableChanges}
                />
            </div>
        </>)
    }

}

export default withRouter(inject("dataStore")(observer(CampusDetailsList)));
