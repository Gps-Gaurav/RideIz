const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;
const activeConnections = new Map();

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on('connection', async (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Store previous socket info for cleanup
        let previousSocketInfo = null;

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                
                if (!userId || !userType) {
                    throw new Error('Invalid join data');
                }

                // Check for existing connection
                const existingConnection = activeConnections.get(userId);
                if (existingConnection) {
                    previousSocketInfo = existingConnection;
                    // Disconnect old socket
                    if (io.sockets.sockets.has(existingConnection.socketId)) {
                        io.sockets.sockets.get(existingConnection.socketId).disconnect();
                    }
                }

                console.log(`${userType} joining with ID: ${userId}`);

                if (userType === 'user') {
                    // Update user in database
                    const user = await userModel.findByIdAndUpdate(
                        userId,
                        {
                            $set: {
                                socketId: socket.id,
                                lastActive: new Date(),
                                status: 'online'
                            }
                        },
                        { new: true }
                    );

                    if (!user) {
                        throw new Error('User not found');
                    }

                } else if (userType === 'captain') {
                    // Update captain in database
                    const captain = await captainModel.findByIdAndUpdate(
                        userId,
                        {
                            $set: {
                                socketId: socket.id,
                                lastActive: new Date(),
                                status: 'online'
                            }
                        },
                        { new: true }
                    );

                    if (!captain) {
                        throw new Error('Captain not found');
                    }
                }

                // Store connection info
                const connectionInfo = {
                    socketId: socket.id,
                    userType,
                    userId,
                    connectedAt: new Date()
                };

                // Update active connections
                activeConnections.set(userId, connectionInfo);
                socket.userData = connectionInfo;

                // Join user-specific room
                socket.join(`${userType}_${userId}`);

                // Acknowledge successful connection
                socket.emit('joined', {
                    success: true,
                    message: `Successfully connected as ${userType}`,
                    socketId: socket.id
                });

                // Log connection status
                console.log(`Active connections: ${activeConnections.size}`);

            } catch (error) {
                console.error('Join error:', error);
                socket.emit('error', {
                    type: 'JOIN_ERROR',
                    message: error.message
                });
            }
        });

        socket.on('disconnect', async () => {
            try {
                console.log(`Client disconnected: ${socket.id}`);

                if (socket.userData) {
                    const { userId, userType } = socket.userData;

                    // Only update database if this was the active socket for the user
                    const currentConnection = activeConnections.get(userId);
                    if (currentConnection && currentConnection.socketId === socket.id) {
                        const Model = userType === 'user' ? userModel : captainModel;
                        await Model.findByIdAndUpdate(userId, {
                            $set: {
                                socketId: null,
                                status: 'offline',
                                lastActive: new Date()
                            }
                        });

                        activeConnections.delete(userId);
                    }
                }

                // Log remaining connections
                console.log(`Remaining active connections: ${activeConnections.size}`);

            } catch (error) {
                console.error('Disconnect error:', error);
            }
        });

        // Handle errors
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });

    // Periodic cleanup of stale connections
    setInterval(() => {
        const staleTimeout = 5 * 60 * 1000; // 5 minutes
        const now = new Date();

        activeConnections.forEach((connection, userId) => {
            if (now - connection.connectedAt > staleTimeout) {
                if (!io.sockets.sockets.has(connection.socketId)) {
                    activeConnections.delete(userId);
                    console.log(`Cleaned up stale connection for user ${userId}`);
                }
            }
        });
    }, 60000); // Run every minute

    return io;
}

// Enhanced message sending with acknowledgment
async function sendMessageToSocketId(socketId, messageObject) {
    return new Promise((resolve, reject) => {
        if (!io) {
            console.error('Socket.io not initialized');
            return reject(new Error('Socket.io not initialized'));
        }

        const socket = io.sockets.sockets.get(socketId);
        if (!socket) {
            console.error(`No socket found with ID: ${socketId}`);
            return reject(new Error('Socket not found'));
        }

        console.log('Sending message:', messageObject);

        socket.emit(messageObject.event, messageObject.data, (acknowledgment) => {
            if (acknowledgment?.success) {
                resolve(acknowledgment);
            } else {
                reject(new Error('Message not acknowledged'));
            }
        });
    });
}

module.exports = { 
    initializeSocket, 
    sendMessageToSocketId,
    getActiveConnections: () => Array.from(activeConnections.entries())
};