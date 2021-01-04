import React, {useState, useEffect, useContext} from 'react'
import Chart from 'react-apexcharts'
import { motion } from 'framer-motion'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import Error from '@bit/vitorbarbosa19.ziro.error'
import fetch from './fetch'
import fetchGraph from './fetchGraph'
import { userContext } from '../appContext'

const ComissionManagement = () => {
    const [overviewData, setOverviewData] = useState([])
    const [series, setSeries] = useState([{name: 'Assessoria', data: [1000, 2000, 3000, 4000]}, {name: 'Vendas',data: [530, 320, 330, 520]}, {name: 'Recebimento',data: [120, 170, 110, 90]}, {name: 'Prospecção',data: [90, 70, 50, 80]}])
    const [sector, setSector] = useState('')
    const [sectores, setSectores] = useState([])
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)
    const state = {setOverviewData, setIsLoading, setError, setSeries, setSectores, sector, setData, data}
    const sectorIsInclude = ['Assessoria', 'Vendas', 'Recebimento', 'Prospecção'].includes(sector)
    const graphTilte = sectorIsInclude ? sector : 'Visão Geral'
    const { nickname } = useContext(userContext)
    const nome = nickname ? nickname.trim() : ''
    const allowedUsers = ['Mud','Uiller', 'Vitor', 'Claudia', 'Cesar']
    useEffect(() => fetch(state),[])
    useEffect(() => fetchGraph(state),[sector, sectores])
    if (process.env.HOMOLOG ? false : !allowedUsers.includes(nome)) return <Error type='paymentError' title='Sem acesso' message='Sem permissão para acessar essa página' btnMsg='Voltar' backRoute='/administrativo' />
    if(error) return <Error />
    if(isLoading) return <Spinner />
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Setor</h2>
            <Dropdown
                value={sector || ''}
                list={sectores}
                placeholder="Escolha um Setor"
                onChange={({ target: { value } }) => {setSector(value)}}
                onChangeKeyboard={element => element ? setSector(element.value) : null}
            />
            <h2>{graphTilte}</h2>
            <Chart options={overviewData.options} series={series} type="bar" width="100%" height='400px' />
        </motion.div>
    )
}

export default ComissionManagement