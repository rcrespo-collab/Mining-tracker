import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '../../design/theme';
import { QuickExitButton } from '../QuickExitButton';

jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { router } = require('expo-router');

describe('QuickExitButton (§9.2)', () => {
  it('routes to the neutral decoy page when pressed', () => {
    const { getByLabelText } = render(
      <ThemeProvider>
        <QuickExitButton />
      </ThemeProvider>,
    );
    fireEvent.press(getByLabelText('Leave this app quickly'));
    expect(router.replace).toHaveBeenCalledWith('/quick-exit');
  });
});
