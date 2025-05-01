import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Card, Table, message, Spin, Input } from "antd";
import AuthService from "../../services/api";
class CourseDetailsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pagesize: 5,
            },
            course_code:'',
            course_id:'',
            course_name:''
        };
        this.child = React.createRef();
    }
    componentDidMount() {
        //api call
        this.fetchData();
    }
    fetchData = () => {
        if (document.getElementById("requested-list-spin") !== null) {
            document.getElementById("requested-list-spin").style.display = "block";
        }
        const formData = new FormData();

        AuthService.requestMethod("/courses", formData)
            .then((response) => {
                this.props.dataStore.reports.certificateCsvData = [];
                if (document.getElementById("requested-list-spin") !== null)
                    document.getElementById("requested-list-spin").style.display = "none";
                if (response) {
                    this.setState({
                        data: response.data.courses,
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
    commonChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    getSearchData = () => {
        if (document.getElementById("requested-list-spin") !== null) {
            document.getElementById("requested-list-spin").style.display = "block";
        }
        const formData = new FormData();
        if(this.state.course_code) formData.append("course_code", this.state.course_code);
        if(this.state.course_id) formData.append("course_id", this.state.course_id);
        if(this.state.course_name) formData.append("course_name", this.state.course_name);
        AuthService.requestWithPost("/searchCourse", formData)
            .then((response) => {
                this.props.dataStore.reports.certificateCsvData = [];
                if (document.getElementById("requested-list-spin") !== null)
                    document.getElementById("requested-list-spin").style.display = "none";
                if (response) {
                    this.setState({
                        data: response.data.courses,
                    });
                }
            })
            .catch((error) => {
                if (document.getElementById("requested-list-spin") !== null)
                    document.getElementById("requested-list-spin").style.display = "none";
                console.log(error);
            });

    }
    importCourse =() =>{
        this.props.history.push({
          pathname: "/settings/course-import",
        });
      }
    render() {
        const { pagination } = this.state;
        const { props } = this.props;
        let permission;
        if(localStorage.getItem("certificate-automation-authority")){
          permission = JSON.parse(localStorage.getItem("certificate-automation-authority"))['permissions']['course_management'];
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
                title: "Course Name",
                dataIndex: "course_name",
                key: "course_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.course_name || "";
                    b = b.course_name || "";
                    return a.localeCompare(b);
                },
                render: (course_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {course_name}
                        </span>
                    );
                },
            },
            {
                title: "Certificate Course Name",
                dataIndex: "certificate_course_name",
                key: "certificate_course_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.certificate_course_name || "";
                    b = b.certificate_course_name || "";
                    return a.localeCompare(b);
                },
                render: (certificate_course_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {certificate_course_name}
                        </span>
                    );
                },
            },
            {
                title: "Course Code",
                dataIndex: "course_code",
                key: "course_code",
                width: 200,
                sorter: (a, b) => {
                    a = a.course_code || "";
                    b = b.course_code || "";
                    return a.localeCompare(b);
                },
                render: (course_code) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {course_code}
                        </span>
                    );
                },
            }, {
                title: "Course ID",
                dataIndex: "course_id",
                key: "course_id",
                width: 200,
                sorter: (a, b) => {
                    a = a.course_id || "";
                    b = b.course_id || "";
                    return a.localeCompare(b);
                },
                render: (course_id) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {course_id}
                        </span>
                    );
                },
            }, {
                title: "Course Short Name",
                dataIndex: "course_short_name",
                key: "course_short_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.course_short_name || "";
                    b = b.course_short_name || "";
                    return a.localeCompare(b);
                },
                render: (course_short_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {course_short_name}
                        </span>
                    );
                },
            }, {
                title: "Expiry Date",
                dataIndex: "expiry_date",
                key: "expiry_date",
                width: 150,
                sorter: (a, b) =>
                    new Date(a.expiry_date) - new Date(b.expiry_date),
                render: (index) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {index}
                        </span>
                    );
                },
            }, {
                title: "Graduate Certificate Course Name",
                dataIndex: "graduate_certificate_course_name",
                key: "graduate_certificate_course_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.graduate_certificate_course_name || "";
                    b = b.graduate_certificate_course_name || "";
                    return a.localeCompare(b);
                },
                render: (graduate_certificate_course_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {graduate_certificate_course_name}
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
                <Card className="requested-list-header">COURSE MANAGEMENT</Card>
                <div className="requested-list-vertical" />
                <div class="course-list-container">
                <div className={`dashboard-search course`}>
                        <span className={`dashboard-text course`}>Course Code</span>
                        <Input
                            className={`dashboard-input course`}
                            placeholder="Course Code"
                            name="course_code" onChange={this.commonChange.bind(this)}
                        />
                    </div>
                    <div className={`dashboard-search course`}>
                        <span className={`dashboard-text course`}>Course Name</span>
                        <Input
                            className={`dashboard-input course`}
                            placeholder="Course Name"
                            name="course_name" onChange={this.commonChange.bind(this)}
                        />
                    </div>
                    <div className={`dashboard-search course`}>
                        <span className={`dashboard-text course`}>Course ID</span>
                        <Input
                            className={`dashboard-input course`}
                            placeholder="Course ID"
                            name="course_id" onChange={this.commonChange.bind(this)}
                        />
                    </div>
                    <div class="dashboard-search button" style={{ justifyContent: 'flex-end', alignSelf: 'center' }}>
                        <button type="button" class="ant-btn search" style={{ alignItems: 'center' }} onClick={this.getSearchData}>
                            <span>SEARCH</span></button>
                            {permission['add'] ==1 ? (<button type="button" class="ant-btn search import" style={{ alignItems: 'center' }}  onClick={this.importCourse}>
                            <span>Import Course</span></button>
                        /* <button type="button" class="ant-btn search add" style={{ alignItems: 'center' }}>
                            <span>Add Course</span></button> */):null}
                    </div>
                </div>

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

export default withRouter(inject("dataStore")(observer(CourseDetailsList)));

