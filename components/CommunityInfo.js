
export default function CommunityInfo({ community }) {
  return (
    <div className="card p-4">
      <h2 className="text-lg font-bold mb-2">About Community</h2>
      
      <p className="text-sm text-gray-700 mb-4">
        {community.description}
      </p>
      
      <div className="text-xs text-gray-500 mb-4">
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span>Created</span>
          <span>{new Date(community.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-200">
          <span>Members</span>
          <span>{community.memberCount}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button className="btn-primary w-full">Create Post</button>
      </div>
    </div>
  )
}
