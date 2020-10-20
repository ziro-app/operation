const graphBasicConfig = (categories) => {
  return {
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true
      },
      colors:['#2D9CDB', '#4BCA81', '#F7BA00', '#FFE401', '#EB5757', '#222222'],
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      title: {
        text: undefined
      },
      xaxis: {
        categories,
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      }
    },
}
}

export default graphBasicConfig