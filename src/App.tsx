import React, { useEffect, useState } from "react";
import { checkWin, generateMaze, isValidMove } from "./utils/maze";

function App() {
	const [won, setWon] = useState<boolean>(false);
	const [currentDiff, setCurrentDiff] = useState<number>(15);
	const [currentSize, setCurrentSize] = useState<number>(11);
	const [maze, setMaze] = useState<number[][]>([]);
	const [playerX, setPlayerX] = useState<number>(1);
	const [playerY, setPlayerY] = useState<number>(1);
	const [timer, setTimer] = useState<number>(0);

	useEffect(() => {
		setMaze(generateMaze(currentSize, currentSize));
		(document.querySelector(".maze-container") as HTMLElement)?.focus();
	}, []);

	useEffect(() => {
		console.log(timer);
		let interval = Math.random();
		if (won) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer + 1);
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [won]);

	const handleKeyPress = (event: React.KeyboardEvent) => {
		const { key } = event;
		let newX = playerX,
			newY = playerY;

		switch (key) {
			case "ArrowUp":
				newY--;
				break;
			case "ArrowDown":
				newY++;
				break;
			case "ArrowLeft":
				newX--;
				break;
			case "ArrowRight":
				newX++;
				break;
		}

		if (
			key !== "ArrowUp" &&
			key !== "ArrowDown" &&
			key !== "ArrowLeft" &&
			key !== "ArrowRight"
		)
			return;

		if (isValidMove(maze, newX, newY)) {
			if (won) return;
			if (maze[playerY][playerX] !== 2 || maze[playerY][playerX] !== 3) {
				setMaze((prevMaze) => {
					const newMaze = [...prevMaze];
					const cellValue = newMaze[playerY][playerX];
					if (cellValue >= 5) {
						newMaze[playerY][playerX] = cellValue + 1;
					} else if (cellValue === 0) {
						newMaze[playerY][playerX] = 5;
					}
					return newMaze;
				});
			}

			setPlayerX(newX);
			setPlayerY(newY);

			if (checkWin(maze, newX, newY)) {
				setWon(true);
			}
		}
	};

	const getDifficulty = () => {
		switch (maze.length) {
			case 11:
				return "-easy";
			case 21:
				return "-medium";
			case 31:
				return "-hard";
			case 41:
				return "-super-hard";
			case 101:
				return "-crazy";
		}
	};

	return (
		<>
			<div className="flex md:hidden flex-col items-center justify-center space-y-4 p-4 cartoon-controls">
				<p className="cartoon-text">
					This game is only available on desktop. Please visit this page on a
					desktop browser to play.
				</p>
			</div>
			<div className="flex h-screen items-center justify-evenly cartoon-container">
				<div className="hidden min-h-1/2 w-1/3 md:flex flex-col space-y-4 p-4 cartoon-controls">
					<h1 className="text-2xl font-bold cartoon-text text-center">
						Game Controls
					</h1>
					{/* <p>
						{maze && isEndReachable(maze)
							? "End is reachable"
							: "End is not reachable"}
					</p> */}
					<div className="flex items-center space-x-4">
						<label className="cartoon-text font-bold" htmlFor="difficulty">
							Difficulty:
						</label>
						<select
							className="cartoon-select"
							value={currentDiff}
							onChange={(e) => {
								setCurrentDiff(parseInt(e.target.value));
								switch (parseInt(e.target.value)) {
									case 1:
										setCurrentSize(11);
										break;
									case 2:
										setCurrentSize(21);
										break;
									case 3:
										setCurrentSize(31);
										break;
									case 4:
										setCurrentSize(41);
										break;
									case 5:
										setCurrentSize(101);
										break;
								}
							}}
						>
							<option value={1}>Easy</option>
							<option value={2}>Medium</option>
							<option value={3}>Hard</option>
							<option value={4}>Super Hard</option>
							<option value={5}>Crazy</option>
						</select>
					</div>

					{won && (
						<div className="bg-white p-4 flex items-center justify-center flex-col rounded-lg shadow-lg cartoon-win">
							<h1 className="text-2xl font-bold bg-white p-10 text-center">
								You Won!
							</h1>
							<button
								className="cartoon-button"
								onClick={() => {
									setMaze(generateMaze(currentSize, currentSize));
									setPlayerX(1);
									setPlayerY(1);
									setWon(false);
									setTimer(0);
								}}
							>
								Play Again
							</button>
						</div>
					)}
					<button
						className="cartoon-button"
						onClick={() => {
							setMaze(generateMaze(currentSize, currentSize));
							setPlayerX(1);
							setPlayerY(1);
							setWon(false);
							setTimer(0);
						}}
					>
						Generate Maze
					</button>
				</div>

				<div
					className="maze-container flex items-center justify-center ring-0 outline-none cartoon-maze"
					tabIndex={0}
					onKeyDown={handleKeyPress}
					autoFocus
				>
					{maze.map((row, y) => (
						<div className="maze-row" key={y}>
							{row.map((cell, x) => (
								<div
									key={x}
									className={`cartoon-cell maze-cell${getDifficulty()} ${
										cell === 1 && "wall"
									}`}
								>
									{playerX === x && playerY === y ? (
										<div className="player"></div>
									) : cell === 2 ? (
										<div className="start"></div>
									) : cell === 3 ? (
										<div className="end"></div>
									) : (
										cell >= 5 && (
											<div className="w-[25%] h-[25%] bg-black rounded-full"></div>
										)
									)}
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default App;
