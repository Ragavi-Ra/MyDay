import notifee, { TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';

export async function scheduleDailyReminder() {
  await notifee.requestPermission();

  // Create a notification channel
  const channelId = await notifee.createChannel({
    id: 'reminder',
    name: 'Daily Reminder Channel',
  });

  // Cancel previous one to avoid duplicates on every app start
  await notifee.cancelNotification('daily-reminder-id');

  const now = new Date();
  const next9PM = new Date();
  next9PM.setHours(21, 0, 0, 0);

  if (now > next9PM) {
    next9PM.setDate(next9PM.getDate() + 1); // schedule for tomorrow if already past 9 PM
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: next9PM.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };


  // Schedule the notification
  await notifee.createTriggerNotification(
    {
      id: 'daily-reminder-id',
      title: '🕘 Reminder',
      body: 'Capture today before it slips away.',
      android: {
        channelId,
        // smallIcon: 'ic_notification',
        // largeIcon: 'largeicon',
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger
  );
}
