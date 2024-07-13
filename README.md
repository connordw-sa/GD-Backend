// GrandMasters Den, a Chess web application with real time functionality

- Features (key: i = implemented, !i = not implemented/still in progress)

// Backend

- Express Server - i
- Routing/endpoints - !i
- Models/schemas (users + games) - !i
- Auth (including JsonWebToken) - !i
- Socket.io (for realtime play) - !i (to be added last)

// Frontend

- Vite React app with routing - i (basic routing of login and main)
- Login functionality - !i
- Board with pieces and legal moves only - !i (pieces display, most moves are validated eg. check, checkmate, but
  castling and en passant are tricky)
- Ability to create or resume games - !i
- List current games - !i
- Socket.io (frontend) - !i

// Extra features to be added

- Friend list (can use socket.io for messaging capabilities but undecided on this feature)
- More user profile customization (probably multer for profile images)
- Refine UI + UX
- Leaderboard
