# 🎮 Triki (Tic-Tac-Toe)

Un juego clásico de **Tres en Línea** (Tic-Tac-Toe) implementado en Ruby, con una interfaz de consola simple y elegante. ¡Juega contra un amigo o desafía a la computadora con 3 niveles de dificultad!

## 📋 Descripción

Triki es una implementación del tradicional juego de tres en línea que ofrece dos modos de juego: **Dos Jugadores** para jugar con un amigo, o **Jugador vs Computadora** para desafiar a una IA con diferentes niveles de dificultad. El juego se desarrolla en la terminal, donde los jugadores alternan turnos para colocar sus marcas (X y O) en un tablero de 3x3, con el objetivo de formar una línea de tres símbolos iguales.

## ✨ Características

- 🎯 **Dos modos de juego:**
  - 👥 Dos Jugadores (Humano vs Humano)
  - 🤖 Jugador vs Computadora (con IA)
- 🎚️ **Tres niveles de dificultad para la IA:**
  - 😊 **Fácil**: Movimientos aleatorios (perfecto para principiantes)
  - 🧠 **Medio**: Bloquea tus jugadas ganadoras y busca oportunidades
  - 🔥 **Difícil**: IA invencible usando el algoritmo Minimax
- 🎨 Interfaz de consola clara y fácil de leer
- ✅ Validación de movimientos en tiempo real
- 🏆 Detección automática de ganador
- 🤝 Detección de empates
- 🔄 Sistema de turnos alternados
- 🎮 Menú interactivo para seleccionar modo y dificultad

## 🚀 Requisitos

- Ruby 3.0 o superior

## 📦 Instalación

1. Clona este repositorio o descarga el archivo `triki.rb`:

```bash
git clone <url-del-repositorio>
cd Triki
```

2. Asegúrate de tener Ruby instalado:

```bash
ruby --version
```

## 🎯 Cómo Jugar

1. Ejecuta el juego desde la terminal:

```bash
ruby triki.rb
```

2. Selecciona el modo de juego desde el menú principal:

```
==================================================
          🎮  TRIKI - TIC-TAC-TOE  🎮
==================================================

Selecciona el modo de juego:
1. Dos Jugadores (Humano vs Humano)
2. Jugador vs Computadora
0. Salir

Opción:
```

3. Si eliges **Jugador vs Computadora**, selecciona la dificultad:

```
Selecciona la dificultad:
1. Fácil (Movimientos aleatorios)
2. Medio (Bloquea y ataca)
3. Difícil (IA invencible con Minimax)

Opción:
```

4. El tablero se muestra con coordenadas de 0 a 2 para filas y columnas:

```
   |   |  
---+---+---
   |   |  
---+---+---
   |   |  
```

5. Cuando sea tu turno, ingresa tu movimiento en el formato `fila columna`:
   - Ejemplo: `0 1` coloca tu marca en la fila 0, columna 1 (centro superior)
   - Ejemplo: `1 1` coloca tu marca en el centro del tablero
   - Ejemplo: `2 2` coloca tu marca en la esquina inferior derecha

6. En modo **vs Computadora**, la IA jugará automáticamente después de tu turno:
   ```
   La computadora está pensando... 🤔
   La computadora jugó en: 1 1
   ```

7. Los jugadores alternan turnos hasta que:
   - Un jugador forma una línea de tres (horizontal, vertical o diagonal) ✅
   - El tablero se llena sin ganador (empate) 🤝

## 🎮 Ejemplo de Partida

```
¡Bienvenido a Triki (Tic-Tac-Toe)!

   |   |  
---+---+---
   |   |  
---+---+---
   |   |  

Jugador X, ingresa tu movimiento (fila columna, ej: 0 1): 1 1

   |   |  
---+---+---
   | X |  
---+---+---
   |   |  

Jugador O, ingresa tu movimiento (fila columna, ej: 0 1): 0 0

 O |   |  
---+---+---
   | X |  
---+---+---
   |   |  
```

## 🤖 Niveles de Dificultad de la IA

### 😊 Fácil
**Estrategia:** Movimientos completamente aleatorios
- Ideal para principiantes o niños
- La IA elige casillas disponibles al azar
- Fácil de vencer con estrategia básica
- Perfecto para aprender el juego

### 🧠 Medio
**Estrategia:** Juego táctico con prioridades
1. **Intenta ganar**: Si puede completar una línea, lo hace
2. **Bloquea al jugador**: Si estás a punto de ganar, te bloquea
3. **Juega estratégicamente**: Prefiere el centro si está disponible
4. **Movimiento aleatorio**: Si no hay jugadas críticas

Este nivel ofrece un desafío moderado y es perfecto para jugadores intermedios.

### 🔥 Difícil (Minimax)
**Estrategia:** Algoritmo Minimax - Juego perfecto
- Evalúa **todos** los posibles movimientos futuros
- Calcula el mejor movimiento en cada situación
- Asume que ambos jugadores juegan perfectamente
- **Prácticamente invencible** - El mejor resultado posible es un empate

> **💡 Consejo:** En el nivel difícil, si juegas primero y haces el primer movimiento en el centro, puedes forzar un empate con juego perfecto. ¡Inténtalo!

## 🏗️ Estructura del Código

El juego está implementado en una sola clase `Triki` con los siguientes métodos principales:

### Métodos Principales
- `initialize(mode, difficulty)`: Inicializa el tablero vacío, establece el modo de juego y la dificultad
- `play`: Bucle principal del juego
- `display_board`: Muestra el estado actual del tablero
- `player_move`: Solicita y procesa el movimiento del jugador humano
- `valid_move?`: Valida que el movimiento sea legal
- `winner?`: Verifica si hay un ganador
- `draw?`: Verifica si hay un empate

### Métodos de IA
- `ai_move`: Controla el turno de la computadora según la dificultad
- `easy_ai_move`: IA fácil - Movimientos completamente aleatorios
- `medium_ai_move`: IA media - Intenta ganar, bloquea al jugador, o juega estratégicamente
- `hard_ai_move`: IA difícil - Usa el algoritmo Minimax para jugar perfectamente
- `minimax`: Implementación del algoritmo Minimax con poda
- `find_winning_move`: Encuentra movimientos ganadores o bloqueadores

### Algoritmo Minimax

El nivel **Difícil** utiliza el algoritmo **Minimax**, una técnica de teoría de juegos que:
- Evalúa todos los posibles movimientos futuros
- Asume que ambos jugadores juegan de manera óptima
- Selecciona el mejor movimiento posible
- Hace que la IA sea prácticamente **invencible** ♟️

## 🛠️ Desarrollo

### Depuración en VS Code

El proyecto incluye configuración de depuración para VS Code. Para depurar:

1. Asegúrate de tener la extensión de Ruby instalada
2. Instala la gema `debug`:

```bash
gem install debug
```

3. Presiona `F5` o usa la configuración "Debug Triki" desde el panel de depuración

## 📝 Reglas del Juego

1. El tablero es una cuadrícula de 3x3
2. Los jugadores se turnan para colocar su marca (X u O)
3. El primer jugador en formar una línea de tres marcas iguales (horizontal, vertical o diagonal) gana
4. Si el tablero se llena sin que ningún jugador forme una línea, el juego termina en empate

## 🎨 Coordenadas del Tablero

```
     0   1   2
   +---+---+---+
0  |   |   |   |
   +---+---+---+
1  |   |   |   |
   +---+---+---+
2  |   |   |   |
   +---+---+---+
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el juego:

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva característica'`)
4. Sube los cambios a tu fork (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Ruby

---

¡Disfruta jugando Triki! 🎉
