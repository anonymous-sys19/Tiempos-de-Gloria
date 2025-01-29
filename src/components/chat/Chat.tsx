import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/userAuth';
import { supabase } from '@/supabaseClient';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Image, Send, Reply, LogOut, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';



interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

interface Message {
  id: string;
  content: string;
  image_url: string | null;
  sender_id: string;
  receiver_id: string;
  reply_to: string | null;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  } | null;
  replies?: Message[];
}

interface Conversation {
  profile: Profile;
  lastMessage?: Message;
  unreadCount: number;
}

export function ChatApp() {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showUsersList, setShowUsersList] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      // Fetch all users except current user
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (profilesError) {
        toast.error('Error fetching users');
        return;
      }

      // For each profile, get the last message (if any)
      const conversationsData = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              *,
              profiles (
                display_name,
                avatar_url
              )
            `)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            profile,
            lastMessage: lastMessage || undefined,
            unreadCount: 0, // You can implement unread count logic here
          };
        })
      );

      setConversations(conversationsData);
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !selectedUser) return;

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error('Error fetching messages');
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message;
          if (
            (newMessage.sender_id === user?.id && newMessage.receiver_id === selectedUser?.id) ||
            (newMessage.sender_id === selectedUser?.id && newMessage.receiver_id === user?.id)
          ) {
            const { data } = await supabase
              .from('messages')
              .select(`
                *,
                profiles (
                  display_name,
                  avatar_url
                )
              `)
              .eq('id', newMessage.id)
              .single();

            if (data) {
              setMessages((prev) => [...prev, data]);
            }
          }
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user || !selectedUser || (!newMessage.trim() && !selectedImage)) return;

    try {
      let imageUrl = null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('message-images')
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('message-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('messages')
        .insert([{
          content: newMessage.trim(),
          sender_id: user.id,
          receiver_id: selectedUser.id,
          image_url: imageUrl,
          reply_to: replyTo?.id || null,
        }]);

      if (error) throw error;

      setNewMessage('');
      setSelectedImage(null);
      setReplyTo(null);
    } catch (error) {
      toast.error('Error sending message');
      console.log(error);
      
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const handleUserSelect = (profile: Profile) => {
    setSelectedUser(profile);
    setShowUsersList(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations List */}
      <div className={`w-80 bg-white border-r ${showUsersList ? 'block' : 'hidden'} md:block`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button
            onClick={() => signOut()}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.profile.id}
              onClick={() => handleUserSelect(conversation.profile)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b ${selectedUser?.id === conversation.profile.id ? 'bg-blue-50' : ''
                }`}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                {conversation.profile.avatar_url ? (
                  <img
                    src={conversation.profile.avatar_url}
                    alt={conversation.profile.display_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl text-gray-600">
                    {conversation.profile.display_name[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">{conversation.profile.display_name}</p>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {format(new Date(conversation.lastMessage.created_at), 'HH:mm')}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage.content || 'Sent an image'}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex items-center gap-4">
              <button
                onClick={() => setShowUsersList(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <Users className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt={selectedUser.display_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg text-gray-600">
                      {selectedUser.display_name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="font-semibold">{selectedUser.display_name}</h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] w-3/4 ${message.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow`}>
                    <div className="flex items-center gap-2 mb-1">
                      {user?.id === message.sender_id ? (

                        <>
                          <img className="w-10 h-10 rounded-full object-cover"
                           src={user.user_metadata.avatar_url} 
                           alt={user?.user_metadata.full_name} 
                           />
                          
                          <span>{message.profiles?.display_name}</span>
                        </>

                      )
                        : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {message.profiles?.avatar_url ? (
                                <img
                                  src={message.profiles?.avatar_url}
                                  alt={selectedUser.display_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-lg text-gray-600">
                                  {message.profiles?.display_name[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="font-semibold">{message.profiles?.display_name}</span>
                            
                          </div>

                        )}
                      {/* <span className="text-xs opacity-75">
                        {format(new Date(message.created_at), 'HH:mm')}
                      </span> */}
                    </div>
                    {message.reply_to && (
                      <div className="text-sm opacity-75 mb-2 p-2 rounded bg-gray-100">
                        Replying to a message...
                      </div>
                    )}
                    {message.content && <p>{message.content}</p>}
                    {message.image_url && (
                      <img
                        src={message.image_url}
                        alt="Message attachment"
                        className="mt-2 rounded-lg max-w-full"
                      />
                    )}
                    <span className="text-xs opacity-75 float-right">
                      {format(new Date(message.created_at), 'HH:mm')}
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyTo(message)}
                    className="bg-transparent text-xs mt-2 opacity-75 hover:opacity-100"
                  >
                    <Reply /> Reply
                  </button>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Banner */}
            {replyTo && (
              <div className="bg-gray-200 p-2 flex items-center justify-between">
                <span className="text-sm">
                  Replying to {replyTo.profiles?.display_name} : {replyTo.content}
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Smile className="w-6 h-6 text-gray-600" />
                </button>
                <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                  <Image className="w-6 h-6 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setNewMessage((prev) => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}