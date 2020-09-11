import React from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'wouter'
import Timeline from '@bit/vitorbarbosa19.ziro.timeline'

export default ({ transactions, btnMoreClick, hasMore, loadingMore }) => {
  const [, setLocation] = useLocation()
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Timeline
        transactions={transactions}
        transactionClick={({ transaction }) => setLocation(`/transacoes/${transaction.transactionId}`)}
        btnMoreClick={btnMoreClick}
        hasMore={hasMore}
        isSearching={loadingMore}
        messageEmptyTransactions="Não há transações para os filtros selecionados"
        messageWelcomeTransactions="Fim das transações"
      />
    </motion.div>
  )
}
