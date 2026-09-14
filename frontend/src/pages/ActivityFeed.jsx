import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { activityAPI } from '@/lib/apiClient';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    activityAPI.getActivities()
      .then((response) => { if (active) setActivities(response.data?.activities || response.data || []); })
      .catch(() => { if (active) setError('Unable to load activities right now.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8"><h1 className="text-4xl font-bold mb-2">Activity Feed</h1><p className="text-gray-600">Latest updates from our organization</p></div>
        {loading && <div className="text-center">Loading activities...</div>}
        {!loading && error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && activities.length === 0 && <div className="text-center text-gray-600">No published activities yet.</div>}
        {!loading && !error && <div className="space-y-6">
          {activities.map((activity) => (
            <Card key={activity._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader><div className="flex justify-between items-start"><div><CardTitle>{activity.title}</CardTitle><CardDescription>by {activity.authorId?.name || 'NGO team'} • {activity.created_at ? new Date(activity.created_at).toLocaleDateString() : ''}</CardDescription></div></div></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{activity.description}</p>
                {activity.imageUrls?.length > 0 && <div className="grid grid-cols-2 gap-4">{activity.imageUrls.map((url, index) => <img key={`${url}-${index}`} src={url} alt={`Activity ${index + 1}`} loading="lazy" className="w-full h-48 object-cover rounded-lg" />)}</div>}
                <div className="flex justify-between items-center pt-4 border-t"><div className="flex gap-4 text-sm text-gray-600"><span>{activity.likes?.length || 0} likes</span><span>{activity.comments?.length || 0} comments</span></div><Button variant="outline" size="sm" type="button">View Details</Button></div>
              </CardContent>
            </Card>
          ))}
        </div>}
      </div>
    </div>
  );
}
