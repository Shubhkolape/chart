import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import data1 from '../../data1';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Filler,Legend);



function SessionInTimeChart() {


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' ,
      },
      scales: {
        yAxes: [{
          scaleLabel: { labelString: ["Two", "Four", "Six", "Eight", "Ten"] },
          ticks: { min: 2, max: 20, stepSize: 2, suggestedMin: 2, suggestedMax: 20},
          gridLines: {display: false}
        }]
       },
      title: {
        display: true,
        text: 'Agent Session data',
      },
    },
  };

      const labels = ["Session1", "Session2","Session3","Session4","Session5", "Session6", "Session7"];
    

    //  function for convert time format 
      function convertToNormalTime(timestampString) {
        const date = new Date(timestampString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
    
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return formattedHours + ':' + formattedMinutes;
    }


    const createdArray = data1.map(obj => obj.created)
    const endedArray = data1.map(obj => obj.ended)
    var getstartTime = createdArray.map(timestamp => convertToNormalTime(timestamp));
    // console.log("getstartTime", getstartTime);

    var getendTime = endedArray.map(timestamp => convertToNormalTime(timestamp));

    

    function getTimeDiff(time1, time2, unit) {
      var time1Parts = time1.split(":");
      var time2Parts = time2.split(":");
      var hours1 = parseInt(time1Parts[0]);
      var minutes1 = parseInt(time1Parts[1]);
      var hours2 = parseInt(time2Parts[0]);
      var minutes2 = parseInt(time2Parts[1]);
      var diffMinutes = (hours2 - hours1) * 60 + (minutes2 - minutes1);
      if (unit === 'h') {
          return diffMinutes / 60;
      }
      return diffMinutes;
  }



  var diffs = []; 
  for (var i = 0; i < getstartTime.length; i++) {
    var startTime = getstartTime[i].replace('.', ':'); 
    var endTime = getendTime[i].replace('.', ':'); 
    var diff = getTimeDiff(startTime, endTime, 'm'); 
    diffs.push(diff); 
}



        const data = {
          labels,
          datasets: [
            {
              fill: true,
              label: 'Agent Session Data (In Min)',
              data: diffs ,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        };
    
      return (
        <div className='session'>
            <Line options={options} data={data} />
        </div>
    );
  
}

export default SessionInTimeChart
