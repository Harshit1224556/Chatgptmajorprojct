import React from 'react';
import './ChatSidebar.css';

const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  open
}) => {

  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">

      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>

      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (

          <div
            key={c._id}
            className={`chat-list-item ${c._id === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(c._id)}
          >

            <span className="title-line">{c.title}</span>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(c._id); // only notify parent
              }}
            >
              🗑
            </button>

          </div>

        ))}

        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>

    </aside>
  );
};

export default ChatSidebar;
