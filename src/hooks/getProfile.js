export function getProfile() {
    const userType = 'seller';
    const onboarding = false;
    const subscription = true;
    const subscriptionExpiration = new Date(2025, 1, 1);
    const api = true;
    const trial = false;
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