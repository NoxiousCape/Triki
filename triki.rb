class Triki
  def initialize(mode = :two_player, difficulty = :medium)
    @board = Array.new(3) { Array.new(3, " ") }
    @current_player = "X"
    @mode = mode
    @difficulty = difficulty
    @human_player = "X"
    @ai_player = "O"
  end

  def play
    puts "¡Bienvenido a Triki (Tic-Tac-Toe)!"
    puts "Modo: #{@mode == :two_player ? 'Dos Jugadores' : 'Jugador vs Computadora'}"
    puts "Dificultad: #{difficulty_name}" if @mode == :vs_ai
    puts ""
    
    loop do
      display_board
      
      if @mode == :vs_ai && @current_player == @ai_player
        ai_move
      else
        player_move
      end
      
      if winner?
        display_board
        if @mode == :vs_ai && @current_player == @ai_player
          puts "¡La computadora ha ganado! 🤖"
        elsif @mode == :vs_ai
          puts "¡Felicidades! ¡Has ganado! 🎉"
        else
          puts "¡El jugador #{@current_player} ha ganado! 🎉"
        end
        break
      elsif draw?
        display_board
        puts "¡Es un empate! 🤝"
        break
      end
      
      switch_player
    end
  end

  private

  def difficulty_name
    case @difficulty
    when :easy then "Fácil"
    when :medium then "Medio"
    when :hard then "Difícil"
    end
  end

  def display_board
    puts "\n"
    @board.each_with_index do |row, index|
      puts " " + row.join(" | ")
      puts "---+---+---" unless index == 2
    end
    puts "\n"
  end

  def player_move
    loop do
      print "Jugador #{@current_player}, ingresa tu movimiento (fila columna, ej: 0 1): "
      input = gets.chomp.split.map(&:to_i)
      if valid_move?(input)
        row, col = input
        @board[row][col] = @current_player
        break
      else
        puts "Movimiento inválido. Asegúrate de ingresar dos números entre 0 y 2, y que la casilla esté vacía."
      end
    end
  end

  def ai_move
    puts "La computadora está pensando... 🤔"
    sleep(0.5) # Pausa dramática
    
    move = case @difficulty
           when :easy then easy_ai_move
           when :medium then medium_ai_move
           when :hard then hard_ai_move
           end
    
    row, col = move
    @board[row][col] = @ai_player
    puts "La computadora jugó en: #{row} #{col}"
  end

  # IA Fácil: Movimientos aleatorios
  def easy_ai_move
    available_moves = []
    @board.each_with_index do |row, i|
      row.each_with_index do |cell, j|
        available_moves << [i, j] if cell == " "
      end
    end
    available_moves.sample
  end

  # IA Media: Bloquea al jugador si está a punto de ganar, sino juega aleatorio
  def medium_ai_move
    # Intenta ganar
    winning_move = find_winning_move(@ai_player)
    return winning_move if winning_move
    
    # Bloquea al jugador
    blocking_move = find_winning_move(@human_player)
    return blocking_move if blocking_move
    
    # Si no hay movimiento crítico, juega en el centro o aleatorio
    return [1, 1] if @board[1][1] == " "
    
    easy_ai_move
  end

  # IA Difícil: Usa el algoritmo Minimax
  def hard_ai_move
    best_score = -Float::INFINITY
    best_move = nil
    
    @board.each_with_index do |row, i|
      row.each_with_index do |cell, j|
        if cell == " "
          @board[i][j] = @ai_player
          score = minimax(@board, 0, false)
          @board[i][j] = " "
          
          if score > best_score
            best_score = score
            best_move = [i, j]
          end
        end
      end
    end
    
    best_move
  end

  # Algoritmo Minimax para IA difícil
  def minimax(board, depth, is_maximizing)
    if check_winner(@ai_player)
      return 10 - depth
    elsif check_winner(@human_player)
      return depth - 10
    elsif board_full?
      return 0
    end
    
    if is_maximizing
      best_score = -Float::INFINITY
      @board.each_with_index do |row, i|
        row.each_with_index do |cell, j|
          if cell == " "
            @board[i][j] = @ai_player
            score = minimax(@board, depth + 1, false)
            @board[i][j] = " "
            best_score = [score, best_score].max
          end
        end
      end
      best_score
    else
      best_score = Float::INFINITY
      @board.each_with_index do |row, i|
        row.each_with_index do |cell, j|
          if cell == " "
            @board[i][j] = @human_player
            score = minimax(@board, depth + 1, true)
            @board[i][j] = " "
            best_score = [score, best_score].min
          end
        end
      end
      best_score
    end
  end

  def find_winning_move(player)
    @board.each_with_index do |row, i|
      row.each_with_index do |cell, j|
        if cell == " "
          @board[i][j] = player
          is_winning = check_winner(player)
          @board[i][j] = " "
          return [i, j] if is_winning
        end
      end
    end
    nil
  end

  def check_winner(player)
    lines = @board + @board.transpose + diagonals
    lines.any? { |line| line.all? { |cell| cell == player } }
  end

  def board_full?
    @board.flatten.none? { |cell| cell == " " }
  end

  def valid_move?(input)
    return false unless input.length == 2
    row, col = input
    row.between?(0, 2) && col.between?(0, 2) && @board[row][col] == " "
  end

  def switch_player
    @current_player = @current_player == "X" ? "O" : "X"
  end

  def winner?
    check_winner(@current_player)
  end

  def diagonals
    [
      [@board[0][0], @board[1][1], @board[2][2]],
      [@board[0][2], @board[1][1], @board[2][0]]
    ]
  end

  def draw?
    board_full?
  end
end

def show_menu
  puts "\n" + "=" * 50
  puts "🎮  TRIKI - TIC-TAC-TOE  🎮".center(50)
  puts "=" * 50
  puts "\nSelecciona el modo de juego:"
  puts "1. Dos Jugadores (Humano vs Humano)"
  puts "2. Jugador vs Computadora"
  puts "0. Salir"
  print "\nOpción: "
end

def select_difficulty
  puts "\nSelecciona la dificultad:"
  puts "1. Fácil (Movimientos aleatorios)"
  puts "2. Medio (Bloquea y ataca)"
  puts "3. Difícil (IA invencible con Minimax)"
  print "\nOpción: "
end

if __FILE__ == $0
  loop do
    show_menu
    option = gets.chomp.to_i
    
    case option
    when 0
      puts "\n¡Gracias por jugar! 👋"
      break
    when 1
      game = Triki.new(:two_player)
      game.play
    when 2
      select_difficulty
      difficulty_option = gets.chomp.to_i
      
      difficulty = case difficulty_option
                   when 1 then :easy
                   when 2 then :medium
                   when 3 then :hard
                   else :medium
                   end
      
      game = Triki.new(:vs_ai, difficulty)
      game.play
    else
      puts "Opción inválida. Por favor, selecciona 1, 2 o 0."
    end
    
    puts "\n¿Quieres jugar otra vez? (Presiona Enter para continuar)"
    gets
  end
end
