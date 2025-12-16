/**
 * Notification Service for Anomaly Alerts
 * Handles email (Nodemailer) and SMS (Twilio) notifications
 */

const nodemailer = require('nodemailer');
const NotificationLog = require('../models/NotificationLog');
const NotificationSettings = require('../models/NotificationSettings');

// ============================================================================
// CONFIGURATION
// ============================================================================

// Email transporter configuration
// Uses environment variables - set these in .env file
const createEmailTransporter = () => {
    // For development/testing, use ethereal or mailtrap
    // For production, use actual SMTP (Gmail, SendGrid, etc.)
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    });
};

// Twilio configuration (for SMS)
let twilioClient = null;
const initTwilio = () => {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        const twilio = require('twilio');
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }
    return twilioClient;
};

// Dashboard URL for links
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:5173/dashboard';

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Generate email HTML template for anomaly alert
 */
const generateEmailHTML = (anomalyData) => {
    const {
        timestamp,
        consumption,
        expectedRange,
        deviation,
        deviationPercent,
        possibleCauses,
        estimatedExtraCost,
        anomalyId
    } = anomalyData;

    const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const monthlyCost = estimatedExtraCost * 30;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SHEM Alert</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .stat-box { background: #f8fafc; border-radius: 8px; padding: 15px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: 700; color: #1f2937; }
        .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
        .alert-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 0 8px 8px 0; }
        .cause-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .cause-bar { height: 8px; background: #e5e7eb; border-radius: 4px; flex: 1; overflow: hidden; }
        .cause-bar-fill { height: 100%; background: #f97316; border-radius: 4px; }
        .cause-text { font-size: 14px; color: #4b5563; min-width: 150px; }
        .tip-box { background: #ecfdf5; border-radius: 8px; padding: 15px; }
        .tip-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
        .tip-item:last-child { margin-bottom: 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; text-align: center; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ High Power Alert</h1>
            <p>Unusual consumption detected at your home</p>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">📊 What Happened</div>
                <div class="stat-grid">
                    <div class="stat-box">
                        <div class="stat-label">Time</div>
                        <div class="stat-value" style="font-size: 18px;">${formattedTime}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Your Consumption</div>
                        <div class="stat-value">${consumption}W</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Normal Range</div>
                        <div class="stat-value" style="font-size: 18px;">${expectedRange.min}-${expectedRange.max}W</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Deviation</div>
                        <div class="stat-value" style="color: #dc2626;">${deviation}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">💰 Estimated Extra Cost</div>
                <div class="alert-box">
                    <div style="font-size: 20px; font-weight: 700; color: #dc2626;">₹${estimatedExtraCost} for this 1-hour spike</div>
                    <div style="font-size: 14px; color: #6b7280; margin-top: 5px;">Could be ₹${monthlyCost}+ per month if it happens daily</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🔍 Possible Causes</div>
                ${possibleCauses.map((cause, idx) => `
                    <div class="cause-item">
                        <span style="font-weight: 600;">${idx + 1}.</span>
                        <div class="cause-bar"><div class="cause-bar-fill" style="width: ${cause.likelihood}%;"></div></div>
                        <span class="cause-text">${cause.cause} (${cause.likelihood}% likely)</span>
                    </div>
                `).join('')}
            </div>

            <div class="section">
                <div class="section-title">✅ What You Can Do</div>
                <div class="tip-box">
                    <div class="tip-item">
                        <span>•</span>
                        <span>Check AC thermostat (set to 24-26°C for optimal efficiency)</span>
                    </div>
                    <div class="tip-item">
                        <span>•</span>
                        <span>Verify water heater is turned off or on timer</span>
                    </div>
                    <div class="tip-item">
                        <span>•</span>
                        <span>Check if devices are left on standby mode</span>
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="${DASHBOARD_URL}?anomalyId=${anomalyId}&action=view" class="cta-button">
                    View Full Details in Dashboard
                </a>
            </div>
        </div>

        <div class="footer">
            <p>You're receiving this because you have anomaly alerts enabled in SHEM.</p>
            <p>To manage your notification preferences, visit your <a href="${DASHBOARD_URL}?tab=settings">dashboard settings</a>.</p>
            <p style="margin-top: 15px;">— SHEM Team ⚡</p>
        </div>
    </div>
</body>
</html>
    `;
};

/**
 * Generate plain text email for fallback
 */
const generateEmailText = (anomalyData) => {
    const {
        timestamp,
        consumption,
        expectedRange,
        deviation,
        possibleCauses,
        estimatedExtraCost,
        anomalyId
    } = anomalyData;

    const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return `
⚠️ HIGH POWER ALERT - SHEM Energy Manager

We detected unusual power consumption at your home.

📊 WHAT HAPPENED:
- Time: ${formattedTime}
- Your consumption: ${consumption}W
- Normal at this hour: ${expectedRange.min}-${expectedRange.max}W
- Deviation: ${deviation}

💰 ESTIMATED EXTRA COST:
- ₹${estimatedExtraCost} for this 1-hour spike
- Could be ₹${estimatedExtraCost * 30}+ per month if it happens daily

🔍 POSSIBLE CAUSES:
${possibleCauses.map((c, i) => `${i + 1}. ${c.cause} (${c.likelihood}% likely)`).join('\n')}

✅ WHAT YOU CAN DO:
- Check AC thermostat (set to 24-26°C)
- Verify water heater is off
- Check if devices are left on standby

View Full Details: ${DASHBOARD_URL}?anomalyId=${anomalyId}&action=view

— SHEM Team
    `.trim();
};

// ============================================================================
// SMS TEMPLATE
// ============================================================================

/**
 * Generate SMS message (max 160 chars for single SMS)
 */
const generateSMSMessage = (anomalyData) => {
    const {
        timestamp,
        deviation,
        possibleCauses,
        anomalyId
    } = anomalyData;

    const time = new Date(timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const mainCause = possibleCauses[0]?.cause || 'Unknown';
    const shortUrl = `${DASHBOARD_URL}?a=${anomalyId.toString().slice(-6)}`;

    return `⚠️ SHEM Alert: Power spike at ${time} (${deviation}). Likely: ${mainCause}. Check now: ${shortUrl}`;
};

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Check if notification should be rate limited
 * @param {string} userId - User ID
 * @param {string} rateLimitKey - Key for rate limiting (e.g., 'anomaly_high_confidence')
 * @param {number} maxPerDay - Max notifications per day
 * @returns {Promise<boolean>} - True if should be rate limited
 */
const shouldRateLimit = async (userId, rateLimitKey, maxPerDay = 5) => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const count = await NotificationLog.countDocuments({
        userId,
        rateLimitKey,
        sentAt: { $gte: oneDayAgo },
        status: 'sent'
    });

    return count >= maxPerDay;
};

/**
 * Check if in quiet hours
 */
const isQuietHours = (settings) => {
    if (!settings.quietHoursEnabled) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const { quietHoursStart, quietHoursEnd } = settings;

    // Handle overnight quiet hours (e.g., 23:00 - 07:00)
    if (quietHoursStart > quietHoursEnd) {
        return currentHour >= quietHoursStart || currentHour < quietHoursEnd;
    }
    return currentHour >= quietHoursStart && currentHour < quietHoursEnd;
};

// ============================================================================
// NOTIFICATION SENDING
// ============================================================================

/**
 * Send email notification
 */
const sendEmail = async (to, subject, anomalyData) => {
    try {
        const transporter = createEmailTransporter();

        const mailOptions = {
            from: `"SHEM Energy Manager" <${process.env.SMTP_FROM || 'noreply@shem.app'}>`,
            to,
            subject,
            text: generateEmailText(anomalyData),
            html: generateEmailHTML(anomalyData)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Send SMS notification
 */
const sendSMS = async (to, message) => {
    try {
        if (!twilioClient) {
            initTwilio();
        }

        if (!twilioClient) {
            console.log('Twilio not configured, SMS not sent');
            return { success: false, error: 'Twilio not configured' };
        }

        const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });

        console.log('SMS sent:', result.sid);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error('SMS send error:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// MAIN NOTIFICATION FUNCTION
// ============================================================================

/**
 * Send anomaly alert notification
 * @param {Object} anomalyEvent - The detected anomaly event from database
 * @param {Object} options - Additional options
 */
const sendAnomalyNotification = async (anomalyEvent, options = {}) => {
    const { userId, _id: anomalyId, confidence } = anomalyEvent;

    // Only send for high confidence by default
    if (confidence !== 'high' && !options.forceNotify) {
        console.log('Skipping notification for non-high confidence anomaly');
        return { sent: false, reason: 'low_confidence' };
    }

    // Get user notification settings
    let settings = await NotificationSettings.findOne({ userId });

    if (!settings) {
        // Create default settings
        settings = new NotificationSettings({ userId });
        await settings.save();
    }

    // Check quiet hours
    if (isQuietHours(settings)) {
        console.log('In quiet hours, notification queued');
        // Could implement queue for delayed sending here
        return { sent: false, reason: 'quiet_hours' };
    }

    // Prepare anomaly data for templates
    const anomalyData = {
        timestamp: anomalyEvent.timestamp,
        consumption: anomalyEvent.consumption,
        expectedRange: {
            min: Math.round(anomalyEvent.expectedMean - 2 * anomalyEvent.expectedStdDev),
            max: Math.round(anomalyEvent.expectedMean + 2 * anomalyEvent.expectedStdDev)
        },
        deviation: anomalyEvent.deviation,
        deviationPercent: anomalyEvent.deviationPercent,
        possibleCauses: [
            { cause: 'AC overcooling', likelihood: 40 },
            { cause: 'Water heater left on', likelihood: 35 },
            { cause: 'Other appliance', likelihood: 25 }
        ],
        estimatedExtraCost: anomalyEvent.estimatedExtraCost || 12,
        anomalyId
    };

    const results = {
        email: null,
        sms: null
    };

    // Rate limit key for this type of notification
    const rateLimitKey = `anomaly_${confidence}`;

    // Send Email
    if (settings.emailEnabled && settings.emailAddress) {
        if (confidence === 'high' && settings.emailOnHighConfidence) {
            // Check rate limit
            const isLimited = await shouldRateLimit(userId, rateLimitKey + '_email', settings.maxNotificationsPerDay);

            if (isLimited) {
                results.email = { sent: false, reason: 'rate_limited' };
                await NotificationLog.create({
                    userId,
                    anomalyId,
                    type: 'email',
                    status: 'rate_limited',
                    recipient: settings.emailAddress,
                    rateLimitKey: rateLimitKey + '_email'
                });
            } else {
                const subject = '⚠️ High Power Alert - Your Consumption Spiked';
                const emailResult = await sendEmail(settings.emailAddress, subject, anomalyData);

                results.email = emailResult;

                await NotificationLog.create({
                    userId,
                    anomalyId,
                    type: 'email',
                    status: emailResult.success ? 'sent' : 'failed',
                    recipient: settings.emailAddress,
                    subject,
                    messagePreview: `Consumption spike: ${anomalyEvent.consumption}W`,
                    errorMessage: emailResult.error || null,
                    rateLimitKey: rateLimitKey + '_email'
                });
            }
        }
    }

    // Send SMS
    if (settings.smsEnabled && settings.phoneNumber) {
        if (confidence === 'high' && settings.smsOnHighConfidence) {
            // Check rate limit (more strict for SMS)
            const isLimited = await shouldRateLimit(userId, rateLimitKey + '_sms', 3);

            if (isLimited) {
                results.sms = { sent: false, reason: 'rate_limited' };
                await NotificationLog.create({
                    userId,
                    anomalyId,
                    type: 'sms',
                    status: 'rate_limited',
                    recipient: settings.phoneNumber,
                    rateLimitKey: rateLimitKey + '_sms'
                });
            } else {
                const smsMessage = generateSMSMessage(anomalyData);
                const smsResult = await sendSMS(settings.phoneNumber, smsMessage);

                results.sms = smsResult;

                await NotificationLog.create({
                    userId,
                    anomalyId,
                    type: 'sms',
                    status: smsResult.success ? 'sent' : 'failed',
                    recipient: settings.phoneNumber,
                    messagePreview: smsMessage.substring(0, 100),
                    errorMessage: smsResult.error || null,
                    rateLimitKey: rateLimitKey + '_sms'
                });
            }
        }
    }

    return {
        sent: results.email?.success || results.sms?.success,
        results
    };
};

// ============================================================================
// TRACKING FUNCTIONS
// ============================================================================

/**
 * Track when user clicks notification link
 */
const trackNotificationClick = async (anomalyId, userId) => {
    await NotificationLog.updateMany(
        { anomalyId, userId },
        { linkClicked: true, clickedAt: new Date() }
    );
};

/**
 * Track when user acknowledges anomaly
 */
const trackAcknowledgement = async (anomalyId, userId) => {
    await NotificationLog.updateMany(
        { anomalyId, userId },
        { acknowledged: true, acknowledgedAt: new Date() }
    );
};

/**
 * Get notification stats for ML improvement
 */
const getNotificationStats = async (userId) => {
    const stats = await NotificationLog.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: null,
                totalSent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
                totalClicked: { $sum: { $cond: ['$linkClicked', 1, 0] } },
                totalAcknowledged: { $sum: { $cond: ['$acknowledged', 1, 0] } },
                rateLimited: { $sum: { $cond: [{ $eq: ['$status', 'rate_limited'] }, 1, 0] } }
            }
        }
    ]);

    return stats[0] || {
        totalSent: 0,
        totalClicked: 0,
        totalAcknowledged: 0,
        rateLimited: 0
    };
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    sendAnomalyNotification,
    sendEmail,
    sendSMS,
    trackNotificationClick,
    trackAcknowledgement,
    getNotificationStats,
    shouldRateLimit,
    isQuietHours
};
