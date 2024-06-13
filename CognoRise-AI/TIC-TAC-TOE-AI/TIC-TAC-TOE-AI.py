import math

# Initialize the board
def create_board():
    return [' ' for _ in range(9)]

# Print the board
def print_board(board):
    for row in [board[i*3:(i+1)*3] for i in range(3)]:
        print('|'.join(row))
        print('-'*5)

# Check for a winner
def check_winner(board, player):
    win_conditions = [
        [board[0], board[1], board[2]],
        [board[3], board[4], board[5]],
        [board[6], board[7], board[8]],
        [board[0], board[3], board[6]],
        [board[1], board[4], board[7]],
        [board[2], board[5], board[8]],
        [board[0], board[4], board[8]],
        [board[2], board[4], board[6]],
    ]
    return [player, player, player] in win_conditions

# Check for a draw
def check_draw(board):
    return ' ' not in board

# Minimax algorithm
def minimax(board, depth, is_maximizing, alpha, beta):
    if check_winner(board, 'O'):
        return 1
    elif check_winner(board, 'X'):
        return -1
    elif check_draw(board):
        return 0
    
    if is_maximizing:
        max_eval = -math.inf
        for i in range(9):
            if board[i] == ' ':
                board[i] = 'O'
                eval = minimax(board, depth + 1, False, alpha, beta)
                board[i] = ' '
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break
        return max_eval
    else:
        min_eval = math.inf
        for i in range(9):
            if board[i] == ' ':
                board[i] = 'X'
                eval = minimax(board, depth + 1, True, alpha, beta)
                board[i] = ' '
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break
        return min_eval

# Get the best move for the AI
def get_ai_move(board):
    best_score = -math.inf
    best_move = 0
    for i in range(9):
        if board[i] == ' ':
            board[i] = 'O'
            score = minimax(board, 0, False, -math.inf, math.inf)
            board[i] = ' '
            if score > best_score:
                best_score = score
                best_move = i
    return best_move

# Main game loop
def play_game():
    board = create_board()
    print_board(board)
    
    while True:
        # Player move
        move = int(input("Enter your move (1-9): ")) - 1
        if board[move] == ' ':
            board[move] = 'X'
        else:
            print("Invalid move, try again.")
            continue
        
        print_board(board)
        
        if check_winner(board, 'X'):
            print("You win!")
            break
        elif check_draw(board):
            print("It's a draw!")
            break
        
        # AI move
        ai_move = get_ai_move(board)
        board[ai_move] = 'O'
        print("AI plays move:", ai_move + 1)
        print_board(board)
        
        if check_winner(board, 'O'):
            print("AI wins!")
            break
        elif check_draw(board):
            print("It's a draw!")
            break

# Start the game
if __name__ == "__main__":
    play_game()
