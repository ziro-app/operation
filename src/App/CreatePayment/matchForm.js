import React from 'react'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import ziroWithoutPlanWithInsurance from './forms/ziroWithoutPlanWithInsurance'
import ziroWithoutPlanWithoutInsurance from './forms/ziroWithoutPlanWithoutInsurance'
import withPlanWithInsurance from './forms/withPlanWithInsurance'
import withPlanWithoutInsurance from './forms/withPlanWithoutInsurance'
import withoutPlan from './forms/withoutPlan'

const matchForm = (state) => {
    const { type } = state;
    if (type === '') return [<FormInput name='' label='' input={<></>} />]
    if (type === 'ziroWithoutPlanWithInsurance') return ziroWithoutPlanWithInsurance(state)
    if (type === 'ziroWithoutPlanWithoutInsurance') return ziroWithoutPlanWithoutInsurance(state)
    if (type === 'withPlanWithInsurance') return withPlanWithInsurance(state)
    if (type === 'withPlanWithoutInsurance') return withPlanWithoutInsurance(state)
    if (type === 'withoutPlan') return withoutPlan(state)
}

export default matchForm
