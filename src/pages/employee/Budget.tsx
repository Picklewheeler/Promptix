import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PiggyBank, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock data - Replace with actual data from your backend
const initialBudgets = [
  {
    id: 1,
    department: 'Engineering',
    totalBudget: 250000,
    spent: 120000,
    remaining: 130000,
    status: 'Under Budget',
  },
  {
    id: 2,
    department: 'Marketing',
    totalBudget: 150000,
    spent: 95000,
    remaining: 55000,
    status: 'On Track',
  },
  {
    id: 3,
    department: 'Design',
    totalBudget: 100000,
    spent: 85000,
    remaining: 15000,
    status: 'Near Limit',
  },
  {
    id: 4,
    department: 'Sales',
    totalBudget: 200000,
    spent: 180000,
    remaining: 20000,
    status: 'Near Limit',
  },
];

const BudgetCard: React.FC<{
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}> = ({ title, value, subtitle, icon, trend, trendValue }) => (
  <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-[rgba(255,85,82,0.1)] rounded-full">
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <h3 className="text-2xl font-semibold text-white">{value}</h3>
    <p className="text-gray-400 text-sm mt-1">{title}</p>
    <p className="text-[#FF5552] text-xs mt-2">{subtitle}</p>
  </Card>
);

const Budget: React.FC = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handleEdit = (id: number, value: number) => {
    setEditingId(id);
    setEditValue(value);
  };

  const handleSave = (id: number) => {
    setBudgets(budgets.map(budget => {
      if (budget.id === id) {
        const difference = editValue - budget.totalBudget;
        return {
          ...budget,
          totalBudget: editValue,
          remaining: budget.remaining + difference,
        };
      }
      return budget;
    }));
    setEditingId(null);
  };

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.totalBudget, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalRemaining = budgets.reduce((acc, curr) => acc + curr.remaining, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Budget Management</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BudgetCard
          title="Total Budget"
          value={`$${totalBudget.toLocaleString()}`}
          subtitle="Fiscal Year 2025"
          icon={<PiggyBank size={24} className="text-[#FF5552]" />}
        />
        <BudgetCard
          title="Total Spent"
          value={`$${totalSpent.toLocaleString()}`}
          subtitle="Year to Date"
          icon={<DollarSign size={24} className="text-[#FF5552]" />}
          trend="up"
          trendValue="12.5%"
        />
        <BudgetCard
          title="Remaining Budget"
          value={`$${totalRemaining.toLocaleString()}`}
          subtitle="Available Funds"
          icon={<TrendingUp size={24} className="text-[#FF5552]" />}
        />
      </div>

      {/* Department Budgets */}
      <Card className="p-6 bg-[rgba(33,33,43,0.95)] backdrop-blur-md border-white/10">
        <h2 className="text-xl font-semibold mb-6">Department Budgets</h2>
        <div className="space-y-6">
          {budgets.map((budget) => (
            <div key={budget.id} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{budget.department}</h3>
                  <p className="text-sm text-gray-400">Fiscal Year 2025</p>
                </div>
                <div className="flex items-center space-x-4">
                  {editingId === budget.id ? (
                    <>
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-32 bg-[rgba(255,255,255,0.05)] border-white/10 text-white"
                      />
                      <Button
                        onClick={() => handleSave(budget.id)}
                        className="bg-[#FF5552] hover:bg-[#F62623] text-white"
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEdit(budget.id, budget.totalBudget)}
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      Edit Budget
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Total Budget</p>
                  <p className="text-lg font-semibold">${budget.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Spent</p>
                  <p className="text-lg font-semibold">${budget.spent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Remaining</p>
                  <p className="text-lg font-semibold">${budget.remaining.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${
                      budget.status === 'Near Limit' ? 'bg-yellow-500' :
                      budget.status === 'Over Budget' ? 'bg-red-500' :
                      'bg-[#FF5552]'
                    }`}
                    style={{ width: `${(budget.spent / budget.totalBudget) * 100}%` }}
                  />
                </div>
                <p className={`text-sm mt-2 ${
                  budget.status === 'Near Limit' ? 'text-yellow-500' :
                  budget.status === 'Over Budget' ? 'text-red-500' :
                  'text-green-500'
                }`}>
                  {budget.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Budget;
