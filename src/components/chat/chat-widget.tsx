'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initializeChat = async (userId: string) => {
      setIsLoading(true)
      
      // Fetch room where user is participant
      const { data: participants } = await supabase
          .from('chat_participants')
          .select('room_id')
          .eq('user_id', userId)
          .limit(1)
          .single()
  
      let currentRoomId = participants?.room_id
  
      if (!currentRoomId) {
          // Create new room
          const { data: room } = await supabase
              .from('chat_rooms')
              .insert({})
              .select()
              .single()
          
          if (room) {
              currentRoomId = room.id
              // Add user to room
              await supabase.from('chat_participants').insert({
                  room_id: currentRoomId,
                  user_id: userId
              })
          }
      }
  
      setRoomId(currentRoomId)
      
      if (currentRoomId) {
          // Fetch existing messages
          const { data: msgs } = await supabase
              .from('messages')
              .select('*')
              .eq('room_id', currentRoomId)
              .order('created_at', { ascending: true })
          
          if (msgs) setMessages(msgs)
  
          // Subscribe to new messages
          channel = supabase
              .channel(`room:${currentRoomId}`)
              .on('postgres_changes', {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'messages',
                  filter: `room_id=eq.${currentRoomId}`
              }, (payload) => {
                  const newMsg = payload.new as Message
                  setMessages((prev) => [...prev, newMsg])
              })
              .subscribe()
      }
      setIsLoading(false)
    }

    // Check auth
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        initializeChat(user.id)
      }
    }
    getUser()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, []) // Remove supabase from dependency array to avoid "changed size" error if client is recreated

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !roomId) return

    const { error } = await supabase.from('messages').insert({
        room_id: roomId,
        sender_id: user.id,
        content: newMessage
    })

    if (error) {
        toast.error('Failed to send message')
    } else {
        setNewMessage('')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  if (!user && isOpen) {
      // Show login prompt inside chat or just simplistic view
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Sales Support
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <p className="text-muted-foreground">Please sign in to chat with our team.</p>
                    <Button asChild variant="outline" size="sm">
                        <a href="/login">Sign In</a>
                    </Button>
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    {messages.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            Start a conversation with us!
                        </p>
                    )}
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === user.id
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    isMe
                                    ? "ml-auto bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                            >
                                {msg.content}
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </>
            )}
          </CardContent>

          <CardFooter className="p-3 border-t">
            <form onSubmit={sendMessage} className="flex w-full gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!user || isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!user || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
