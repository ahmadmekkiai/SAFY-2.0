// Push Notifications Library
// Handles browser push notifications for new ad campaigns

export interface PushNotification {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    tag?: string;  // Unique identifier to prevent duplicates
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
    return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
    if (!isNotificationSupported()) {
        return 'denied';
    }
    return Notification.permission;
}

/**
 * Request notification permission from user
 * @returns Promise<boolean> - true if granted, false otherwise
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!isNotificationSupported()) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.log('Notification permission was previously denied');
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
}

/**
 * Show browser notification
 * @param notification - Notification configuration
 */
export function showNotification(notification: PushNotification): void {
    if (!isNotificationSupported()) {
        console.warn('Notifications not supported');
        showToast({ message: notification.body, type: 'info' });
        return;
    }

    if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        showToast({ message: 'Please enable notifications first', type: 'warning' });
        return;
    }

    try {
        const n = new Notification(notification.title, {
            body: notification.body,
            icon: notification.icon || '/logo.png',
            badge: notification.badge || '/logo.png',
            tag: notification.tag,
            data: notification.data,
            requireInteraction: false,
        });

        // Auto-close after 10 seconds
        setTimeout(() => n.close(), 10000);

        // Handle click event
        n.onclick = (event) => {
            event.preventDefault();
            window.focus();
            n.close();

            // Navigate to the campaign if data is provided
            if (notification.data?.campaignId) {
                // Trigger custom event for campaign click
                window.dispatchEvent(new CustomEvent('notification-click', {
                    detail: { campaignId: notification.data.campaignId }
                }));
            }
        };
    } catch (error) {
        console.error('Failed to show notification:', error);
        showToast({ message: notification.body, type: 'info' });
    }
}

export function showTestNotification(): void {
    if (Notification.permission !== 'granted') {
        showToast({ message: 'Please enable notifications first', type: 'warning' });
        return;
    }

    const notification: PushNotification = {
        title: 'SAFY Test Notification',
        body: 'Push notifications are working! You\'ll receive alerts for new campaigns.',
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'test-notification',
        data: { type: 'test' }
    };

    showNotification(notification);
}
/**
 * Create notification for new ad campaign
 */
export function createCampaignNotification(
    campaignTitle: string,
    potentialReward: number,  // In SAR
    campaignId: string
): PushNotification {
    const points = Math.floor(potentialReward * 200);

    return {
        title: `New Deal: ${campaignTitle}`,
        body: `Watch ad to earn up to ₪${potentialReward} (${points.toLocaleString()} Points)`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: `campaign-${campaignId}`,
        data: {
            campaignId,
            type: 'new-campaign',
            potentialReward,
            points
        }
    };
}

/**
 * Create notification for reward earned
 */
export function createRewardNotification(
    sarEarned: number,
    pointsEarned: number
): PushNotification {
    return {
        title: '🎉 Reward Earned!',
        body: `You earned ₪${sarEarned.toFixed(2)} (${pointsEarned.toLocaleString()} Points)`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'reward-earned',
        data: {
            type: 'reward-earned',
            sarEarned,
            pointsEarned
        }
    };
}

/**
 * Show toast notification (fallback for when browser notifications are disabled)
 */
export interface ToastOptions {
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    duration?: number;  // milliseconds
}

export function showToast(options: ToastOptions): void {
    const {
        message,
        type = 'info',
        duration = 3000
    } = options;

    // Dispatch custom event that can be caught by a toast component
    window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message, type, duration }
    }));
}

/**
 * Initialize notification system
 * Call this when app loads to request permission if needed
 */
export async function initializeNotifications(): Promise<boolean> {
    if (!isNotificationSupported()) {
        console.log('Notifications not supported in this browser');
        return false;
    }

    const permission = getNotificationPermission();
    console.log('Notification permission status:', permission);

    return permission === 'granted';
}
