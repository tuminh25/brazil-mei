interface Props {
    params: Promise<{ slug: string }>
  }
  
  export default async function SimpleLocationCard({ params }: Props) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          📍 View location details above
        </p>
      </div>
    )
  }
  
