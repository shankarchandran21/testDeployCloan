import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import ImportData from "../../components/ImportData/ImportData";

class CourseImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Course Import',
            endpoint: '/importCourse',
            subhead: 'Add Course Details',
            sampleLink: 'https://api-test-cat.edusystems.com.au/public/sample_file_formats/course_excel.csv'
        }
    }
    render() {
        return(
            <>
                <ImportData pageData={this.state}></ImportData>
            </>
        )
    }
}
export default withRouter(inject("dataStore")(observer(CourseImport)));
