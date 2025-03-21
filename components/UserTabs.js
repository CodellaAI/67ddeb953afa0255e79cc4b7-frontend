
export default function UserTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'comments', label: 'Comments' },
  ]

  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === tab.id
                ? 'border-reddit-blue text-reddit-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
