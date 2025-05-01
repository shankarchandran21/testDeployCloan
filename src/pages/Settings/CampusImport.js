import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import ImportData from "../../components/ImportData/ImportData";

class CampusImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Campus Import',
            endpoint: '/importCampus',
            subhead: 'Add Campus Details',
            sampleLink: 'https://api-test-cat.edusystems.com.au/public/sample_file_formats/campus_excel.csv'
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
export default withRouter(inject("dataStore")(observer(CampusImport)));
