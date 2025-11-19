# 🎁 Invisible Friend (Amigo Invisible)

Una aplicación web minimalista y moderna para organizar el Amigo Invisible, construida con **Astro**, **React** y **Tailwind CSS**. Diseñada para ser utilizada en una fiesta o reunión, pasando el dispositivo de mano en mano de forma segura y divertida.

![Invisible Friend Preview](public/preview.png)

## ✨ Características

- **🎨 Diseño Minimalista & Dark Mode**: Interfaz limpia y elegante, pensada para móviles.
- **💾 Persistencia de Datos**: Todo se guarda automáticamente en el navegador. Si recargas, no pierdes el sorteo.
- **🚫 Exclusiones**: Configura reglas para evitar que ciertas personas se regalen entre sí (ej. parejas).
- **🔒 PIN de Seguridad**: Cada participante puede proteger su resultado con un código de 4 dígitos.
- **📱 Modo Fiesta**:
  - Vista de cuadrícula para seleccionar tu nombre.
  - Los nombres vistos se marcan y bloquean automáticamente.
  - Efectos de sonido y confeti 🎉.
- **💬 Compartir en WhatsApp**: Genera un enlace con un mensaje preformateado para guardar tu misión.
- **⚙️ Configuración**: Define fecha, presupuesto y notas del evento.

## 🛠️ Tecnologías

- **[Astro](https://astro.build/)**: Framework principal para un rendimiento óptimo.
- **[React](https://react.dev/)**: Para la lógica interactiva de la aplicación.
- **[Tailwind CSS](https://tailwindcss.com/)**: Para el estilizado rápido y responsivo.
- **[Lucide React](https://lucide.dev/)**: Iconografía moderna.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: Efectos de celebración.

## 🚀 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/invisible-friend.git
   cd invisible-friend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📖 Cómo usar

1. **Configuración**: Introduce la fecha del intercambio, el presupuesto máximo y notas adicionales.
2. **Participantes**: Añade los nombres de todos los participantes.
3. **Reglas (Opcional)**: Pulsa el icono de engranaje (⚙️) junto a un nombre para:
   - Añadir un **PIN** de seguridad.
   - Marcar **Exclusiones** (a quién no puede regalar).
4. **Sorteo**: Pulsa "Generar Sorteo".
5. **Revelación**: Pasa el móvil. Cada persona busca su nombre, introduce su PIN (si tiene) y descubre a quién le toca regalar.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de usarlo y modificarlo para tus eventos.
