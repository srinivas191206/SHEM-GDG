import React, { useState, useEffect } from 'react';
import { CurrencyRupeeIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

const BudgetWidget = ({ currentCost }) => {
    const [budget, setBudget] = useState(() => {
        const saved = localStorage.getItem('energy_budget');
        return saved ? parseFloat(saved) : 2000;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempBudget, setTempBudget] = useState(budget);

    useEffect(() => {
        localStorage.setItem('energy_budget', budget.toString());
    }, [budget]);

    const percentage = Math.min((currentCost / budget) * 100, 100);
    const isOverBudget = currentCost > budget;
    const isWarning = percentage > 85;

    const handleSave = () => {
        setBudget(tempBudget);
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <CurrencyRupeeIcon className="h-6 w-6 text-green-600" />
                    Monthly Budget
                </h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-400 hover:text-primary transition-colors"
                >
                    <PencilSquareIcon className="h-5 w-5" />
                </button>
            </div>

            {isEditing ? (
                <div className="flex gap-2 mb-4">
                    <input
                        type="number"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Set budget..."
                    />
                    <button
                        onClick={handleSave}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark"
                    >
                        Save
                    </button>
                </div>
            ) : null}

            <div className="mb-2 flex justify-between items-end">
                <div>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{currentCost.toFixed(0)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ ₹{budget}</span>
                </div>
                <span className={`text-sm font-bold ${isOverBudget ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-green-500'}`}>
                    {percentage.toFixed(0)}%
                </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {isOverBudget ? '⚠️ You have exceeded your monthly budget.' :
                    isWarning ? '⚠️ You are approaching your budget limit.' :
                        '✅ You are within your budget for this month.'}
            </p>
        </div>
    );
};

export default BudgetWidget;
