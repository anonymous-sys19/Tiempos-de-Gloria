import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/userAuth';
import { supabase } from '@/supabaseClient';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Send, LogOut, Users, CheckCheck, Paperclip, CheckCheckIcon, MessageSquareMore, Reply } from 'lucide-react'; //Reply
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from '../ui/button';
import { Input } from '../ui/input';



interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_online: boolean;
  last_seen: string;
}

interface Message {
  id: string;
  content: string;
  image_url: string | null;
  sender_id: string;
  receiver_id: string;
  reply_to: string | null;
  created_at: string;
  is_read: boolean;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  } | null;
  replied_message?: Message;
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
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [documentHasFocus, setDocumentHasFocus] = useState(true);
  // const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado en el chat
  const messageSound = useRef<HTMLAudioElement | null>(null);
  const replySound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar los sonidos de notificación y respuesta
    messageSound.current = new Audio("/notification.mp3");
    replySound.current = new Audio("/response2.mp3");

    // Precargar sonidos
    messageSound.current.preload = "auto";
    replySound.current.preload = "auto";

    // Detectar si la ventana tiene foco
    const handleFocus = () => setDocumentHasFocus(true);
    const handleBlur = () => setDocumentHasFocus(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationEnabled(permission === "granted");
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const playMessageSound = () => {
    if (messageSound.current) {
      messageSound.current.currentTime = 0;
      messageSound.current.play().catch((error) => {
        console.error("Error playing message sound:", error);
      });
    }
  };

  const playReplySound = () => {
    if (replySound.current) {
      replySound.current.currentTime = 0;
      replySound.current.play().catch((error) => {
        console.error("Error playing reply sound:", error);
      });
    }
  };

  const showNotification = (sender: string, message: string) => {
    if (notificationEnabled && !documentHasFocus) {
      new Notification(`Nuevo mensaje de ${sender}`, {
        body: message,
        icon: "/vite.svg",
      });
    }
  };

  useEffect(() => {
    if (!user) return;
  
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new;
  
          if (newMessage.receiver_id === user.id) {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', newMessage.sender_id)
              .single();
  
            if (!documentHasFocus) {
              // Si no está en el chat, suena la notificación
              playMessageSound();
              console.log(senderData);
              
              if (senderData) {
                showNotification(senderData.display_name, newMessage.content || "Sent an image");
              }
            } else if (selectedUser?.id !== newMessage.sender_id) {
              // Si está en el chat con el remitente, suena el pitido de respuesta
              playReplySound();
            }
          }
  
          fetchMessages();
          fetchConversations();
        }
      )
      .subscribe();
  
    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedUser, documentHasFocus]);

  // notifi arriva
  useEffect(() => {
    if (!user) return;

    const updateOnlineStatus = async () => {
      await supabase
        .from('profiles')
        .update({
          is_online: true,
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);
    };

    const channel = supabase.channel('online_users');

    channel
      .on('presence', { event: 'sync' }, () => {
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await updateOnlineStatus();
        }
      });

    const interval = setInterval(updateOnlineStatus, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateOnlineStatus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleBeforeUnload = async () => {
      await supabase
        .from('profiles')
        .update({
          is_online: false,
          last_seen: new Date().toISOString()
        })
        .eq('id', user.id);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
      channel.unsubscribe();
    };
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);

      if (profilesError) throw profilesError;
      if (!profiles) return;

      const conversationsData = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { data: messages, error: messagesError } = await supabase
              .from('messages')
              .select(`
                *,
                profiles (
                  display_name,
                  avatar_url
                )
              `)
              .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
              .order('created_at', { ascending: false })
              .limit(1);

            if (messagesError) throw messagesError;

            const { count, error: countError } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('receiver_id', user.id)
              .eq('sender_id', profile.id)
              .eq('is_read', false);

            if (countError) throw countError;

            return {
              profile,
              lastMessage: messages?.[0],
              unreadCount: count || 0
            };
          } catch (error) {
            console.error('Error fetching messages for conversation:', error);
            return {
              profile,
              unreadCount: 0
            };
          }
        })
      );

      const sortedConversations = conversationsData.sort((a, b) => {
        if (a.unreadCount !== b.unreadCount) {
          return b.unreadCount - a.unreadCount;
        }
        return (b.lastMessage?.created_at || '').localeCompare(a.lastMessage?.created_at || '');
      });

      setConversations(sortedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Error loading conversations');
    }
  };

  useEffect(() => {
    fetchConversations();

    const subscription = supabase
      .channel('new_messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === user?.id) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchMessages = async () => {
    if (!user || !selectedUser) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          ),
          replied_message:reply_to(
            id,
            content,
            sender_id,
            profiles(display_name)
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const unreadMessages = data?.filter(msg =>
        msg.receiver_id === user.id && !msg.is_read
      ) || [];

      if (unreadMessages.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages.map(msg => msg.id));

        if (updateError) throw updateError;
        fetchConversations();
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error loading messages');
    }
  };

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchMessages();
        }
      )
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
          is_read: false,
        }]);

      if (error) throw error;

      setNewMessage('');
      setSelectedImage(null);
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef]);

  return (
    <div className="flex h-screen bg-[#efeae2] text-gray-900">
      {!notificationEnabled && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-2 text-center">
          <button
            onClick={requestNotificationPermission}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Activar notificaciones para mensajes nuevos
          </button>
        </div>
      )}
      <aside className={`w-96 bg-white ${showUsersList ? "block" : "hidden"} md:block flex-shrink-0`}>
        <div className="bg-[#00a884] p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Chat IDEC</h2>
          <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-white hover:bg-[#128c7e]">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {conversations.map((conversation) => (
            <button
              key={conversation.profile.id}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 ${selectedUser?.id === conversation.profile.id ? "bg-gray-200" : ""
                }`}
              onClick={() => handleUserSelect(conversation.profile)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={conversation.profile.avatar_url || undefined} alt={conversation.profile.display_name} />
                <AvatarFallback>{conversation.profile.display_name[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium truncate">{conversation.profile.display_name}</p>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {format(new Date(conversation.lastMessage.created_at), "HH:mm")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 justify-between">
                  <p className="text-sm truncate text-gray-500 flex items-center gap-4">
                    <span className='ml-2'> {conversation.lastMessage?.content || "....... ❄️ ........."}</span>
                    <span>
                      {conversation.lastMessage && conversation.lastMessage.sender_id === user?.id && (
                        <CheckCheckIcon className="w-4 h-4 text-[#53bdeb]" />
                      )} {conversation.lastMessage && conversation.lastMessage.sender_id !== user?.id && (
                        <MessageSquareMore className="w-4 h-4 text-[#47ff19]" />
                      )}
                    </span>
                  </p>
                  {!conversation.profile.is_online && (
                    <span className="text-xs text-red-800">
                      Last seen {formatDistanceToNow(new Date(conversation.profile.last_seen), { addSuffix: true })}
                    </span>
                  )}
                  {conversation.profile.is_online && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      <b className='text-[#0978e0]'>Online</b>
                    </span>
                  )}
                </div>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="bg-[#25d366] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unreadCount}
                </div>
              )}
            </button>
          ))}
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {selectedUser ? (
          <>
            <header className="bg-[#f0f2f5] p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowUsersList(true)}>
                <Users className="w-6 h-6" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.avatar_url || undefined} alt={selectedUser.display_name} />
                <AvatarFallback>{selectedUser.display_name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-semibold">{selectedUser.display_name}</h2>
                <p className="text-xs text-gray-500">
                  {selectedUser.is_online
                    ? "online"
                    : `Last seen ${formatDistanceToNow(new Date(selectedUser.last_seen), { addSuffix: true })}`}
                </p>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full p-4 space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-2 ${message.sender_id === user?.id
                        ? "bg-[#d9fdd3] rounded-tr-none"
                        : "bg-white rounded-tl-none"
                        }`}
                    >
                      {message.replied_message && (
                        <div className="text-sm bg-[#f0f2f5] p-2 rounded mb-2 border-l-4 border-[#25d366]">
                          <p className="font-medium text-[#25d366]">
                            {message.replied_message.sender_id === user?.id ? "You" : message.replied_message.profiles?.display_name}
                          </p>
                          <p className="truncate">{message.replied_message.content}</p>
                        </div>
                      )}
                      {message.content && <p className="break-words">{message.content}</p>}
                      {message.image_url && (
                        <img
                          src={message.image_url}
                          alt="Message attachment"
                          className="mt-2 rounded-lg max-w-full"
                        />
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.created_at), "HH:mm")}
                        </span>
                        {message.sender_id === user?.id && (
                          <div className="flex items-center">
                            <CheckCheck
                              className={`w-4 h-4 ${message.is_read
                                ? "text-[#53bdeb]"
                                : "text-gray-400"
                                }`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="self-end ml-2 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => setReplyTo(message)}
                    >
                      <Reply className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>

            {replyTo && (
              <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-l-4 border-[#25d366]">
                <div className="flex-1">
                  <p className="font-medium text-[#25d366]">
                    {replyTo.sender_id === user?.id ? "You" : selectedUser.display_name}
                  </p>
                  <p className="text-sm truncate">{replyTo.content}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setReplyTo(null)}>
                  <span className="text-xl">×</span>
                </Button>
              </div>
            )}

            <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2 sticky bottom-0">
              <Button variant="ghost" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="w-6 h-6 text-[#54656f]" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <label>
                  <Paperclip className="w-6 h-6 text-[#54656f]" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </Button>
              <Input
                id="messageInput"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 bg-white rounded-full"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendMessage}
                className="bg-[#00a884] text-white hover:bg-[#00a884]/90"
              >
                <Send className="w-6 h-6" />
              </Button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </main>

      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4 z-10">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setNewMessage((prev) => prev + emojiData.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}