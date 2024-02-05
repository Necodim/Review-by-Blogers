export function getProfile() {
    const userType = 'seller';
    const onboarding = false;
    const subscription = false;
    const subscriptionExpiration = new Date(2025, 1, 1);
    const api = true;
    const trial = true;
    const trialUsed = false;

    return {
        userType,
        onboarding,
        subscription,
        subscriptionExpiration,
        api,
        trial,
        trialUsed
    }
}