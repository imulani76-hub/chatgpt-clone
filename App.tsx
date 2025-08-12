import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

interface Message {
  sender: 'You' | 'Bot';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'You', text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`, // Replace with your key
          }
        }
      );

      const reply = response.data.choices[0].message.content.trim();
      setMessages([...newMessages, { sender: 'Bot', text: reply }]);
    } catch (error: any) {
      setMessages([...newMessages, { sender: 'Bot', text: 'Error: ' + error.message }]);
    }

    setInput('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat}>
        {messages.map((m, i) => (
          <Text
            key={i}
            style={m.sender === 'You' ? styles.user : styles.bot}
          >
            {m.sender}: {m.text}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, marginTop: 40 },
  chat: { flex: 1, marginBottom: 10 },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
});
