import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'chart.js/auto'

import axios from './axios.js';
import React, { Component } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { MDBContainer, MDBDataTable, MDBRow, MDBCol } from 'mdbreact';

class App extends Component {
    state = {
        selectedFile: null,
        data: null,
        prediction: null,
        visualisation: null
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
            this.setState({ 
                data: res.data.data,
                prediction: res.data.prediction,
                visualisation: res.data.visualisation
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

    generateVisualisation = () => {
        // Generate pie chart
        var label = []
        var data = []
        for (const [key, value] of Object.entries(this.state.visualisation.pie)) {
            label.push(key);
            data.push(value);
        }

        var dataPie = {
            labels: label,
            datasets: [
                {
                    label: 'The number of rows for each activity group in the training datasett',
                    data: data,
                    backgroundColor: [
                        "#F7464A",
                        "#46BFBD",
                        "#FDB45C",
                        "#949FB1",
                        "#4D5360",
                        "#AC64AD",
                    ],
                    hoverBackgroundColor: [
                        "#FF5A5E",
                        "#5AD3D1",
                        "#FFC870",
                        "#A8B3C5",
                        "#616774",
                        "#DA92DB",
                    ]
                }
            ]
        }

        // Generate confusion matrix as grouped bar chart
        var dataBar = {
            labels: this.state.visualisation.confusion.label,
            datasets: [
                {
                    label: this.state.visualisation.confusion.label[0],
                    backgroundColor: "#F7464A",
                    hoverBackgroundColor: "#FF5A5E",
                    data: this.state.visualisation.confusion.matrix[0]
                },

                {
                    label: this.state.visualisation.confusion.label[1],
                    backgroundColor: "#46BFBD",
                    hoverBackgroundColor: "#5AD3D1",
                    data: this.state.visualisation.confusion.matrix[1]
                },

                {
                    label: this.state.visualisation.confusion.label[2],
                    backgroundColor: "#FDB45C",
                    hoverBackgroundColor: "#FFC870",
                    data: this.state.visualisation.confusion.matrix[2]
                },

                {
                    label: this.state.visualisation.confusion.label[3],
                    backgroundColor: "#949FB1",
                    hoverBackgroundColor: "#A8B3C5",
                    data: this.state.visualisation.confusion.matrix[3]
                },

                {
                    label: this.state.visualisation.confusion.label[4],
                    backgroundColor: "#4D5360",
                    hoverBackgroundColor: "#616774",
                    data: this.state.visualisation.confusion.matrix[4]
                },

                {
                    label: this.state.visualisation.confusion.label[5],
                    backgroundColor: "#AC64AD",
                    hoverBackgroundColor: "#DA92DB",
                    data: this.state.visualisation.confusion.matrix[5]
                },
            ]
        }

        return (
            <MDBContainer>
                <MDBRow style={styles.chart}>
                    <MDBCol size="12">
                        <Pie data={dataPie} options={{ 
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'The number of rows for each activity group in the training dataset'
                                }
                            },
                            responsive: true 
                        }} />
                    </MDBCol>
                </MDBRow>

                <MDBRow style={styles.chart}>
                    <MDBCol size="12">
                        <Bar data={dataBar} options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'The number of predicted classes against the ground truth'
                                }
                            },
                            responsive: true 
                        }} />
                    </MDBCol>
                </MDBRow>

                <MDBRow style={styles.chart}>
                    <MDBCol size="12">
                        <h2>Accuracy: {this.state.visualisation.accuracy}</h2>
                        <p>Given that the training set is pretty balanced, the accuracy is a good measure of the model's performance</p>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
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


                <MDBContainer style={styles.section} className='d-flex'>
                    <h1>Step 4: Useful Visualisations</h1>
                </MDBContainer>

                <MDBContainer className='d-flex'>
                    {
                        this.state.visualisation ? 
                        this.generateVisualisation()
                        :
                        "Useful visualisation will appear here"
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
        },
        chart: {
            width: '75%',
            padding: '2%'
        }
    };

export default App;
