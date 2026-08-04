/**
 * Entry point. The root layout has already decided whether to send the user to
 * onboarding; otherwise land on the Home tab.
 */
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
