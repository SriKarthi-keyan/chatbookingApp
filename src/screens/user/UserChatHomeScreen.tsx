import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { VendorMatchCard } from '../../components/VendorMatchCard';
import { detectServiceRule, findNearbyMatchingVendors } from '../../chatbot/matchService';
import { UserTabWithStackNavigation } from '../../navigation/types';
import { getCurrentPositionWithPermission } from '../../services/locationService';
import { locationRepository } from '../../storage/locationRepository';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { useVendorsStore } from '../../store/vendorsStore';
import { MatchedVendor } from '../../models';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { createId } from '../../utils/id';
import { Images } from '../../assets/images';

type ChatMessage = IMessage & {
  custom?: { vendors?: MatchedVendor[] };
};

const BOT: IMessage['user'] = {
  _id: 'assistant',
  name: 'Local Assistant',
};

export function UserChatHomeScreen() {
  const navigation = useNavigation<UserTabWithStackNavigation>();
  const userId = useAuthStore(s => s.session?.userId);
  const vendors = useVendorsStore(s => s.vendors);
  const hydrateForUser = useChatStore(s => s.hydrateForUser);
  const setMessages = useChatStore(s => s.setMessages);
  const messages = useChatStore(s =>
    userId ? s.messagesByUserId[userId] ?? [] : [],
  );
  const [typing, setTyping] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        hydrateForUser(userId);
      }
    }, [hydrateForUser, userId]),
  );

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (messages.length > 0) {
      return;
    }
    const welcome: ChatMessage[] = [
      {
        _id: createId('msg'),
        text:
          'Hi! Tell me what you need — for example “need electrician”, “AC repair nearby”, or “plumber tomorrow”. I will match local vendors using your GPS.',
        createdAt: new Date(),
        user: BOT,
      },
    ];
    setMessages(userId, welcome);
  }, [messages.length, setMessages, userId]);

  const onSend = useCallback(
    (outgoing: IMessage[] = []) => {
      if (!userId) {
        return;
      }
      const userBubble: ChatMessage = {
        ...outgoing[0],
        user: { _id: userId, name: 'You' },
      };
      const afterUser = GiftedChat.append(messages, [userBubble]);
      setMessages(userId, afterUser);
      setTyping(true);

      setTimeout(async () => {
        try {
          const coords = await getCurrentPositionWithPermission();
          locationRepository.setForUser(userId, coords);
          const stored = locationRepository.getForUser(userId);
          const rule = detectServiceRule(userBubble.text ?? '');
          if (!rule) {
            const bot: ChatMessage = {
              _id: createId('msg'),
              text:
                'I can help with local electricians, plumbers, AC repair, painters, and more. Try a clearer service keyword.',
              createdAt: new Date(),
              user: BOT,
            };
            setMessages(userId, GiftedChat.append(afterUser, [bot]));
            return;
          }
          const matches = findNearbyMatchingVendors(vendors, stored, rule);
          const bot: ChatMessage = {
            _id: createId('msg'),
            text:
              matches.length === 0
                ? `I could not find ${rule.label.toLowerCase()} vendors near your current location yet.`
                : `Here are ${matches.length} nearby match(es) for ${rule.label}, sorted by distance:`,
            createdAt: new Date(),
            user: BOT,
            custom: matches.length ? { vendors: matches } : undefined,
          };
          setMessages(userId, GiftedChat.append(afterUser, [bot]));
        } catch {
          const bot: ChatMessage = {
            _id: createId('msg'),
            text:
              'Location permission is required to sort vendors by distance. Enable GPS in settings and tap “Refresh location” on the Nearby tab.',
            createdAt: new Date(),
            user: BOT,
          };
          setMessages(userId, GiftedChat.append(afterUser, [bot]));
        } finally {
          setTyping(false);
        }
      }, 250);
    },
    [messages, setMessages, userId, vendors],
  );

  const renderCustomView = useCallback(
    (props: { currentMessage?: IMessage & { custom?: ChatMessage['custom'] } }) => {
      const message = props.currentMessage;
      if (!message) {
        return null;
      }
      const list = message.custom?.vendors;
      if (!list?.length) {
        return null;
      }
      return (
        <View style={styles.custom}>
          {list.map((v, index) => (
            <VendorMatchCard
              key={v.id}
              vendor={v}
              index={index}
              onBook={() =>
                navigation.navigate('BookingCreate', {
                  vendorId: v.id,
                  service: v.serviceType,
                })
              }
            />
          ))}
        </View>
      );
    },
    [navigation],
  );

  const renderBubble = useCallback(
    (props: any) => (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: colors.bubbleUser },
          left: { backgroundColor: colors.bubbleBot, borderWidth: 1, borderColor: colors.border },
        }}
        textStyle={{
          right: { color: colors.textPrimary },
          left: { color: colors.textPrimary },
        }}
      />
    ),
    [],
  );

  const renderSend = useCallback(
    (props: any) => (
      <Send {...props} containerStyle={styles.sendWrap}>
        <View style={styles.sendBtn}>
          <Image source={Images.onBoardButton} style={{ width: 40, height: 40 }} />
        </View>
      </Send>
    ),
    [],
  );

  const renderInputToolbar = useCallback(
    (props: any) => (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={{ alignItems: 'center' }}
      />
    ),
    [],
  );

  const user = useMemo(
    () => ({ _id: userId ?? 'guest', name: 'You' }),
    [userId],
  );

  if (!userId) {
    return null;
  }

  return (
    <View style={styles.root}>
      <GiftedChat
        messages={messages}
        onSend={msgs => onSend(msgs)}
        user={user}
        isTyping={typing}
        renderAvatar={null}
        alwaysShowSend
        placeholder="Ask for a service…"
        textInputProps={{
          placeholderTextColor: colors.textMuted,
          style: { color: colors.textPrimary, paddingHorizontal: 12, flex: 1 },
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}
        bottomOffset={spacing.lg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  custom: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    width: '100%',
  },
  inputToolbar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sendWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
