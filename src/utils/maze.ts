export function isEndReachable(maze: number[][]): boolean {
	if (!maze || maze.length === 0 || maze[0].length === 0) {
		return false;
	}

	const width = maze[0].length;
	const height = maze.length;
	const start = { x: 1, y: 1 };
	const end = { x: width - 2, y: height - 2 };

	const visited: boolean[][] = [];
	for (let i = 0; i < height; i++) {
		visited.push(Array(width).fill(false));
	}

	function dfs(x: number, y: number) {
		if (x === end.x && y === end.y) {
			return true;
		}
		visited[y][x] = true;
		const directions = [
			{ x: 0, y: -1 },
			{ x: 0, y: 1 },
			{ x: -1, y: 0 },
			{ x: 1, y: 0 },
		];
		for (const direction of directions) {
			const newX = x + direction.x;
			const newY = y + direction.y;
			if (
				newY > 0 &&
				newY < height &&
				newX > 0 &&
				newX < width &&
				maze[newY][newX] !== 1 &&
				!visited[newY][newX]
			) {
				if (dfs(newX, newY)) {
					return true;
				}
			}
		}
		return false;
	}

	return dfs(start.x, start.y);
}

export function generateMaze(width: number, height: number): number[][] {
	const maze: number[][] = [];
	for (let i = 0; i < height; i++) {
		maze.push(Array(width).fill(1));
	}

	const start = { x: 1, y: 1 };
	const end = { x: width - 2, y: height - 2 };
	maze[start.y][start.x] = 2;
	maze[end.y][end.x] = 3;

	function generatePath(x: number, y: number) {
		const directions = [
			{ x: 0, y: -1 },
			{ x: 0, y: 1 },
			{ x: -1, y: 0 },
			{ x: 1, y: 0 },
		];

		shuffleArray(directions).forEach((direction) => {
			const newX = x + direction.x * 2;
			const newY = y + direction.y * 2;
			if (
				newY > 0 &&
				newY < height &&
				newX > 0 &&
				newX < width &&
				maze[newY][newX] === 1
			) {
				maze[y + direction.y][x + direction.x] = 0;
				maze[newY][newX] = 0;
				generatePath(newX, newY);
			}
		});
	}

	generatePath(end.x, end.y);

	function finalizeMaze() {
		const choice = Math.random() > 0.5 ? true : false;
		if (choice) {
			maze[1][2] = 0;
		} else {
			maze[2][1] = 0;
		}
		if (!isEndReachable(maze)) {
			if (choice) {
				maze[1][2] = 1;
				maze[2][1] = 0;
			} else {
				maze[2][1] = 1;
				maze[1][2] = 0;
			}
		}
	}

	finalizeMaze();

	return maze;
}

function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

export const isValidMove = (
	maze: number[][],
	x: number,
	y: number
): boolean => {
	if (
		maze[y][x] === 0 ||
		maze[y][x] === 2 ||
		maze[y][x] === 3 ||
		maze[y][x] >= 5
	) {
		return true;
	}
	return false;
};

export const checkWin = (maze: number[][], x: number, y: number): boolean => {
	if (maze[y][x] === 3) {
		return true;
	}
	return false;
};
