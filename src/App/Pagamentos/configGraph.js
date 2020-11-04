export const dataConfig = (arrayParcela1, arrayParcela2) => {
    return [
        {
        name:'Parcela 1',
        label: 'Parcela 1',
        data: arrayParcela1,
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        name:'Parcela 2',
        label: 'Parcela 2',
        data: arrayParcela2,
        backgroundColor: 'rgb(54, 162, 235)',
      },
    ]        
}
      
export const optionsConfig = (categories, nickname) => {
    return {  
        chart: {
            type: 'bar',
            height: 350,
            stacked: true
        },
        plotOptions: {
            bar: {
              horizontal: true,
            },
        },
        colors:['#2D9CDB', '#4BCA81', '#F7BA00', '#FFE401', '#EB5757', '#222222'],
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        title: {
            text: `PAGAMENTOS POR MÊS`,
            align: 'center',
            style: {
                fontFamily:  'Rubik, sans-serif',
                fontSize: '16px',
                maxWidth:'250px'
            },
        },    
        xaxis: {
            categories,
        },
        yaxis: {
            title: {
            text: undefined
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
        }
    }
}