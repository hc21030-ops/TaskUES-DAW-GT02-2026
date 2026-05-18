import { useUsers } from "../../context/UsersContext";

export const authService = {
  login: async (credentials) => {
    const { users } = useUsers();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Buscar usuario en mock data

        const user = users.find((u) => u.email === credentials.email);
        if (user && credentials.password.length >= 6) {
          resolve({
            user: {
              user_id: user.user_id,
              name: user.name,
              lastname: user.lastname,
              email: user.email,
              state: user.state,
              date_created: user.date_created,
              last_access: new Date().toISOString(),
            },
            token: "mock_token_" + Date.now(),
          });
        } else {
          reject(new Error("Email o contraseña incorrectos"));
        }
      }, 500);
    });
  },
  register: async (data) => {
    return new Promise((resolve, reject) => {
      const { users } = useUsers();
      setTimeout(() => {
        // Verificar si el email ya existe
        const existingUser = users.find((u) => u.email === data.email);
        if (existingUser) {
          reject(new Error("El email ya está registrado"));
        } else if (data.password !== data.confirmPassword) {
          reject(new Error("Las contraseñas no coinciden"));
        } else {
          const newUser = {
            user_id: Math.max(...MOCK_USERS.map((u) => u.user_id)) + 1,
            name: data.name,
            lastname: data.lastname,
            email: data.email,
            state: true,
            date_created: new Date().toISOString(),
            last_access: new Date().toISOString(),
          };
          MOCK_USERS.push(newUser);
          resolve({
            user: newUser,
            token: "mock_token_" + Date.now(),
          });
        }
      }, 500);
    });
  },
};
