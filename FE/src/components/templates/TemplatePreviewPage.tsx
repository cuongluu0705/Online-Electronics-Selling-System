import { Order } from '../../types';
import { EmailTemplate } from './EmailTemplate';
import { SMSTemplate } from './SMSTemplate';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Mail, MessageSquare, ArrowLeft } from 'lucide-react';

interface TemplatePreviewPageProps {
  order: Order;
  onBack: () => void;
}

export function TemplatePreviewPage({ order, onBack }: TemplatePreviewPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Email & SMS Templates</h1>
          <p className="text-gray-600">
            Preview of automated notifications sent to customers
          </p>
        </div>
        
        <Tabs defaultValue="email" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="size-4 mr-2" />
              Email Template
            </TabsTrigger>
            <TabsTrigger value="sms">
              <MessageSquare className="size-4 mr-2" />
              SMS Template
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <EmailTemplate order={order} />
          </TabsContent>
          
          <TabsContent value="sms">
            <SMSTemplate order={order} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
