export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
    // --- Nuevas propiedades para autenticación ---
    // isAuthenticated: false, // Indica si el usuario está logueado
    token: null, // Almacena el token JWT
    user: null, // Almacena los datos del usuario (ej. email, username)
    
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    // --- Nuevas acciones para autenticación ---


    case "login_success": // Cuando el login es exitoso
      localStorage.setItem("token", action.payload.token); // Guarda el token en localStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Guarda los datos del usuario
      return {
        ...store,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        
      };

    

    case "logout": // Cuando el usuario cierra sesión
      localStorage.removeItem("token"); // Elimina el token de localStorage
      localStorage.removeItem("user"); // Elimina los datos del usuario
      return {
        ...store,
        isAuthenticated: false,
        token: null,
        user: null,
        
      };

    

    default:
      throw Error("Unknown action.");
  }
}
