defmodule Memory.Game do
  def new do
    %{
      selected1: -1, 
      selected2: -1,
      matchedTiles: [], 
      buttonValues: randomizedGrid(), 
      numberOfMoves: 0,
    }
  end

  def client_view(game) do
    game
  end

  def buttonPressed(game, buttonValue) do
  	if game != nil do
  		if Enum.find(game.matchedTiles, fn x -> x == buttonValue end) == nil do
			if game.selected2 != -1 || game.selected1 == -1 do
    			%{
      				selected1: buttonValue, 
      				selected2: -1,
      				matchedTiles: game.matchedTiles, 
      				buttonValues: game.buttonValues, 
      				numberOfMoves: game.numberOfMoves,
    			}
    		else
    			if game.selected1 == buttonValue do
    				game
    			else
    				matchedTilesArray = if Enum.at(game.buttonValues,game.selected1) == Enum.at(game.buttonValues,buttonValue) do
    					game.matchedTiles ++ [game.selected1] ++ [buttonValue]
    				else
    					game.matchedTiles
    				end
        			%{
      					selected1: game.selected1, 
      					selected2: buttonValue,
      					matchedTiles: matchedTilesArray, 
      					buttonValues: game.buttonValues, 
      					numberOfMoves: game.numberOfMoves + 1,
    				}
    			end
    		end
    	else
    		game
  		end
  	else
  		game
  	end
  end

  def randomizedGrid do
  	gridValues = ["A","A","B","B","C","C","D","D","E","E","F","F","G","G","H","H"]
  	Enum.shuffle(gridValues)
  end
  
end
