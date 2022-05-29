import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import axios from './axios.js';
import React, { Component } from 'react';
import { MDBContainer, MDBDataTable, MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';

class App extends Component {
    state = {
        selectedFile: null,
        data: null,
        prediction: null
    };

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    }

    onFileUpload = () => {
        if (this.state.selectedFile == null) {
            return alert("Please select a csv file first!")
        }

        const formData = new FormData();
        formData.append(
            "test-csv",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        axios.post("upload_csv", formData).then(res => {
            console.log(res.data);

            this.setState({ 
                data: res.data.data,
                prediction: res.data.prediction
            });
        });
    }

    generateDataTable = () => {
        var rows = []
        this.state.data.forEach((row, index) => {
            if (index > 0) {
                var obj = {
                    first: row[0],
                    second: row[1],
                    third: "...",
                    fourth: row[row.length-2],
                    fifth: row[row.length-1]
                }
                rows.push(obj)
            }
        })

        var cleanedData = {
            columns: [
                {
                    label: this.state.data[0][0],
                    field: 'first',
                },
                {
                    label: this.state.data[0][1],
                    field: 'second',
                },
                {
                    label: "...",
                    field: 'third',
                },
                {
                    label: this.state.data[0][this.state.data[0].length-2],
                    field: 'fourth',
                },
                {
                    label: this.state.data[0][this.state.data[0].length-1],
                    field: 'fifth',
                },
            ],
            rows: rows
        }

        return <MDBDataTable
            striped
            data={cleanedData}
        />
    }

    generatePredictionTable = () => {
        var rows = []
        this.state.prediction.forEach((row, index) => {
            var obj = {
                first: row,
            }
            rows.push(obj)
        })

        var cleanedData = {
            columns: [
                {
                    label: "Activity",
                    field: 'first',
                },
            ],
            rows: rows
        }

        return <MDBDataTable
            striped
            data={cleanedData}
        />
    }

    render() {
        return (
            <div id='landing'>
                <MDBContainer style={styles.section} className='d-flex'>
                    <h1>Step 1: Upload your file</h1>
                </MDBContainer>

                <MDBContainer className='d-flex'>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <button onClick={this.onFileUpload} className="btn-success input-group-text" id="upload-button">
                                Upload!
                            </button>
                        </div>
                        <div className="custom-file">
                            <input
                                onChange = {this.onFileChange}
                                type="file"
                                accept=".csv"
                                className="custom-file-input"
                                id="file-input"
                            />
                            <label className="custom-file-label" htmlFor="file-input">
                                { this.state.selectedFile ? this.state.selectedFile.name : "Choose file" }
                            </label>
                        </div>
                    </div>
                </MDBContainer>

                <MDBContainer style={styles.section} className='d-flex'>
                    <h1>Step 2: Preview your file</h1>
                </MDBContainer>

                <MDBContainer className='d-flex'>
                    {
                        this.state.data ? 
                        this.generateDataTable()
                        :
                        "Data uploaded will appear here"
                    }
                </MDBContainer>



                <MDBContainer style={styles.section} className='d-flex'>
                    <h1>Step 3: Retrieve your prediction</h1>
                </MDBContainer>

                <MDBContainer className='d-flex'>
                    {
                        this.state.prediction ? 
                        this.generatePredictionTable()
                        :
                        "Prediction will appear here"
                    }
                </MDBContainer>
            </div>
        );
    }
}

const styles = {
        section: {
            width: '100%',
            padding: '2%'
        }
    };

export default App;
