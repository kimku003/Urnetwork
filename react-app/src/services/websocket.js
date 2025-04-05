class WebSocketService {
  constructor() {
    this.connect();
    this.handlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      this.ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/notifications/?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket Connecté');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleNotification(data);
        } catch (error) {
          console.error('Erreur de parsing WebSocket:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket Déconnecté');
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
      };
    } catch (error) {
      console.error('Erreur de connexion WebSocket:', error);
    }
  }

  handleNotification(data) {
    const handlers = this.handlers.get(data.type) || [];
    handlers.forEach(handler => handler(data));
  }

  on(type, handler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type).push(handler);
  }

  off(type, handler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  markAsRead(notificationId) {
    this.ws.send(JSON.stringify({
      type: 'mark_as_read',
      notification_id: notificationId
    }));
  }
}

export const websocketService = new WebSocketService();