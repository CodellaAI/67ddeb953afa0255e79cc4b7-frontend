
'use client'

import { FaHotjar, FaChartLine, FaClock } from 'react-icons/fa'

export default function FeedFilter({ currentFilter, setFilter }) {
  const filters = [
    { id: 'hot', label: 'Hot', icon: <FaHotjar /> },
    { id: 'top', label: 'Top', icon: <FaChartLine /> },
    { id: 'new', label: 'New', icon: <FaClock /> }
  ]

  return (
    <div className="card p-2 mb-4">
      <div className="flex">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`flex items-center px-3 py-1.5 rounded-full mr-2 text-sm font-medium ${
              currentFilter === filter.id
                ? 'bg-gray-200 text-gray-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setFilter(filter.id)}
          >
            <span className="mr-1">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
