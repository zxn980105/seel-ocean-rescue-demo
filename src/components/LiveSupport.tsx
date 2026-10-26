import { useEffect, useRef, useState } from 'react'
import { supportReplies, supportTopics } from '../config/mock'
import { SendIcon, SparkleIcon } from './Icons'

interface Msg {
  id: number
  from: 'bot' | 'user'
  text: string
}

let nextId = 1

export function LiveSupport() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages])

  const ask = (text: string) => {
    const reply = supportReplies[text] ?? 'Thanks! A support agent will get back to you shortly.'
    setMessages((m) => [...m, { id: nextId++, from: 'user', text }, { id: nextId++, from: 'bot', text: reply }])
  }

  return (
    <aside className="support" aria-label="Live support">
      <header className="support-head">
        <SparkleIcon size={20} />
        <h2>Live support</h2>
        <span className="online">
          <i /> Online
        </span>
      </header>
      <div className="support-body">
        <div className="bot-row">
          <span className="bot-avatar">
            <SparkleIcon size={14} />
          </span>
          <div className="bubble">
            Hi! I'm the Seel Support Assistant. Feel free to ask me anything, or choose from these common topics below!
          </div>
        </div>
        <div className="topics">
          {supportTopics.map((t) => (
            <button key={t} className="topic" onClick={() => ask(t)}>
              {t}
            </button>
          ))}
          <span className="time">10:02 AM</span>
        </div>
        {messages.map((m) => (
          <div key={m.id} className={m.from === 'user' ? 'user-row' : 'bot-row'}>
            {m.from === 'bot' && (
              <span className="bot-avatar">
                <SparkleIcon size={14} />
              </span>
            )}
            <div className={`bubble ${m.from === 'user' ? 'bubble-user' : ''}`}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="support-input"
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          ask(draft.trim())
          setDraft('')
        }}
      >
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type your message..." aria-label="Message" />
        <button type="submit" aria-label="Send">
          <SendIcon size={18} />
        </button>
      </form>
    </aside>
  )
}
