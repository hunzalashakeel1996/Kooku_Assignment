import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Row, Col } from 'react-bootstrap'
import React, { lazy, Suspense, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'

function App() {
  // create states for the App.js
  const [state, setState] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    endDate: new Date(),
    graphData: [],
    labels: []
  });

  // shorthand notion to access keys inside object 
  const { startDate, endDate, graphData, labels } = state

  useEffect(() => {

  }, []);

  // method to update date from input selection
  const onDateChange = (key, value) => {
    // set date values according to key 
    setState({ ...state, [key]: value })
  }

  // get graph values from API 
  const onSubmit = () => {
    let tempStartDate = startDate.toISOString().substring(0, 10) // extract only date from datetime object
    let tempEndDate = endDate.toISOString().substring(0, 10) // extract only date from datetime object

    fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${tempStartDate}&end=${tempEndDate}`,
      { method: 'GET' }
    ).then(res => {
      return res.json()
    })
      .then(resJson => {
        if (resJson) {
          let data = resJson.bpi
          let tempData = []
          let tempLabels = []

          // extract date and value from data for graph
          Object.keys(data).map(key => {
            tempLabels.push(key)
            tempData.push(data[key])
          })
          setState({ ...state, graphData: [...tempData], labels: [...tempLabels] })
        }
      })
      .catch(err => { alert('Sorry, Please try again later!') })
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false
  }

  return (
    <div style={{ margin: 20 }}>
      <Row style={{ justifyContent: 'center' }}>
        {/* start date and end date should limit to current date because API return data till today only   */}
        {/* start date view  */}
        <Col sm={2}>
          <div style={{ flex: 0.3 }}>
            <p style={{ marginBottom: 2 }}>Start Date</p>
            <DatePicker maxDate={new Date()} selected={startDate} onChange={(date) => { onDateChange('startDate', date) }} />
          </div>
        </Col>

        {/* end date view  */}
        <Col sm={2}>
          <div style={{ flex: 0.3 }}>
            <p style={{ marginBottom: 2 }}>End Date</p>
            <DatePicker minDate={startDate} maxDate={new Date()} selected={endDate} onChange={(date) => { onDateChange('endDate', date) }} />
          </div>
        </Col>

        {/* submit button  */}
        <Col sm={2} style={{ display: 'flex' }}>
          <div style={{ flex: 0.4, display: 'flex', alignItems: 'flex-end' }}>
            <Button variant="success" onClick={onSubmit}>Submit</Button>
          </div>
        </Col>
      </Row>

      {graphData.length > 0 && <Row style={{ marginTop: 20 }}>
        <Col>
          {/* container for the graph  */}
          <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
            <Line
              data={{
                labels: labels,
                datasets: [{
                  label: 'Historical BPI data',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  width: '10px',
                  data: graphData,
                }]
              }}
              width={700}
              height={500}
              options={options}
            />
          </div>
        </Col>
      </Row>}
    </div>
  );
}

export default App;
