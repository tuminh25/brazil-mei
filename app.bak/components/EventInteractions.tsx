'use client'

import React, { useMemo, useState } from 'react'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  text: string
}

type EventAction = {
  saved: boolean
  shared: number
  interested: number
}

export default function EventInteractions() {
  const [actions, setActions] = useState<EventAction>({
    saved: false,
    shared: 0,
    interested: 0,
  })

  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const responses = useMemo<Record<string, string>>(
    () => ({
      price: 'The price varies depending on ticket type. Check the event website for current pricing!',
      date: 'You can find the exact date and time in the event details above.',
      venue: 'The venue location is shown on the map above. Click for directions!',
      accessibility: 'Please contact the event organizer for accessibility information.',
      parking: 'Check the venue website or call ahead for parking details.',
      kids: 'Family-friendly details should be mentioned in the event description.',
      default: 'Great question! Visit the event website or contact the organizer for more specific info.',
    }),
    []
  )

  const handleSave = () => {
    setActions((prev) => ({
      ...prev,
      saved: !prev.saved,
    }))
  }

  const handleShare = () => {
    setActions((prev) => ({
      ...prev,
      shared: prev.shared + 1,
    }))
  }

  const handleInterested = () => {
    setActions((prev) => ({
      ...prev,
      interested: prev.interested + 1,
    }))
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()

    setMessages((prev) => [...prev, { role: 'user', text: userText }])

    const lowerInput = userText.toLowerCase()
    let reply = responses.default

    for (const key of Object.keys(responses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        reply = responses[key]
        break
      }
    }

    setInput('')

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    }, 500)
  }

  return (
    <>
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            actions.saved
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
          type="button"
        >
          {actions.saved ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={handleInterested}
          className="px-4 py-2 rounded-lg text-sm font-medium border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          type="button"
        >
          Interested: {actions.interested}
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2 rounded-lg text-sm font-medium border bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          type="button"
        >
          Shared: {actions.shared}
        </button>
      </div>

      {/* Chat Button - Fixed */}
      <button
        onClick={() => setChatOpen((v) => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40 transition-all hover:scale-110"
        title="Chat about this event"
        type="button"
      >
        ?
      </button>

      {/* Chat Popup */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 max-w-[90vw] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="font-semibold">Event Assistant</div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-blue-700 p-1 rounded"
              type="button"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 max-h-80 overflow-auto space-y-2">
            {messages.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <div className="font-medium mb-1">Ask me anything about this event!</div>
                <div className="text-xs opacity-80">Try: price, date, venue, accessibility, parking, kids...</div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`text-sm px-3 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-slate-900 dark:text-white ml-8'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white mr-8'
                  }`}
                >
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleChatSubmit} className="flex gap-2 p-3 border-t border-slate-200 dark:border-slate-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
