/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text, View } from 'react-native';

test('renders smoke', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <View>
        <Text>bookingApp</Text>
      </View>,
    );
  });
});
