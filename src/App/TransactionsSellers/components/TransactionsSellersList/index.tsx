import React from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Timeline from '@bit/vitorbarbosa19.ziro.timeline'

export default ({ transactions, btnMoreClick, hasMore, isSearching }) => {
  const [, setLocation] = useLocation()
  console.log(transactions)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Timeline
        transactions={transactions}
        transactionClick={({ transaction }) => setLocation(`/transacoes-fabricantes/${transaction.transactionId}`)}
        btnMoreClick={btnMoreClick}
        hasMore={hasMore}
        isSearching={isSearching}
        messageEmptyTransactions="Não há transações para os filtros selecionados"
        messageWelcomeTransactions="Fim das transações"
      />
    </motion.div>
  )
}
