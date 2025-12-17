import { useState, useEffect } from 'react';
import { transactionService } from '../utils/transactionService';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import BudgetSettings from './BudgetSettings';

const Transactions = () => {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = () => {
    setEditingTransaction(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Transactions
      </h1>

      {/* Budget Settings */}
      <div className="mb-8">
        <BudgetSettings key={refreshKey} />
      </div>

      {/* Transaction Form */}
      <div className="mb-8">
        <TransactionForm 
          onSuccess={handleTransactionSuccess}
          editTransaction={editingTransaction}
          onCancel={handleCancelEdit}
        />
      </div>

      {/* Transaction List */}
      <TransactionList 
        onEdit={handleEdit}
        refreshTrigger={refreshKey}
      />
    </div>
  );
};

export default Transactions;