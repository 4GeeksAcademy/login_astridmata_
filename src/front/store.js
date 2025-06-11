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
    isAuthenticated: false, // Indica si el usuario está logueado
    token: null, // Almacena el token JWT
    user: null, // Almacena los datos del usuario (ej. email, username)
    isLoading: false, // Estado de carga para operaciones de autenticación
    authError: null,
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

    case "auth_loading": // Cuando una operación de autenticación comienza (signup, login)
      return {
        ...store,
        isLoading: true,
        authError: null, // Limpia errores anteriores
        message: null, // Limpia mensajes anteriores
      };

    // case "signup_success": // Cuando el registro es exitoso
    //   return {
    //     ...store,
    //     isLoading: false,
    //     message: action.payload, // Mensaje de éxito para mostrar al usuario (ej. "Usuario registrado")
    //     authError: null,
    //   };

    // case "login_success": // Cuando el login es exitoso
    //   localStorage.setItem("token", action.payload.token); // Guarda el token en localStorage
    //   localStorage.setItem("user", JSON.stringify(action.payload.user)); // Guarda los datos del usuario
    //   return {
    //     ...store,
    //     isAuthenticated: true,
    //     token: action.payload.token,
    //     user: action.payload.user,
    //     isLoading: false,
    //     authError: null,
    //     message: action.payload.message, // Mensaje de éxito del login
    //   };

    // case "auth_error": // Cuando hay un error en la autenticación (signup o login fallido)
    //   return {
    //     ...store,
    //     isLoading: false,
    //     authError: action.payload, // Guarda el mensaje de error para mostrarlo
    //     message: null, // Asegúrate de que no haya un mensaje de éxito activo
    //   };

    case "logout": // Cuando el usuario cierra sesión
      localStorage.removeItem("token"); // Elimina el token de localStorage
      localStorage.removeItem("user"); // Elimina los datos del usuario
      return {
        ...store,
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
        authError: null,
        message: "Has cerrado sesión exitosamente.",
      };

    // case "clear_auth_message": // Para limpiar mensajes de éxito o error específicos de autenticación
    //   return {
    //     ...store,
    //     message: null,
    //     authError: null,
    //   };

    default:
      throw Error("Unknown action.");
  }
}
