import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Activity {
    _id: string;
    title: string;
    description: string;
    imageUrls: string[];
    authorId: { name: string };
    likes: string[];
    comments: any[];
    created_at: string;
}

export default function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/activities');
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Activity Feed</h1>
                    <p className="text-gray-600">Latest updates from our organization</p>
                </div>

                {loading ? (
                    <div className="text-center">Loading activities...</div>
                ) : (
                    <div className="space-y-6">
                        {activities.map((activity) => (
                            <Card key={activity._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{activity.title}</CardTitle>
                                            <CardDescription>
                                                by {activity.authorId?.name} • {new Date(activity.created_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-gray-700">{activity.description}</p>

                                    {activity.imageUrls && activity.imageUrls.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {activity.imageUrls.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Activity ${index}`}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div className="flex gap-4 text-sm text-gray-600">
                                            <span>👍 {activity.likes?.length || 0} likes</span>
                                            <span>💬 {activity.comments?.length || 0} comments</span>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
