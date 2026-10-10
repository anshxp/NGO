import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, Users } from 'lucide-react';
import { messageAPI } from '@/lib/apiClient';

export default function AdminMessages() {
  const form = useForm({ defaultValues: { recipientId: '', title: '', content: '' } });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await messageAPI.sendMessage({ ...data, recipientId: sendToAll ? undefined : data.recipientId.trim(), sendToAll });
      toast({ title: 'Message sent', description: sendToAll ? 'The message was broadcast to all members.' : 'The message was sent to the selected member.' });
      form.reset({ recipientId: '', title: '', content: '' });
      setSendToAll(false);
    } catch (error) {
      toast({ title: 'Message failed', description: error.response?.data?.error || 'Unable to send the message. Check the recipient and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header><h1 className="mb-2 text-4xl font-bold text-gray-900">Send Messages</h1><p className="text-gray-600">Send dashboard notifications to individual members or all members.</p></header>
        <Card className="max-w-2xl border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200 pb-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-600 p-3"><Mail className="h-6 w-6 text-white" /></div><div><CardTitle className="text-2xl">New Message</CardTitle><CardDescription>Individual messages require the member's email address or database ID.</CardDescription></div></div></CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Checkbox id="send-to-all" checked={sendToAll} onCheckedChange={(checked) => setSendToAll(checked === true)} />
                  <div><label htmlFor="send-to-all" className="flex cursor-pointer items-center gap-2 font-semibold text-gray-900"><Users className="h-4 w-4" />Send to all members</label><p className="mt-1 text-xs text-gray-600">Broadcast this message to all members.</p></div>
                </div>
                {!sendToAll && <FormField control={form.control} name="recipientId" rules={{ required: 'Member email or ID is required' }} render={({ field }) => <FormItem><FormLabel>Member email or ID</FormLabel><FormControl><Input {...field} autoComplete="off" placeholder="member@example.com or member ID" /></FormControl><FormMessage /></FormItem>} />}
                <FormField control={form.control} name="title" rules={{ required: 'Subject is required' }} render={({ field }) => <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} placeholder="e.g. Important update" /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name="content" rules={{ required: 'Message is required' }} render={({ field }) => <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea {...field} placeholder="Write a clear message…" className="min-h-40 resize-y" /></FormControl><FormMessage /></FormItem>} />
                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending…' : <><Send className="mr-2 h-4 w-4" />Send Message</>}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
