import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Card, Table, message, Spin, Input } from "antd";
import AuthService from "../../services/api";
class StudentDetailsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                current: 1,
                pagesize: 5,
            },
            student_id: '',
            student_name: '',
            email: ''
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

        AuthService.requestWithPost("/students", formData)
            .then((response) => {
                this.props.dataStore.reports.certificateCsvData = [];
                if (document.getElementById("requested-list-spin") !== null)
                    document.getElementById("requested-list-spin").style.display = "none";
                if (response) {
                    this.setState({
                        data: response.data.students,
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
        if (this.state.student_id) formData.append("student_id", this.state.student_id);
        if (this.state.student_name) formData.append("student_name", this.state.student_name);
        if (this.state.email) formData.append("email", this.state.email);
        AuthService.requestWithPost("/searchStudent", formData)
            .then((response) => {
                this.props.dataStore.reports.certificateCsvData = [];
                if (document.getElementById("requested-list-spin") !== null)
                    document.getElementById("requested-list-spin").style.display = "none";
                if (response) {
                    this.setState({
                        data: response.data.students,
                    });
                }
            })
            .catch((error) => {
                if (document.getElementById("requested-list-spin") !== null)
                    document.getElementById("requested-list-spin").style.display = "none";
                console.log(error);
            });

    }
    handleRequestCertificate = (index) => {
        console.log('index', index);
        this.props.history.push({
            pathname: "/certificates/request-certificate/" + index['id'],
            id: index['id'],
        });
    }
    importStudent = () => {
        this.props.history.push({
            pathname: "/settings/student-import",
        });
    }
    addStudent = () =>{
        this.props.history.push({
            pathname:"/master/add-student"
        })
    }
    render() {
        const { pagination } = this.state;
        let units_permission;
        if (localStorage.getItem("certificate-automation-authority")) {
            units_permission = JSON.parse(localStorage.getItem("certificate-automation-authority"))['permissions']['requested_certificate'];
        }
        let permission;
        if (localStorage.getItem("certificate-automation-authority")) {
            permission = JSON.parse(localStorage.getItem("certificate-automation-authority"))['permissions']['student_management'];
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
            }, {
                title: "Student ID",
                dataIndex: "student_id",
                key: "dob",
                width: 200,
                sorter: (a, b) => {
                    a = a.student_id || "";
                    b = b.student_id || "";
                    return a.localeCompare(b);
                },
                render: (student_id) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {student_id}
                        </span>
                    );
                },
            },
            {
                title: "First Name",
                dataIndex: "first_name",
                key: "first_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.first_name || "";
                    b = b.first_name || "";
                    return a.localeCompare(b);
                },
                render: (first_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {first_name}
                        </span>
                    );
                },
            }, {
                title: "Middle Name",
                dataIndex: "middle_name",
                key: "middle_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.middle_name || "";
                    b = b.middle_name || "";
                    return a.localeCompare(b);
                },
                render: (middle_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {middle_name}
                        </span>
                    );
                },
            }, {
                title: "Last Name",
                dataIndex: "last_name",
                key: "last_name",
                width: 200,
                sorter: (a, b) => {
                    a = a.last_name || "";
                    b = b.last_name || "";
                    return a.localeCompare(b);
                },
                render: (last_name) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {last_name}
                        </span>
                    );
                },
            }, {
                title: "Email",
                dataIndex: "email",
                key: "email",
                width: 200,
                sorter: (a, b) => {
                    a = a.email || "";
                    b = b.email || "";
                    return a.localeCompare(b);
                },
                render: (email) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {email}
                        </span>
                    );
                },
            }, {
                title: "Mobile",
                dataIndex: "mobile",
                key: "mobile",
                width: 200,
                sorter: (a, b) => {
                    a = a.mobile || "";
                    b = b.mobile || "";
                    return a.localeCompare(b);
                },
                render: (mobile) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {mobile}
                        </span>
                    );
                },
            }, {
                title: "Date of Birth",
                dataIndex: "dob",
                key: "dob",
                width: 200,
                sorter: (a, b) =>
                    new Date(a.dob) - new Date(b.dob),
                width: 150,
                render: (dob) => {
                    return (
                        <span
                            style={{
                                color: "#515974",
                            }}
                        >
                            {dob}
                        </span>
                    );
                },
            },
            {
                title: "Request Certificate",
                dataIndex: "",
                key: "",
                width: 180,
                render: (index) => {
                    return (
                        <>
                            {units_permission['add'] == 1 ? (
                                <span
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor: "#57c059",
                                        padding: "5px 15px 5px 15px",
                                        borderRadius: 15,
                                        color: "#fff",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.handleRequestCertificate(index);
                                    }}                        >
                                    <span>Request certificate</span>
                                </span>
                            ) : null}
                        </>
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
                <Card className="requested-list-header">STUDENT MANAGEMENT</Card>
                <div className="requested-list-vertical" />
                <div className="student-list-container">

                    <div className={`dashboard-search course`}>
                        <span className={`dashboard-text course`}>Student ID</span>
                        <Input
                            className={`dashboard-input course`}
                            placeholder="Student ID"
                            name="student_id" onChange={this.commonChange.bind(this)}
                        />
                    </div><div className={`dashboard-search course`}>
                        <span className={`dashboard-text course`}>Student Name</span>
                        <Input
                            className={`dashboard-input course`}
                            placeholder="Student Name"
                            name="student_name" onChange={this.commonChange.bind(this)}
                        />
                    </div><div className={`dashboard-search course`}>
                        <span className={`dashboard-text course`}>Student Email</span>
                        <Input
                            className={`dashboard-input course`}
                            placeholder="Student Email"
                            name="email" onChange={this.commonChange.bind(this)}
                        />
                    </div>
                    <div class="dashboard-search button" style={{ justifyContent: 'flex-end', alignSelf: 'center' }}>
                        <button type="button" class="ant-btn search" style={{ alignItems: 'center' }} onClick={this.getSearchData}>
                            <span>SEARCH</span></button>
                        {permission['add'] == 1 ? (<>
                            <button type="button" class="ant-btn search import" style={{ alignItems: 'center' }} 
                            onClick={this.importStudent}> Import Student</button>
                            <button type="button" class="ant-btn search add" style={{ alignItems: 'center' }}
                            onClick={this.addStudent} >Add Student</button></>) : null}
                    </div>
                </div>
                <Table
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    // columns={columns}
                    columns={
                        units_permission['add'] == 1
                            ? columns
                            : columns.filter(ea => ea.title !== "Request Certificate")
                    }
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
export default withRouter(inject("dataStore")(observer(StudentDetailsList)));

