import { Subscriber } from "../types";

export function getSubscriberCode(subscriber: Subscriber, subscribers: Subscriber[]) {
  // Get prefix based on plan
  const prefixMap = {
    Basic: "BS",
    Classic: "CL",
    Business: "BN"
  };
  
  const prefix = prefixMap[subscriber.plan];
  
  // Filter and sort subscribers with the same plan
  const samePlanSubscribers = subscribers
    .filter(s => s.plan === subscriber.plan)
    .sort((a, b) => {
      const dateA = new Date(a.created_at || '1970-01-01');
      const dateB = new Date(b.created_at || '1970-01-01');
      return dateA.getTime() - dateB.getTime();
    });
  
  // Find index of current subscriber
  const index = samePlanSubscribers.findIndex(s => s.id === subscriber.id);
  
  // Create sequence number with leading zeros (4 digits)
  const sequenceNumber = String(index + 1).padStart(4, '0');
  
  return `${prefix} ${sequenceNumber}`;
}